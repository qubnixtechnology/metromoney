<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

$user = require_user();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = db()->prepare('SELECT m.*, u.name AS receiver_name FROM messages m JOIN users u ON u.id = m.receiver_id WHERE sender_id = ? OR receiver_id = ? ORDER BY m.created_at DESC');
    $stmt->execute([$user['id'], $user['id']]);
    json_response(['messages' => $stmt->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = request_json();
    db()->prepare('INSERT INTO messages (sender_id, receiver_id, body) VALUES (?, ?, ?)')->execute([$user['id'], (int) $body['receiver_id'], trim($body['body'] ?? '')]);
    json_response(['ok' => true], 201);
}

json_response(['error' => 'Method not allowed'], 405);

