package main

import (
	"database/sql"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/foyez/url-inspector/backend/internal/api"
	db "github.com/foyez/url-inspector/backend/internal/db/sqlc"
	"github.com/foyez/url-inspector/backend/internal/util"
	_ "github.com/go-sql-driver/mysql"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/mysql"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func main() {
	// Load configuration
	config, err := util.LoadConfig("./.env")
	if err != nil {
		log.Fatal("cannot load config: ", err)
	}

	// Run db migrations
	runDBMigration(config.MigrationURL, config.DBSource)

	// Connect to the database
	conn, err := sql.Open(config.DBDriver, config.DBSource)
	if err != nil {
		log.Fatal("❌ DB connection error: ", err)
	}
	defer conn.Close()

	// Start the API server
	store := db.NewStore(conn)
	server := api.NewServer(store)
	err = server.Start(config.ServerAddress)
	if err != nil {
		log.Fatal("cannot start server: ", err)
	}

	// Graceful shutdown on interrupt or termination signal
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	log.Println("Shutting down gracefully...")
}

func runDBMigration(migrationURL, dbSource string) {
	migration, err := migrate.New(migrationURL, dbSource)
	if err != nil {
		log.Fatal("cannot create new migrate instance: ", err)
	}

	if err = migration.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatal("failed to run migration up: ", err)
	}

	log.Println("✅ db migrated successfully")
}
