-- name: CreateURL :execresult
INSERT INTO urls (
  url,
  title,
  html_version,
  internal_links,
  external_links,
  broken_links,
  has_login_form,
  status
)
VALUES (
  ?, ?, ?, ?, ?, ?, ?, ?
);

-- name: GetURLByID :one
SELECT * FROM urls
WHERE id = ? LIMIT 1;

-- name: ListURLs :many
SELECT * FROM urls
WHERE 
  (title LIKE CONCAT('%', sqlc.arg(search), '%') OR sqlc.arg(search) = '')
ORDER BY
  CASE
    WHEN sqlc.arg(sort_by) = 'title' THEN title
    WHEN sqlc.arg(sort_by) = 'html_version' THEN html_version
    WHEN sqlc.arg(sort_by) = 'status' THEN status
    WHEN sqlc.arg(sort_by) = 'internal_links' THEN CAST(internal_links AS CHAR)
    WHEN sqlc.arg(sort_by) = 'external_links' THEN CAST(external_links AS CHAR)
    ELSE created_at
  END
DESC
LIMIT ? OFFSET ?;


-- name: UpdateStatus :exec
UPDATE urls SET status = ?
WHERE id = ?;

-- name: UpdateCrawlResult :exec
UPDATE urls
SET
  title = ?,
  html_version = ?,
  internal_links = ?,
  external_links = ?,
  broken_links = ?,
  has_login_form = ?,
  status = ?
WHERE id = ?;

-- name: DeleteURLs :exec
DELETE FROM urls
WHERE id IN (sqlc.slice('ids'));

-- name: ResetURL :exec
UPDATE urls
SET
  title = '',
  html_version = 'Unknown',
  has_login_form = false,
  internal_links = 0,
  external_links = 0,
  broken_links = 0,
  status = 'queued'
WHERE id = ?;