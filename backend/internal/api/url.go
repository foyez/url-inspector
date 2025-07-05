package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (server *Server) createURL(ctx *gin.Context) {
	// TODO: Parse input, insert URL into DB
	ctx.JSON(http.StatusCreated, gin.H{"message": "create url"})
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
