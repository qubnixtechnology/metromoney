<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

$user = require_user();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = request_json();
    db()->prepare('INSERT INTO verifications (user_id, type, document_url, status, notes) VALUES (?, ?, ?, "pending", ?)')
        ->execute([$user['id'], $body['type'] ?? 'government_id', $body['document_url'] ?? '', $body['notes'] ?? '']);
    json_response(['ok' => true], 201);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = db()->prepare('SELECT * FROM verifications WHERE user_id = ? ORDER BY created_at DESC');
    $stmt->execute([$user['id']]);
    json_response(['verifications' => $stmt->fetchAll()]);
}

json_response(['error' => 'Method not allowed'], 405);

