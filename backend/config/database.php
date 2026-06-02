<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/core/bootstrap.php';
require_once dirname(__DIR__) . '/core/jwt.php';

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $host = env_value('DB_HOST', '127.0.0.1');
    $port = env_value('DB_PORT', '3306');
    $name = env_value('DB_NAME', 'matrimonial_db');
    $user = env_value('DB_USER', 'root');
    $pass = env_value('DB_PASS', '');
    $dsn = "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4";

    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    return $pdo;
}

function request_json(): array
{
    $payload = json_decode(file_get_contents('php://input'), true);
    return is_array($payload) ? $payload : [];
}

function require_user(): array
{
    $payload = verify_jwt(get_bearer_token());

    if (!$payload) {
        json_response(['error' => 'Authentication required'], 401);
    }

    $stmt = db()->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([(int) $payload['sub']]);
    $user = $stmt->fetch();

    if (!$user) {
        json_response(['error' => 'User not found'], 401);
    }

    if (($user['status'] ?? '') === 'blocked') {
        json_response(['error' => 'Account is blocked'], 403);
    }

    return public_user($user);
}

function require_admin(): array
{
    $user = require_user();
    if (($user['role'] ?? '') !== 'admin') {
        json_response(['error' => 'Admin access required'], 403);
    }
    return $user;
}

function public_user(array $user): array
{
    unset($user['password_hash']);
    return $user;
}

function verify_password(string $password, string $storedHash): bool
{
    if (password_verify($password, $storedHash)) {
        return true;
    }

    return hash_equals(hash('sha256', $password), $storedHash);
}
