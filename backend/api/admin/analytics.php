<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

require_admin();
$analytics = [
    'users' => (int) db()->query('SELECT COUNT(*) FROM users')->fetchColumn(),
    'premium' => (int) db()->query('SELECT COUNT(*) FROM users WHERE premium = 1')->fetchColumn(),
    'interests' => (int) db()->query('SELECT COUNT(*) FROM interests')->fetchColumn(),
    'messages' => (int) db()->query('SELECT COUNT(*) FROM messages')->fetchColumn(),
    'reports' => (int) db()->query('SELECT COUNT(*) FROM reports WHERE status = "open"')->fetchColumn(),
    'verifications_pending' => (int) db()->query('SELECT COUNT(*) FROM verifications WHERE status = "pending"')->fetchColumn(),
];
json_response(['analytics' => $analytics]);

