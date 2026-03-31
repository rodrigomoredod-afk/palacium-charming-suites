-- Palacium — initial MySQL schema (UTF8MB4).
-- Aligns with types.ts, api/reservations.ts payload, and DataContext localStorage models.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS suites (
  id VARCHAR(32) NOT NULL PRIMARY KEY,
  name VARCHAR(512) NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  area VARCHAR(64) NOT NULL,
  adults INT UNSIGNED NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  author VARCHAR(255) NOT NULL,
  nationality VARCHAR(128) NULL,
  rating TINYINT UNSIGNED NOT NULL,
  comment TEXT NOT NULL,
  review_date VARCHAR(128) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_reviews_rating CHECK (rating >= 1 AND rating <= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reservations (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  source VARCHAR(32) NOT NULL,
  status VARCHAR(32) NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guest_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(128) NULL,
  adults INT UNSIGNED NOT NULL,
  children_count INT UNSIGNED NOT NULL DEFAULT 0,
  suite_ids JSON NOT NULL,
  suite_names JSON NOT NULL,
  nights INT UNSIGNED NOT NULL,
  total_price DECIMAL(10, 2) NULL,
  nif VARCHAR(32) NULL,
  notes TEXT NULL,
  external_ref VARCHAR(255) NULL,
  created_at DATETIME(3) NOT NULL,
  updated_at DATETIME(3) NULL,
  KEY idx_reservations_check_in (check_in),
  KEY idx_reservations_status (status),
  KEY idx_reservations_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Single-row CMS blob (hero PT/EN + optional slideshow override JSON array).
CREATE TABLE IF NOT EXISTS site_content (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY DEFAULT 1,
  hero_pt JSON NOT NULL,
  hero_en JSON NOT NULL,
  hero_slideshow_override JSON NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_site_content_singleton CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS site_settings (
  setting_key VARCHAR(64) NOT NULL PRIMARY KEY,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Future: replace ADMIN_USERS_JSON (ticket 3–5).
CREATE TABLE IF NOT EXISTS admin_users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(64) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('superadmin', 'admin', 'viewer') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_admin_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash VARCHAR(128) NOT NULL PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  expires_at DATETIME(3) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_admin_sessions_user (user_id),
  KEY idx_admin_sessions_expires (expires_at),
  CONSTRAINT fk_admin_sessions_user FOREIGN KEY (user_id) REFERENCES admin_users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
