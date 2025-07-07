package util

import (
	"log"
)

func LogError(err error, message string) {
	if err != nil {
		log.Printf("[ERROR] %s: %v\n", message, err)
	}
}
