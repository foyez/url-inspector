package api

import (
	"net/http"
	"time"

	db "github.com/foyez/url-inspector/backend/internal/db/sqlc"
	"github.com/foyez/url-inspector/backend/internal/util"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// server serves HTTP requests.
type Server struct {
	router *gin.Engine
	store  *db.Store
	config util.Config
}

// NewServer creates a new HTTP server and setup routing.
func NewServer(config util.Config, store *db.Store) *Server {
	server := &Server{
		store:  store,
		config: config,
	}

	server.setupRouter(config)

	return server
}

// setupRouter setups the routers
func (server *Server) setupRouter(config util.Config) {
	router := gin.Default()

	// CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins: config.AllowedOrigins,
		AllowMethods: []string{
			http.MethodHead,
			http.MethodOptions,
			http.MethodGet,
			http.MethodPost,
			http.MethodPut,
			http.MethodPatch,
			http.MethodDelete,
		},
		AllowHeaders: []string{
			"Content-Type",
			"Authorization",
		},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	urls := router.Group("/api/urls")
	urls.Use(authMiddleware(config)) // apply auth
	{
		urls.POST("/", server.createURL)
		urls.GET("/", server.listURLs)
		urls.POST("/:id/start", server.startCrawl)
		urls.POST("/:id/stop", server.stopCrawl)
		urls.GET("/:id", server.getURLDetails)
		urls.DELETE("/", server.bulkDeleteURLs)
		urls.POST("/rerun", server.bulkRerunURLs)
	}

	server.router = router
}

// Start runs the HTTP server on a specific address.
func (server *Server) Start(address string) error {
	return server.router.Run(address)
}

// errorResponse returns error messages in specific format
func errorResponse(err error) gin.H {
	return gin.H{"error": err.Error()}
}
