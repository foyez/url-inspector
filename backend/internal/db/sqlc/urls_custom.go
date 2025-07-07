package db

import (
	"context"
	"fmt"
	"strings"
)

var allowedOrderBy = map[string]bool{
	"title":          true,
	"html_version":   true,
	"status":         true,
	"internal_links": true,
	"external_links": true,
	"broken_links":   true,
	"created_at":     true,
}

// Sort direction validation
func isValidSortDir(dir string) bool {
	return dir == "ASC" || dir == "DESC"
}

type ListURLsParams struct {
	Search  string `json:"search"`
	SortBy  string `json:"sort_by"`
	SortDir string `json:"sort_dir"`
	Limit   int32  `json:"limit"`
	Offset  int32  `json:"offset"`
}

func (q *Queries) ListURLs(ctx context.Context, arg ListURLsParams) ([]Url, error) {
	// Validate column
	if !allowedOrderBy[arg.SortBy] {
		arg.SortBy = "created_at"
	}

	// Validate direction
	arg.SortDir = strings.ToUpper(arg.SortDir)
	if !isValidSortDir(arg.SortDir) {
		arg.SortDir = "DESC"
	}

	// Build dynamic query string
	listURLs := fmt.Sprintf(`
		SELECT id, url, title, html_version, internal_links, external_links, broken_links, has_login_form, status, created_at, updated_at FROM urls
		WHERE 
			(
				? = '' OR 
				MATCH(title) AGAINST (? IN NATURAL LANGUAGE MODE) OR
				title LIKE CONCAT('%%', ?, '%%')
			)
		ORDER BY %s %s
		LIMIT ? OFFSET ?
		`, arg.SortBy, arg.SortDir)

	rows, err := q.db.QueryContext(ctx, listURLs,
		arg.Search,
		arg.Search,
		arg.Search,
		arg.Limit,
		arg.Offset,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var urls []Url
	for rows.Next() {
		var u Url
		if err := rows.Scan(
			&u.ID,
			&u.Url,
			&u.Title,
			&u.HtmlVersion,
			&u.InternalLinks,
			&u.ExternalLinks,
			&u.BrokenLinks,
			&u.HasLoginForm,
			&u.Status,
			&u.CreatedAt,
			&u.UpdatedAt,
		); err != nil {
			return nil, err
		}
		urls = append(urls, u)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return urls, nil
}

const countURLs = `-- name: CountURLs :one
SELECT COUNT(*) FROM urls WHERE (? = '' OR MATCH(title) AGAINST (? IN NATURAL LANGUAGE MODE) OR title LIKE CONCAT('%', ?, '%'))
`

func (q *Queries) CountURLs(ctx context.Context, search string) (int64, error) {
	row := q.db.QueryRowContext(ctx, countURLs, search, search, search)
	var count int64
	err := row.Scan(&count)
	return count, err
}
