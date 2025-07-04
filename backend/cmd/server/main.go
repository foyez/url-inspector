package main

import (
	"log"

	"github.com/foyez/sykell-fs/server/internal/api"
	"github.com/foyez/sykell-fs/server/internal/util"
)

func main() {
	config, err := util.LoadConfig("./.env")
	if err != nil {
		log.Fatal("cannot load config: ", err)
	}

	server := api.NewServer()
	err = server.Start(config.ServerAddress)
	if err != nil {
		log.Fatal("cannot start server: ", err)
	}
}
