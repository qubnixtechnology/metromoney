<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

$admin = require_admin();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    json_response(['pages' => db()->query('SELECT * FROM cms_pages ORDER BY updated_at DESC')->fetchAll()]);
}

$body = request_json();
$slug = trim($body['slug'] ?? '');
$title = trim($body['title'] ?? '');
$content = $body['content'] ?? '';
$status = $body['status'] ?? 'draft';

if ($slug === '' || $title === '' || !in_array($status, ['draft', 'published'], true)) {
    json_response(['error' => 'Valid slug, title, and status are required'], 422);
}

db()->prepare('INSERT INTO cms_pages (slug, title, content, status, created_by, updated_by)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE title = VALUES(title), content = VALUES(content), status = VALUES(status), updated_by = VALUES(updated_by)')
    ->execute([$slug, $title, $content, $status, $admin['id'], $admin['id']]);

$stmt = db()->prepare('SELECT * FROM cms_pages WHERE slug = ?');
$stmt->execute([$slug]);
json_response(['page' => $stmt->fetch()]);
