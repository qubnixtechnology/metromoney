USE matrimonial_db;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS intro_video VARCHAR(500) NULL AFTER photo;

CREATE TABLE IF NOT EXISTS user_media (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  type ENUM('photo', 'video', 'voice') NOT NULL DEFAULT 'photo',
  url VARCHAR(500) NOT NULL,
  mime_type VARCHAR(120) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_media (user_id, type),
  CONSTRAINT fk_user_media_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
