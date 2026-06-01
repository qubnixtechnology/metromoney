<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

require_admin();
$body = request_json();
$id = (int) ($body['id'] ?? 0);
$action = $body['action'] ?? '';

if (!$id || !in_array($action, ['approve', 'block', 'unblock'], true)) {
    json_response(['error' => 'Valid id and action are required'], 422);
}

$status = match ($action) {
    'approve' => 'approved',
    'block' => 'blocked',
    'unblock' => 'approved',
};
$verified = $action === 'approve' ? 1 : 0;

db()->prepare('UPDATE users SET status = ?, verified = ? WHERE id = ? AND role = "user"')->execute([$status, $verified, $id]);
json_response(['ok' => true]);

