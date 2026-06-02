<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

function base64url_encode(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode(string $data): string|false
{
    $remainder = strlen($data) % 4;
    if ($remainder) {
        $data .= str_repeat('=', 4 - $remainder);
    }

    return base64_decode(strtr($data, '-_', '+/'), true);
}

function jwt_secret(): string
{
    $secret = env_value('JWT_SECRET', '');
    if ($secret === '') {
        $secret = 'change-this-local-development-secret';
    }
    return $secret;
}

function create_jwt(array $user): string
{
    $now = time();
    $ttl = (int) env_value('JWT_EXPIRES_IN', '86400');
    $header = ['typ' => 'JWT', 'alg' => 'HS256'];
    $payload = [
        'sub' => (int) $user['id'],
        'role' => $user['role'] ?? 'user',
        'email' => $user['email'] ?? '',
        'name' => $user['name'] ?? '',
        'iat' => $now,
        'exp' => $now + max($ttl, 300),
    ];

    $encodedHeader = base64url_encode(json_encode($header, JSON_UNESCAPED_SLASHES));
    $encodedPayload = base64url_encode(json_encode($payload, JSON_UNESCAPED_SLASHES));
    $signature = hash_hmac('sha256', "{$encodedHeader}.{$encodedPayload}", jwt_secret(), true);

    return "{$encodedHeader}.{$encodedPayload}." . base64url_encode($signature);
}

function get_bearer_token(): ?string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';

    if ($header === '' && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $header = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }

    if (preg_match('/Bearer\s+(.+)/i', $header, $matches)) {
        return trim($matches[1]);
    }

    return null;
}

function verify_jwt(?string $token): ?array
{
    if (!$token) {
        return null;
    }

    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return null;
    }

    [$encodedHeader, $encodedPayload, $encodedSignature] = $parts;
    $expectedSignature = base64url_encode(hash_hmac('sha256', "{$encodedHeader}.{$encodedPayload}", jwt_secret(), true));

    if (!hash_equals($expectedSignature, $encodedSignature)) {
        return null;
    }

    $payloadJson = base64url_decode($encodedPayload);
    $payload = $payloadJson ? json_decode($payloadJson, true) : null;

    if (!is_array($payload) || empty($payload['sub']) || empty($payload['exp']) || time() >= (int) $payload['exp']) {
        return null;
    }

    return $payload;
}
