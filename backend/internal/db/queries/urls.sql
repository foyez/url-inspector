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
  $1, $2, $3, $4, $5, $6, $7, $8
);

-- name: ListURLs :many
SELECT * FROM urls ORDER BY created_at DESC;