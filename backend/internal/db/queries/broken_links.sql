-- name: CreateBrokenLink :execresult
INSERT INTO broken_links (url_id, link, status_code)
VALUES ($1, $2, $3);

-- name: GetBrokenLinksByURL :many
SELECT * FROM broken_links
WHERE url_id = $1
ORDER BY id;

-- name: DeleteBrokenLinksByURL :exec
DELETE FROM broken_links
WHERE url_id = $1;