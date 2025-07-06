package api

import (
	"github.com/gin-gonic/gin"
)

type APIResponse struct {
	Success bool   `json:"success"`
	Data    any    `json:"data,omitempty"`
	Error   string `json:"error,omitempty"`
}

// 2xx
func Success(ctx *gin.Context, status int, data any) {
	ctx.JSON(status, APIResponse{
		Success: true,
		Data:    data,
	})
}

// 4xx / 5xx
func Fail(ctx *gin.Context, status int, msg string) {
	ctx.JSON(status, APIResponse{
		Success: false,
		Error:   msg,
	})
}

// 4xx / 5xx
func FailWithAbort(ctx *gin.Context, status int, msg string) {
	ctx.AbortWithStatusJSON(status, APIResponse{
		Success: false,
		Error:   msg,
	})
}
