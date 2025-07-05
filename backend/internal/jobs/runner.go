package jobs

import (
	"context"

	"github.com/foyez/url-inspector/backend/internal/crawler"
	db "github.com/foyez/url-inspector/backend/internal/db/sqlc"
	"github.com/foyez/url-inspector/backend/internal/models"
	"github.com/foyez/url-inspector/backend/internal/util"
)

func StartCrawlJob(store *db.Store, id int64, rawURL string) {
	ctx, cancel := context.WithCancel(context.Background())
	Add(id, cancel)

	go func() {
		defer Remove(id)

		dbCtx := context.Background()

		// Update status to "running"
		err := store.UpdateStatus(dbCtx, db.UpdateStatusParams{
			ID:     id,
			Status: models.StatusRunning,
		})
		if err != nil {
			util.LogError(err, "updating status to running")
			return
		}

		result, err := crawler.CrawlWithContext(ctx, rawURL)
		if err != nil {
			util.LogError(err, "crawling URL")
			_ = store.UpdateStatus(dbCtx, db.UpdateStatusParams{
				ID:     id,
				Status: models.StatusError,
			})
			return
		}

		// Save crawl result
		err = store.UpdateCrawlResult(dbCtx, db.UpdateCrawlResultParams{
			ID:            id,
			Title:         result.Title,
			HtmlVersion:   result.HTMLVersion,
			InternalLinks: int32(len(result.InternalLinks)),
			ExternalLinks: int32(len(result.ExternalLinks)),
			BrokenLinks:   int32(len(result.BrokenLinks)),
			HasLoginForm:  result.HasLoginForm,
			Status:        models.StatusDone,
		})
		if err != nil {
			util.LogError(err, "updating crawl result")
			return
		}

		// Save heading counts
		err = store.InsertHeadingCount(dbCtx, db.InsertHeadingCountParams{
			UrlID:   id,
			H1Count: int32(result.Headings["h1"]),
			H2Count: int32(result.Headings["h2"]),
			H3Count: int32(result.Headings["h3"]),
			H4Count: int32(result.Headings["h4"]),
			H5Count: int32(result.Headings["h5"]),
			H6Count: int32(result.Headings["h6"]),
		})
		if err != nil {
			util.LogError(err, "inserting heading counts")
			return
		}

		// Save broken links
		for link, code := range result.BrokenLinks {
			err = store.InsertBrokenLink(dbCtx, db.InsertBrokenLinkParams{
				UrlID:      id,
				Link:       link,
				StatusCode: int32(code),
			})
			if err != nil {
				util.LogError(err, "inserting broken link")
				return
			}
		}
	}()
}
