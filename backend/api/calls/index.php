<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

$user = require_user();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = request_json();
    $receiverId = (int) ($body['receiver_id'] ?? 0);
    $callType = $body['call_type'] ?? 'family_video';

    if (!$receiverId || !in_array($callType, ['audio', 'video', 'family_video'], true)) {
        json_response(['error' => 'Valid receiver and call type are required'], 422);
    }

    db()->prepare('INSERT INTO calls (caller_id, receiver_id, call_type, scheduled_at, status) VALUES (?, ?, ?, ?, "scheduled")')
        ->execute([$user['id'], $receiverId, $callType, $body['scheduled_at'] ?? null]);
    $id = (int) db()->lastInsertId();
    $stmt = db()->prepare('SELECT c.*, u.name AS receiver_name FROM calls c JOIN users u ON u.id = c.receiver_id WHERE c.id = ?');
    $stmt->execute([$id]);
    json_response(['call' => $stmt->fetch()], 201);
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $body = request_json();
    $status = $body['status'] ?? '';
    if (!in_array($status, ['scheduled', 'completed', 'missed', 'cancelled'], true)) {
        json_response(['error' => 'Invalid call status'], 422);
    }
    db()->prepare('UPDATE calls SET status = ? WHERE id = ? AND (caller_id = ? OR receiver_id = ?)')
        ->execute([$status, (int) ($body['id'] ?? 0), $user['id'], $user['id']]);
    json_response(['ok' => true]);
}

$stmt = db()->prepare('SELECT c.*, caller.name AS caller_name, receiver.name AS receiver_name
    FROM calls c
    JOIN users caller ON caller.id = c.caller_id
    JOIN users receiver ON receiver.id = c.receiver_id
    WHERE c.caller_id = ? OR c.receiver_id = ?
    ORDER BY c.created_at DESC');
$stmt->execute([$user['id'], $user['id']]);
json_response(['calls' => $stmt->fetchAll()]);
