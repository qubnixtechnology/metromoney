<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

require_admin();

$body = request_json();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    db()->prepare('INSERT INTO campaigns (name, channel, message, status) VALUES (?, ?, ?, "queued")')
        ->execute([$body['name'] ?? 'Campaign', $body['channel'] ?? 'push', $body['message'] ?? '']);
    json_response(['ok' => true], 201);
}

json_response(['campaigns' => db()->query('SELECT * FROM campaigns ORDER BY created_at DESC LIMIT 100')->fetchAll()]);

