<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

$user = require_user();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = db()->prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC');
    $stmt->execute([$user['id']]);
    json_response(['notifications' => $stmt->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = request_json();
    db()->prepare('INSERT INTO notifications (user_id, channel, title, body, status) VALUES (?, ?, ?, ?, "queued")')
        ->execute([$user['id'], $body['channel'] ?? 'push', $body['title'] ?? 'Alert', $body['body'] ?? '']);
    json_response(['ok' => true], 201);
}

json_response(['error' => 'Method not allowed'], 405);

