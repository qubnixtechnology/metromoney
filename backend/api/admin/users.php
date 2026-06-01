<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

require_admin();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $users = db()->query('SELECT id, role, name, email, age, height, city, religion, community, profession, education, income, bio, photo, intro_video, status, verified, premium, created_at, updated_at FROM users ORDER BY created_at DESC LIMIT 500')->fetchAll();
    json_response(['users' => $users]);
}

$body = request_json();
db()->prepare('UPDATE users SET status = ? WHERE id = ?')->execute([$body['status'] ?? 'approved', (int) ($body['id'] ?? 0)]);
json_response(['ok' => true]);
