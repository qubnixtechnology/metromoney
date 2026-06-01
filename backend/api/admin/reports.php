<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

require_admin();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $reports = db()->query('SELECT r.*, u.name AS reporter_name FROM reports r JOIN users u ON u.id = r.reporter_id ORDER BY r.created_at DESC LIMIT 200')->fetchAll();
    json_response(['reports' => $reports]);
}

$body = request_json();
db()->prepare('UPDATE reports SET status = ?, resolution = ? WHERE id = ?')->execute([$body['status'] ?? 'resolved', $body['resolution'] ?? '', (int) ($body['id'] ?? 0)]);
json_response(['ok' => true]);

