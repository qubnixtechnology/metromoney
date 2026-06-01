<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

require_admin();
$payments = db()->query('SELECT p.*, u.name, u.email FROM payments p JOIN users u ON u.id = p.user_id ORDER BY p.created_at DESC LIMIT 200')->fetchAll();
json_response(['payments' => $payments]);

