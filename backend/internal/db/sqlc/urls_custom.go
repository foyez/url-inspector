package db

import "context"

const listURLs = `-- name: ListURLs :many
SELECT id, url, title, html_version, internal_links, external_links, broken_links, has_login_form, status, created_at, updated_at FROM urls
WHERE 
  (? = '' OR MATCH(title) AGAINST (? IN NATURAL LANGUAGE MODE))
ORDER BY
  CASE
    WHEN ? = 'title' THEN title
    WHEN ? = 'html_version' THEN html_version
    WHEN ? = 'status' THEN status
    WHEN ? = 'internal_links' THEN CAST(internal_links AS CHAR)
    WHEN ? = 'external_links' THEN CAST(external_links AS CHAR)
    ELSE created_at
  END
DESC
LIMIT ? OFFSET ?
`

type ListURLsParams struct {
	Search string `json:"search"`
	SortBy string `json:"sort_by"`
	Limit  int32  `json:"limit"`
	Offset int32  `json:"offset"`
}

func (q *Queries) ListURLs(ctx context.Context, arg ListURLsParams) ([]Url, error) {
	rows, err := q.db.QueryContext(ctx, listURLs,
		arg.Search,
		arg.Search,
		arg.SortBy,
		arg.SortBy,
		arg.SortBy,
		arg.SortBy,
		arg.SortBy,
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
