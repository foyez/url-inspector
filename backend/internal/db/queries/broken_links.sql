-- name: InsertBrokenLink :exec
INSERT INTO broken_links (url_id, link, status_code)
VALUES (?, ?, ?);

-- name: GetBrokenLinksByURL :many
SELECT * FROM broken_links
WHERE url_id = ?
ORDER BY id;

-- name: DeleteBrokenLinksByURL :exec
DELETE FROM broken_links
WHERE url_id = ?;