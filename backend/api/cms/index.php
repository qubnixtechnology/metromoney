<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['error' => 'Method not allowed'], 405);
}

$stmt = db()->query('SELECT slug, title, content, status, updated_at FROM cms_pages WHERE status = "published" ORDER BY slug ASC');
json_response(['pages' => $stmt->fetchAll()]);
