package api

import (
	"fmt"
	"log"
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
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
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
		log.Println("error")
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	id, err := res.LastInsertId()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	urlData, err := server.store.GetURLByID(ctx, id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusCreated, urlData)
}

func (server *Server) listURLs(ctx *gin.Context) {
	rsp, err := server.store.ListURLs(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, rsp)
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
		err := fmt.Errorf("invalid ID")
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	urlData, err := server.store.GetURLByID(ctx, id)
	if err != nil {
		err := fmt.Errorf("URL not found")
		ctx.JSON(http.StatusNotFound, errorResponse(err))
		return
	}

	headings, err := server.store.GetHeadingCountsByURL(ctx, id)
	if err != nil {
		err := fmt.Errorf("failed to fetch heading counts")
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	brokenLinksDB, err := server.store.GetBrokenLinksByURL(ctx, id)
	if err != nil {
		err := fmt.Errorf("failed to fetch broken links")
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
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

	ctx.JSON(http.StatusOK, rsp)
}

type BulkDeleteRequest struct {
	URLIDs []int64 `json:"url_ids"`
}

func (server *Server) bulkDeleteURLs(ctx *gin.Context) {
	var req BulkDeleteRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	// stop running jobs before deletion
	for _, id := range req.URLIDs {
		jobs.Cancel(id)
	}

	err := server.store.DeleteURLs(ctx, req.URLIDs)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(fmt.Errorf("failed to delete records")))
		return
	}

	ctx.JSON(http.StatusNoContent, gin.H{"message": "URLs deleted"})
}

type BulkRerunRequest struct {
	URLIDs []int64 `json:"url_ids"`
}

func (server *Server) bulkRerunURLs(ctx *gin.Context) {
	var req BulkDeleteRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
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

	ctx.JSON(http.StatusOK, gin.H{"message": "URLs queued for rerun"})
}
