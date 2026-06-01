<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

require_admin();
$stats = [
    'total_profiles' => (int) db()->query('SELECT COUNT(*) FROM users WHERE role = "user"')->fetchColumn(),
    'approved_profiles' => (int) db()->query('SELECT COUNT(*) FROM users WHERE role = "user" AND status = "approved"')->fetchColumn(),
    'pending_profiles' => (int) db()->query('SELECT COUNT(*) FROM users WHERE role = "user" AND status = "pending"')->fetchColumn(),
    'blocked_profiles' => (int) db()->query('SELECT COUNT(*) FROM users WHERE role = "user" AND status = "blocked"')->fetchColumn(),
    'verified_profiles' => (int) db()->query('SELECT COUNT(*) FROM users WHERE role = "user" AND verified = 1')->fetchColumn(),
    'premium_profiles' => (int) db()->query('SELECT COUNT(*) FROM users WHERE role = "user" AND premium = 1')->fetchColumn(),
    'admins' => (int) db()->query('SELECT COUNT(*) FROM users WHERE role = "admin"')->fetchColumn(),
    'interests' => (int) db()->query('SELECT COUNT(*) FROM interests')->fetchColumn(),
    'messages' => (int) db()->query('SELECT COUNT(*) FROM messages')->fetchColumn(),
    'subscriptions' => (int) db()->query('SELECT COUNT(*) FROM subscriptions')->fetchColumn(),
    'payments' => (int) db()->query('SELECT COUNT(*) FROM payments')->fetchColumn(),
    'reports' => (int) db()->query('SELECT COUNT(*) FROM reports')->fetchColumn(),
    'verifications' => (int) db()->query('SELECT COUNT(*) FROM verifications')->fetchColumn(),
    'cms_pages' => (int) db()->query('SELECT COUNT(*) FROM cms_pages')->fetchColumn(),
    'campaigns' => (int) db()->query('SELECT COUNT(*) FROM campaigns')->fetchColumn(),
];

json_response(['stats' => $stats]);
