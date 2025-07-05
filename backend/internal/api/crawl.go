package api

import (
	"context"
	"net/http"
	"strconv"

	db "github.com/foyez/url-inspector/backend/internal/db/sqlc"
	"github.com/foyez/url-inspector/backend/internal/jobs"
	"github.com/foyez/url-inspector/backend/internal/models"
	"github.com/gin-gonic/gin"
)

func (server *Server) startCrawl(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		Fail(ctx, http.StatusBadRequest, "invalid URL ID")
		return
	}

	if jobs.Exists(id) {
		Fail(ctx, http.StatusConflict, "crawl already running")
		return
	}

	urlRow, err := server.store.GetURLByID(ctx, id)
	if err != nil {
		Fail(ctx, http.StatusNotFound, "URL not found")
		return
	}

	jobs.StartCrawlJob(server.store, id, urlRow.Url)

	Success(ctx, http.StatusAccepted, gin.H{
		"message": "Crawl started",
		"status":  models.StatusRunning,
		"id":      id,
	})
}

func (server *Server) stopCrawl(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		Fail(ctx, http.StatusBadRequest, "invalid ID")
		return
	}

	if !jobs.Exists(id) {
		Fail(ctx, http.StatusNotFound, "no running crawl for this URL")
		return
	}

	jobs.Cancel(id)

	_ = server.store.UpdateStatus(context.Background(), db.UpdateStatusParams{
		ID:     id,
		Status: models.StatusError,
	})

	Success(ctx, http.StatusOK, gin.H{
		"message": "Crawl stopped",
		"status":  models.StatusError,
		"id":      id,
	})
}
