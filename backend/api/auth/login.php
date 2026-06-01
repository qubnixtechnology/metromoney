<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

$body = request_json();
$email = trim($body['email'] ?? '');
$password = $body['password'] ?? '';
$role = $body['role'] ?? 'user';

$stmt = db()->prepare('SELECT * FROM users WHERE email = ? AND role = ? LIMIT 1');
$stmt->execute([$email, $role]);
$user = $stmt->fetch();

if (!$user || !verify_password($password, $user['password_hash'])) {
    json_response(['error' => 'Invalid credentials'], 422);
}

if ($user['status'] === 'blocked') {
    json_response(['error' => 'Account is blocked'], 403);
}

$_SESSION['user'] = public_user($user);
json_response(['user' => $_SESSION['user']]);
