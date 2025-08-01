// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.29.0
// source: broken_links.sql

package db

import (
	"context"
)

const deleteBrokenLinksByURL = `-- name: DeleteBrokenLinksByURL :exec
DELETE FROM broken_links
WHERE url_id = ?
`

func (q *Queries) DeleteBrokenLinksByURL(ctx context.Context, urlID int64) error {
	_, err := q.db.ExecContext(ctx, deleteBrokenLinksByURL, urlID)
	return err
}

const getBrokenLinksByURL = `-- name: GetBrokenLinksByURL :many
SELECT id, url_id, link, status_code FROM broken_links
WHERE url_id = ?
ORDER BY id
`

func (q *Queries) GetBrokenLinksByURL(ctx context.Context, urlID int64) ([]BrokenLink, error) {
	rows, err := q.db.QueryContext(ctx, getBrokenLinksByURL, urlID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []BrokenLink
	for rows.Next() {
		var i BrokenLink
		if err := rows.Scan(
			&i.ID,
			&i.UrlID,
			&i.Link,
			&i.StatusCode,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const insertBrokenLink = `-- name: InsertBrokenLink :exec
INSERT INTO broken_links (url_id, link, status_code)
VALUES (?, ?, ?)
`

type InsertBrokenLinkParams struct {
	UrlID      int64  `json:"url_id"`
	Link       string `json:"link"`
	StatusCode int32  `json:"status_code"`
}

func (q *Queries) InsertBrokenLink(ctx context.Context, arg InsertBrokenLinkParams) error {
	_, err := q.db.ExecContext(ctx, insertBrokenLink, arg.UrlID, arg.Link, arg.StatusCode)
	return err
}
