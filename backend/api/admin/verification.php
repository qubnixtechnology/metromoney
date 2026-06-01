<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

require_admin();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $items = db()->query('SELECT v.*, u.name, u.email FROM verifications v JOIN users u ON u.id = v.user_id ORDER BY v.created_at DESC LIMIT 200')->fetchAll();
    json_response(['verifications' => $items]);
}

$body = request_json();
db()->prepare('UPDATE verifications SET status = ?, notes = ? WHERE id = ?')->execute([$body['status'] ?? 'approved', $body['notes'] ?? '', (int) ($body['id'] ?? 0)]);
json_response(['ok' => true]);

