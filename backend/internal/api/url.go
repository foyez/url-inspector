package api

import (
	"net/http"
	"strconv"

	db "github.com/foyez/url-inspector/backend/internal/db/sqlc"
	"github.com/foyez/url-inspector/backend/internal/jobs"
	"github.com/foyez/url-inspector/backend/internal/models"
	"github.com/gin-gonic/gin"
)

type createURLRequest struct {
	Url string `json:"url" binding:"required,url"`
}

func (server *Server) createURL(ctx *gin.Context) {
	var req createURLRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		Fail(ctx, http.StatusBadRequest, "invalid or empty url")
		return
	}

	arg := db.CreateURLParams{
		Url:           req.Url,
		Title:         "",
		HtmlVersion:   "Unknown",
		InternalLinks: 0,
		ExternalLinks: 0,
		BrokenLinks:   0,
		HasLoginForm:  false,
		Status:        models.StatusQueued,
	}

	res, err := server.store.CreateURL(ctx, arg)
	if err != nil {
		// Check if it's a duplicate key error
		if db.ErrorCode(err) == db.UniqueViolation {
			Fail(ctx, http.StatusConflict, "url already exists")
			return
		}
		Fail(ctx, http.StatusInternalServerError, "failed to create URL")
		return
	}

	id, err := res.LastInsertId()
	if err != nil {
		Fail(ctx, http.StatusInternalServerError, "failed to create URL")
		return
	}

	urlData, err := server.store.GetURLByID(ctx, id)
	if err != nil {
		Fail(ctx, http.StatusInternalServerError, "failed to create URL")
		return
	}

	Success(ctx, http.StatusCreated, urlData)
}

type listURLsQuery struct {
	Page        int     `form:"page"`
	PageSize    int     `form:"page_size"`
	SortBy      string  `form:"sort_by"`
	SortDir     string  `form:"sort_dir"`
	Search      string  `form:"search"`
	Status      *string `form:"status"`
	HTMLVersion *string `form:"html_version"`
}

func (server *Server) listURLs(ctx *gin.Context) {
	var q listURLsQuery
	if err := ctx.ShouldBindQuery(&q); err != nil {
		Fail(ctx, http.StatusBadRequest, "invalid query params")
		return
	}

	if q.Page <= 0 {
		q.Page = 1
	}
	if q.PageSize <= 0 {
		q.PageSize = 10
	}
	if q.Search == "" {
		q.Search = ""
	}
	offset := (q.Page - 1) * q.PageSize

	urls, err := server.store.ListURLs(ctx, db.ListURLsParams{
		Search:      q.Search,
		SortBy:      q.SortBy,
		SortDir:     q.SortDir,
		Limit:       int32(q.PageSize),
		Offset:      int32(offset),
		Status:      q.Status,
		HtmlVersion: q.HTMLVersion,
	})
	if err != nil {
		Fail(ctx, http.StatusInternalServerError, "failed to fetch URL list")
		return
	}

	total, err := server.store.CountURLs(ctx, db.CountURLsParams{
		Search:      q.Search,
		Status:      q.Status,
		HtmlVersion: q.HTMLVersion,
	})
	if err != nil {
		Fail(ctx, http.StatusInternalServerError, "failed to count URLs")
		return
	}

	if urls == nil {
		urls = []db.Url{}
	}

	Success(ctx, http.StatusOK, gin.H{
		"urls":  urls,
		"total": total,
	})
}

type URLDetailsResponse struct {
	ID                 int64           `json:"id"`
	Title              string          `json:"title"`
	HTMLVersion        string          `json:"html_version"`
	HasLoginForm       bool            `json:"has_login_form"`
	HeadingCounts      HeadingCounts   `json:"heading_counts"`
	InternalLinksCount int32           `json:"internal_links"`
	ExternalLinksCount int32           `json:"external_links"`
	BrokenLinks        []BrokenLinkRsp `json:"broken_links"`
}

type BrokenLinkRsp struct {
	Link       string `json:"link"`
	StatusCode int32  `json:"status_code"`
}

type HeadingCounts struct {
	H1 int32 `json:"h1"`
	H2 int32 `json:"h2"`
	H3 int32 `json:"h3"`
	H4 int32 `json:"h4"`
	H5 int32 `json:"h5"`
	H6 int32 `json:"h6"`
}

func (server *Server) getURLDetails(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		Fail(ctx, http.StatusBadRequest, "invalid ID")
		return
	}

	urlData, err := server.store.GetURLByID(ctx, id)
	if err != nil {
		Fail(ctx, http.StatusNotFound, "URL not found")
		return
	}

	headings, err := server.store.GetHeadingCountsByURL(ctx, id)
	if err != nil {
		Fail(ctx, http.StatusInternalServerError, "failed to fetch heading counts")
		return
	}

	brokenLinksDB, err := server.store.GetBrokenLinksByURL(ctx, id)
	if err != nil {
		Fail(ctx, http.StatusInternalServerError, "failed to fetch broken links")
		return
	}

	brokenLinks := make([]BrokenLinkRsp, 0, len(brokenLinksDB))
	for _, bl := range brokenLinksDB {
		brokenLinks = append(brokenLinks, BrokenLinkRsp{
			Link:       bl.Link,
			StatusCode: bl.StatusCode,
		})
	}

	rsp := URLDetailsResponse{
		ID:                 urlData.ID,
		Title:              urlData.Title,
		HTMLVersion:        urlData.HtmlVersion,
		HasLoginForm:       urlData.HasLoginForm,
		InternalLinksCount: urlData.InternalLinks,
		ExternalLinksCount: urlData.ExternalLinks,
		HeadingCounts: HeadingCounts{
			H1: headings.H1Count,
			H2: headings.H2Count,
			H3: headings.H3Count,
			H4: headings.H4Count,
			H5: headings.H5Count,
			H6: headings.H6Count,
		},
		BrokenLinks: brokenLinks,
	}

	Success(ctx, http.StatusOK, rsp)
}

type BulkDeleteRequest struct {
	URLIDs []int64 `json:"url_ids"`
}

func (server *Server) bulkDeleteURLs(ctx *gin.Context) {
	var req BulkDeleteRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		Fail(ctx, http.StatusBadRequest, "invalid or empty url_ids")
		return
	}

	// stop running jobs before deletion
	for _, id := range req.URLIDs {
		jobs.Cancel(id)
	}

	err := server.store.DeleteURLs(ctx, req.URLIDs)
	if err != nil {
		Fail(ctx, http.StatusInternalServerError, "failed to delete records")
		return
	}

	Success(ctx, http.StatusOK, gin.H{"message": "URLs deleted"})
}

type BulkRerunRequest struct {
	URLIDs []int64 `json:"url_ids"`
}

func (server *Server) bulkRerunURLs(ctx *gin.Context) {
	var req BulkDeleteRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		Fail(ctx, http.StatusBadRequest, "invalid or empty url_ids")
		return
	}

	for _, id := range req.URLIDs {
		// cancel if running
		jobs.Cancel(id)

		// Delete old data
		err := server.store.DeleteBrokenLinksByURL(ctx, id)
		if err != nil {
			continue
		}

		err = server.store.DeleteHeadingCountsByURL(ctx, id)
		if err != nil {
			continue
		}

		// Reset URL metadata
		err = server.store.ResetURL(ctx, id)
		if err != nil {
			continue
		}

		// Trigger recrawl
		urlRow, err := server.store.GetURLByID(ctx, id)
		if err != nil {
			continue
		}
		jobs.StartCrawlJob(server.store, id, urlRow.Url)
	}

	Success(ctx, http.StatusOK, gin.H{"message": "URLs queued for rerun"})
}
