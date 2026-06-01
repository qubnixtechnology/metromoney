<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

json_response(['user' => $_SESSION['user'] ?? null]);

