USE matrimonial_db;

ALTER TABLE subscriptions
  ADD INDEX idx_subscriptions_plan (plan_code),
  ADD CONSTRAINT fk_subscriptions_plan FOREIGN KEY (plan_code) REFERENCES subscription_plans(code) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE payments
  ADD CONSTRAINT fk_payments_subscription FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL;

ALTER TABLE verifications
  ADD COLUMN IF NOT EXISTS reviewed_by INT UNSIGNED NULL AFTER notes,
  ADD CONSTRAINT fk_verifications_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE reports
  ADD COLUMN IF NOT EXISTS handled_by INT UNSIGNED NULL AFTER resolution,
  ADD CONSTRAINT fk_reports_reported_user FOREIGN KEY (reported_user_id) REFERENCES users(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_reports_handler FOREIGN KEY (handled_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE campaigns
  ADD COLUMN IF NOT EXISTS created_by INT UNSIGNED NULL FIRST,
  ADD CONSTRAINT fk_campaigns_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE notifications
  ADD COLUMN IF NOT EXISTS campaign_id INT UNSIGNED NULL AFTER user_id,
  ADD CONSTRAINT fk_notifications_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL;

ALTER TABLE cms_pages
  ADD COLUMN IF NOT EXISTS created_by INT UNSIGNED NULL AFTER status,
  ADD COLUMN IF NOT EXISTS updated_by INT UNSIGNED NULL AFTER created_by,
  ADD CONSTRAINT fk_cms_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_cms_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE audit_logs
  ADD CONSTRAINT fk_audit_actor FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE SET NULL;
