<?php
declare(strict_types=1);

function env_value(string $key, string $default = ''): string
{
    static $loaded = false;
    if (!$loaded) {
        $envPaths = [
            dirname(__DIR__) . '/.env',
            dirname(__DIR__) . '/api/.env',
        ];

        foreach ($envPaths as $envPath) {
            if (!is_file($envPath)) {
                continue;
            }
            foreach (file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
                if (str_starts_with(trim($line), '#') || !str_contains($line, '=')) {
                    continue;
                }
                [$name, $value] = array_map('trim', explode('=', $line, 2));
                $_ENV[$name] = $value;
            }
        }
        $loaded = true;
    }

    return $_ENV[$key] ?? getenv($key) ?: $default;
}

function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: ' . ($_SERVER['HTTP_ORIGIN'] ?? '*'));
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    echo json_encode($payload);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    json_response(['ok' => true]);
}

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}
