package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (server *Server) startCrawl(ctx *gin.Context) {
	// TODO: Queue for crawling
	ctx.JSON(http.StatusOK, gin.H{"message": "start crawling"})
}

func (server *Server) stopCrawl(ctx *gin.Context) {
	// TODO: Stop crawl job if running
	ctx.JSON(http.StatusOK, gin.H{"message": "stop crawling"})
}
