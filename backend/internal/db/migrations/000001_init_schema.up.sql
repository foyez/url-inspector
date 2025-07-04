CREATE TABLE `urls` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `url` varchar(512) NOT NULL,
  `title` varchar(255),
  `html_version` varchar(50),
  `internal_links` int NOT NULL DEFAULT 0,
  `external_links` int NOT NULL DEFAULT 0,
  `broken_links` int NOT NULL DEFAULT 0,
  `has_login_form` boolean NOT NULL DEFAULT false,
  `status` varchar(20) NOT NULL DEFAULT 'queued' COMMENT 'queued, running, done, error',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Alter `updated_at` column to set `ON UPDATE CURRENT_TIMESTAMP`
ALTER TABLE `urls`
  MODIFY `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

CREATE TABLE `broken_links` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `url_id` bigint NOT NULL,
  `link` text NOT NULL,
  `status` int NOT NULL
);

CREATE INDEX `idx_created_at` ON `urls` (`created_at`);

CREATE INDEX `idx_status` ON `urls` (`status`);

CREATE INDEX `idx_url` ON `urls` (`url`);

CREATE INDEX `idx_url_id` ON `broken_links` (`url_id`);

ALTER TABLE `urls` COMMENT = 'Stores analysis data about a given URL';

ALTER TABLE `broken_links` COMMENT = 'Stores broken (4xx/5xx) links found for a given URL';

ALTER TABLE `broken_links` ADD FOREIGN KEY (`url_id`) REFERENCES `urls` (`id`);
