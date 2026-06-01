<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

$user = require_user();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = db()->prepare('SELECT i.*, u.name, u.photo, u.city, u.profession FROM interests i JOIN users u ON u.id = i.receiver_id WHERE sender_id = ? ORDER BY i.created_at DESC');
    $stmt->execute([$user['id']]);
    json_response(['interests' => $stmt->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = request_json();
    db()->prepare('INSERT IGNORE INTO interests (sender_id, receiver_id, status) VALUES (?, ?, "sent")')->execute([$user['id'], (int) $body['receiver_id']]);
    json_response(['ok' => true], 201);
}

json_response(['error' => 'Method not allowed'], 405);

