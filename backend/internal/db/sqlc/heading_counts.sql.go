// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.29.0
// source: heading_counts.sql

package db

import (
	"context"
)

const deleteHeadingCountsByURL = `-- name: DeleteHeadingCountsByURL :exec
DELETE FROM heading_counts
WHERE url_id = ?
`

func (q *Queries) DeleteHeadingCountsByURL(ctx context.Context, urlID int64) error {
	_, err := q.db.ExecContext(ctx, deleteHeadingCountsByURL, urlID)
	return err
}

const getHeadingCountsByURL = `-- name: GetHeadingCountsByURL :one
SELECT id, url_id, h1_count, h2_count, h3_count, h4_count, h5_count, h6_count FROM heading_counts
WHERE url_id = ?
`

func (q *Queries) GetHeadingCountsByURL(ctx context.Context, urlID int64) (HeadingCount, error) {
	row := q.db.QueryRowContext(ctx, getHeadingCountsByURL, urlID)
	var i HeadingCount
	err := row.Scan(
		&i.ID,
		&i.UrlID,
		&i.H1Count,
		&i.H2Count,
		&i.H3Count,
		&i.H4Count,
		&i.H5Count,
		&i.H6Count,
	)
	return i, err
}

const insertHeadingCount = `-- name: InsertHeadingCount :exec
INSERT INTO heading_counts (
  url_id,
  h1_count,
  h2_count,
  h3_count,
  h4_count,
  h5_count,
  h6_count
) VALUES (?, ?, ?, ?, ?, ?, ?)
`

type InsertHeadingCountParams struct {
	UrlID   int64 `json:"url_id"`
	H1Count int32 `json:"h1_count"`
	H2Count int32 `json:"h2_count"`
	H3Count int32 `json:"h3_count"`
	H4Count int32 `json:"h4_count"`
	H5Count int32 `json:"h5_count"`
	H6Count int32 `json:"h6_count"`
}

func (q *Queries) InsertHeadingCount(ctx context.Context, arg InsertHeadingCountParams) error {
	_, err := q.db.ExecContext(ctx, insertHeadingCount,
		arg.UrlID,
		arg.H1Count,
		arg.H2Count,
		arg.H3Count,
		arg.H4Count,
		arg.H5Count,
		arg.H6Count,
	)
	return err
}
