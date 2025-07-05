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
SELECT * FROM urls ORDER BY created_at DESC;

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