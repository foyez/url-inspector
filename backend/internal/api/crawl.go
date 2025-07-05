package api

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/foyez/url-inspector/backend/internal/crawler"
	db "github.com/foyez/url-inspector/backend/internal/db/sqlc"
	"github.com/foyez/url-inspector/backend/internal/jobs"
	"github.com/foyez/url-inspector/backend/internal/models"
	"github.com/foyez/url-inspector/backend/internal/util"
	"github.com/gin-gonic/gin"
)

func (server *Server) startCrawl(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		err = fmt.Errorf("invalid ID")
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	if jobs.Exists(id) {
		err := fmt.Errorf("crawl already running")
		ctx.JSON(http.StatusConflict, errorResponse(err))
		return
	}

	crawlCtx, cancel := context.WithCancel(context.Background())
	jobs.Add(id, cancel)
	log.Println("call", id)

	// Start async crawl
	go func() {
		defer jobs.Remove(id)

		dbCtx := context.Background()

		// Update status to "running"
		arg := db.UpdateStatusParams{
			ID:     id,
			Status: models.StatusRunning,
		}
		err := server.store.UpdateStatus(dbCtx, arg)
		if err != nil {
			util.LogError(err, "updating status to running")
			return
		}

		// Get URL
		urlEntry, err := server.store.GetURLByID(dbCtx, id)
		if err != nil {
			util.LogError(err, "fetching URL entry")
			_ = server.store.UpdateStatus(dbCtx, db.UpdateStatusParams{
				ID:     id,
				Status: models.StatusError,
			})
			return
		}

		result, err := crawler.CrawlWithContext(crawlCtx, urlEntry.Url)
		if err != nil {
			util.LogError(err, "crawling URL")
			_ = server.store.UpdateStatus(dbCtx, db.UpdateStatusParams{
				ID:     id,
				Status: models.StatusError,
			})
			return
		}

		// Save crawl result
		err = server.store.UpdateCrawlResult(dbCtx, db.UpdateCrawlResultParams{
			ID:            id,
			Title:         result.Title,
			HtmlVersion:   result.HTMLVersion,
			InternalLinks: int32(len(result.InternalLinks)),
			ExternalLinks: int32(len(result.ExternalLinks)),
			BrokenLinks:   int32(len(result.BrokenLinks)),
			HasLoginForm:  result.HasLoginForm,
			Status:        models.StatusDone,
		})
		if err != nil {
			util.LogError(err, "updating crawl result")
			return
		}

		// Save heading counts
		err = server.store.InsertHeadingCount(dbCtx, db.InsertHeadingCountParams{
			UrlID:   id,
			H1Count: int32(result.Headings["h1"]),
			H2Count: int32(result.Headings["h2"]),
			H3Count: int32(result.Headings["h3"]),
			H4Count: int32(result.Headings["h4"]),
			H5Count: int32(result.Headings["h5"]),
			H6Count: int32(result.Headings["h6"]),
		})
		if err != nil {
			util.LogError(err, "inserting heading counts")
			return
		}

		// Save broken links
		for link, code := range result.BrokenLinks {
			err = server.store.InsertBrokenLink(dbCtx, db.InsertBrokenLinkParams{
				UrlID:      id,
				Link:       link,
				StatusCode: int32(code),
			})
			if err != nil {
				util.LogError(err, "inserting broken link")
				return
			}
		}
	}()

	ctx.JSON(http.StatusAccepted, gin.H{
		"message": "Crawl started",
		"status":  models.StatusRunning,
		"id":      id,
	})
}

func (server *Server) stopCrawl(ctx *gin.Context) {
	// TODO: Stop crawl job if running
	ctx.JSON(http.StatusOK, gin.H{"message": "stop crawling"})
}
