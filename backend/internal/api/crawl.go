package api

import (
	"context"
	"fmt"
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
		err = fmt.Errorf("invalid ID")
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	if jobs.Exists(id) {
		err := fmt.Errorf("crawl already running")
		ctx.JSON(http.StatusConflict, errorResponse(err))
		return
	}

	urlRow, err := server.store.GetURLByID(ctx, id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, errorResponse(fmt.Errorf("RL not found")))
		return
	}

	jobs.StartCrawlJob(server.store, id, urlRow.Url)

	ctx.JSON(http.StatusAccepted, gin.H{
		"message": "Crawl started",
		"status":  models.StatusRunning,
		"id":      id,
	})
}

func (server *Server) stopCrawl(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		err := fmt.Errorf("invalid ID")
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	if !jobs.Exists(id) {
		err := fmt.Errorf("no running crawl for this URL")
		ctx.JSON(http.StatusNotFound, errorResponse(err))
		return
	}

	jobs.Cancel(id)

	_ = server.store.UpdateStatus(context.Background(), db.UpdateStatusParams{
		ID:     id,
		Status: models.StatusError,
	})

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Crawl stopped",
		"status":  models.StatusError,
		"id":      id,
	})
}
