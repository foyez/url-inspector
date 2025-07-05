package api

import (
	"log"
	"net/http"

	db "github.com/foyez/url-inspector/backend/internal/db/sqlc"
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
	// TODO: Fetch from DB
	ctx.JSON(http.StatusOK, gin.H{"message": "list urls"})
}

func (server *Server) getURLDetails(ctx *gin.Context) {
	// TODO: Return metadata + broken links
	ctx.JSON(http.StatusOK, gin.H{"message": "get url details"})
}

func (server *Server) bulkDeleteURLs(ctx *gin.Context) {
	// TODO: Delete multiple URLs + associated broken links
	ctx.JSON(http.StatusOK, gin.H{"message": "bulk delete"})
}

func (server *Server) bulkRerunURLs(ctx *gin.Context) {
	// TODO: Reset status to queued and delete old results
	ctx.JSON(http.StatusOK, gin.H{"message": "bulk rerun"})
}
