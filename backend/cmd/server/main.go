package main

import (
	"log"

	"github.com/foyez/sykell-fs/server/internal/api"
)

const (
	address = "0.0.0.0:4000"
)

func main() {
	server := api.NewServer()
	err := server.Start(address)
	if err != nil {
		log.Fatal("cannot start server: ", err)
	}
}
