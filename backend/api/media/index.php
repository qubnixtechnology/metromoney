<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

$user = require_user();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Method not allowed'], 405);
}

if (empty($_FILES['media']) || !is_uploaded_file($_FILES['media']['tmp_name'])) {
    json_response(['error' => 'No media file uploaded'], 422);
}

$type = $_POST['type'] ?? 'photo';
$allowed = [
    'photo' => ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'],
    'video' => ['video/mp4' => 'mp4', 'video/webm' => 'webm', 'video/quicktime' => 'mov'],
    'voice' => ['audio/mpeg' => 'mp3', 'audio/wav' => 'wav', 'audio/webm' => 'webm'],
];

if (!isset($allowed[$type])) {
    json_response(['error' => 'Unsupported media type'], 422);
}

$mime = mime_content_type($_FILES['media']['tmp_name']) ?: '';
if (!isset($allowed[$type][$mime])) {
    json_response(['error' => 'Unsupported file format'], 422);
}

$maxBytes = $type === 'video' ? 25 * 1024 * 1024 : 6 * 1024 * 1024;
if ((int) $_FILES['media']['size'] > $maxBytes) {
    json_response(['error' => 'File is too large'], 422);
}

$uploadRoot = dirname(__DIR__) . '/uploads/' . $type;
if (!is_dir($uploadRoot) && !mkdir($uploadRoot, 0775, true) && !is_dir($uploadRoot)) {
    json_response(['error' => 'Could not create upload directory'], 500);
}

$extension = $allowed[$type][$mime];
$fileName = $user['id'] . '-' . bin2hex(random_bytes(10)) . '.' . $extension;
$target = $uploadRoot . '/' . $fileName;

if (!move_uploaded_file($_FILES['media']['tmp_name'], $target)) {
    json_response(['error' => 'Could not save uploaded file'], 500);
}

$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'] ?? 'localhost:8080';
$url = $scheme . '://' . $host . '/uploads/' . $type . '/' . $fileName;

db()->prepare('CREATE TABLE IF NOT EXISTS user_media (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  type ENUM("photo", "video", "voice") NOT NULL DEFAULT "photo",
  url VARCHAR(500) NOT NULL,
  mime_type VARCHAR(120) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_media (user_id, type)
)')->execute();

db()->prepare('INSERT INTO user_media (user_id, type, url, mime_type) VALUES (?, ?, ?, ?)')
    ->execute([$user['id'], $type, $url, $mime]);

if ($type === 'photo') {
    db()->prepare('UPDATE users SET photo = ? WHERE id = ?')->execute([$url, $user['id']]);
} elseif ($type === 'video') {
    try {
        db()->prepare('UPDATE users SET intro_video = ? WHERE id = ?')->execute([$url, $user['id']]);
    } catch (Throwable) {
        // Older databases may not have the intro_video column until schema.sql is re-imported.
    }
}

json_response([
    'media' => [
        'type' => $type,
        'url' => $url,
        'mime_type' => $mime,
    ],
], 201);
