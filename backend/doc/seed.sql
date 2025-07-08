-- Insert demo URLs
INSERT INTO urls (url, title, html_version, has_login_form, internal_links, external_links, broken_links, status)
VALUES
  ('https://example.com', 'Example Domain', 'HTML5', false, 10, 5, 1, 'done'),
  ('https://testsite.org', 'Test Site', 'HTML4', true, 8, 10, 2, 'done'),
  ('https://myblog.dev', 'My Blog', 'HTML5', false, 12, 3, 0, 'queued'),
  ('https://secureportal.io', 'Secure Portal', 'HTML5', true, 5, 7, 3, 'error'),
  ('https://news.com', 'Daily News', 'HTML5', false, 20, 15, 2, 'done'),
  ('https://storefront.io', 'Shop Online', 'HTML5', false, 18, 4, 0, 'done'),
  ('https://university.edu', 'University Portal', 'HTML4', true, 14, 6, 1, 'done'),
  ('https://login.net', 'Login Page', 'HTML5', true, 6, 8, 2, 'error'),
  ('https://docs.dev', 'Documentation Site', 'HTML5', false, 22, 1, 0, 'queued'),
  ('https://weatherapp.com', 'Weather Forecast', 'HTML5', false, 9, 5, 0, 'done'),
  ('https://musicstream.io', 'Music Stream', 'HTML5', false, 16, 4, 1, 'done'),
  ('https://recipes.org', 'Cooking Recipes', 'HTML4', false, 13, 7, 2, 'done'),
  ('https://blog.example', 'Dev Blog', 'HTML5', false, 11, 2, 0, 'queued'),
  ('https://portal.secure', 'Secure Login', 'HTML5', true, 5, 6, 3, 'error'),
  ('https://bookshelf.net', 'Bookshelf', 'HTML5', false, 17, 8, 0, 'done'),
  ('https://analytics.dev', 'Analytics Dashboard', 'HTML5', false, 14, 3, 1, 'done'),
  ('https://chat.app', 'Chat App', 'HTML5', true, 12, 4, 1, 'done'),
  ('https://events.org', 'Event Tracker', 'HTML4', false, 19, 5, 2, 'done'),
  ('https://jobsboard.com', 'Job Board', 'HTML5', false, 10, 9, 0, 'queued'),
  ('https://financepro.net', 'Finance Pro', 'HTML5', true, 15, 10, 2, 'error');

-- Insert matching heading counts
INSERT INTO heading_counts (url_id, h1_count, h2_count, h3_count, h4_count, h5_count, h6_count)
VALUES
  (1, 2, 3, 2, 1, 1, 1),
  (2, 3, 4, 1, 2, 2, 2),
  (3, 1, 5, 2, 3, 0, 3),
  (4, 2, 2, 1, 4, 1, 0),
  (5, 3, 3, 2, 0, 2, 1),
  (6, 1, 4, 1, 1, 0, 2),
  (7, 2, 5, 2, 2, 1, 3),
  (8, 3, 2, 1, 3, 2, 0),
  (9, 1, 3, 2, 4, 0, 1),
  (10, 2, 4, 1, 0, 1, 2),
  (11, 3, 5, 2, 1, 2, 3),
  (12, 1, 2, 1, 2, 0, 0),
  (13, 2, 3, 2, 3, 1, 1),
  (14, 3, 4, 1, 4, 2, 2),
  (15, 1, 5, 2, 0, 0, 3),
  (16, 2, 2, 1, 1, 1, 0),
  (17, 3, 3, 2, 2, 2, 1),
  (18, 1, 4, 1, 3, 0, 2),
  (19, 2, 5, 2, 4, 1, 3),
  (20, 3, 2, 1, 0, 2, 0);
-- Insert broken links
INSERT INTO broken_links (url_id, link, status_code)
VALUES
  (1, 'https://example.com/broken1', 404),
  (1, 'https://example.com/broken2', 500),
  (1, 'https://example.com/broken3', 403),
  (2, 'https://testsite.org/broken1', 404),
  (2, 'https://testsite.org/broken2', 502),
  (3, 'https://myblog.dev/dead', 404),
  (4, 'https://secureportal.io/timeout', 504),
  (4, 'https://secureportal.io/denied', 403),
  (5, 'https://news.com/broken-link', 404);
