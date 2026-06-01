<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

$user = require_user();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = request_json();
    db()->prepare('INSERT INTO reports (reporter_id, reported_user_id, reason, details, status) VALUES (?, ?, ?, ?, "open")')
        ->execute([$user['id'], (int) ($body['reported_user_id'] ?? 0), $body['reason'] ?? 'profile', $body['details'] ?? '']);
    json_response(['ok' => true], 201);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = db()->prepare('SELECT * FROM reports WHERE reporter_id = ? ORDER BY created_at DESC');
    $stmt->execute([$user['id']]);
    json_response(['reports' => $stmt->fetchAll()]);
}

json_response(['error' => 'Method not allowed'], 405);

