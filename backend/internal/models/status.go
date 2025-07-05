package models

type CrawlStatus string

const (
	StatusQueued  CrawlStatus = "queued"
	StatusRunning CrawlStatus = "running"
	StatusDone    CrawlStatus = "done"
	StatusError   CrawlStatus = "error"
)

func (s CrawlStatus) Valid() bool {
	switch s {
	case StatusQueued, StatusRunning, StatusDone, StatusError:
		return true
	}
	return false
}
