USE matrimonial_db;

CREATE TABLE IF NOT EXISTS campaign_recipients (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  campaign_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  notification_id INT UNSIGNED NULL,
  status ENUM('queued', 'sent', 'read', 'failed') NOT NULL DEFAULT 'queued',
  sent_at DATETIME NULL,
  read_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_campaign_user (campaign_id, user_id),
  INDEX idx_campaign_recipients_user (user_id, status),
  CONSTRAINT fk_campaign_recipients_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
  CONSTRAINT fk_campaign_recipients_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_campaign_recipients_notification FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE SET NULL
);
