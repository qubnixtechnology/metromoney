<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $plans = db()->query('SELECT * FROM subscription_plans WHERE is_active = 1 ORDER BY price ASC')->fetchAll();
    json_response(['plans' => $plans]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user = require_user();
    $body = request_json();
    db()->prepare('INSERT INTO subscriptions (user_id, plan_code, status, starts_at, ends_at) VALUES (?, ?, "active", NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY))')
        ->execute([$user['id'], $body['plan_id'] ?? 'premium']);
    json_response(['ok' => true], 201);
}

json_response(['error' => 'Method not allowed'], 405);
