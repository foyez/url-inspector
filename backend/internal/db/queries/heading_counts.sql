-- name: InsertHeadingCount :exec
INSERT INTO heading_counts (
  url_id,
  h1_count,
  h2_count,
  h3_count,
  h4_count,
  h5_count,
  h6_count
) VALUES (?, ?, ?, ?, ?, ?, ?);

-- name: GetHeadingCountsByURL :many
SELECT * FROM heading_counts
WHERE url_id = ?
ORDER BY id;
