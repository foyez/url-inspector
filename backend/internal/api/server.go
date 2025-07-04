package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// server serves HTTP requests.
type Server struct {
	router *gin.Engine
}

func (server *Server) getHello(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, map[string]string{"msg": "Hello"})
}

// NewServer creates a new HTTP server and setup routing.
func NewServer() *Server {
	server := &Server{}
	router := gin.Default()

	router.GET("/hello", server.getHello)

	server.router = router
	return server
}

// Start runs the HTTP server on a specific address.
func (server *Server) Start(address string) error {
	return server.router.Run(address)
}
