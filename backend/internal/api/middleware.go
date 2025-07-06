package api

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/foyez/url-inspector/backend/internal/util"
	"github.com/gin-gonic/gin"
)

const (
	authorizationHeaderKey  = "authorization"
	authorizationTypeBearer = "bearer"
)

func authMiddleware(config util.Config) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authHeader := ctx.GetHeader(authorizationHeaderKey)

		if len(authHeader) == 0 {
			FailWithAbort(ctx, http.StatusUnauthorized, "authorization header is not provided")
			return
		}

		fields := strings.Fields(authHeader)
		if len(fields) < 2 {
			FailWithAbort(ctx, http.StatusUnauthorized, "invalid authorization header format")
			return
		}

		authorizationType := strings.ToLower(fields[0])
		if authorizationType != authorizationTypeBearer {
			FailWithAbort(ctx, http.StatusUnauthorized, fmt.Sprintf("unsupported authorization type %s", authorizationType))
			return
		}

		accessToken := fields[1]
		if accessToken != config.APIToken {
			FailWithAbort(ctx, http.StatusUnauthorized, "invalid api token")
			return
		}

		ctx.Next()
	}
}
