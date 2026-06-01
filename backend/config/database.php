<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/core/bootstrap.php';

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
    if (empty($_SESSION['user'])) {
        json_response(['error' => 'Authentication required'], 401);
    }
    return $_SESSION['user'];
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
