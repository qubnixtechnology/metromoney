<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $user = $_SESSION['user'] ?? null;
    $where = ['role = "user"', 'status != "blocked"'];
    $params = [];

    if (($user['role'] ?? '') !== 'admin') {
        $where[] = 'status = "approved"';
    }
    foreach (['city', 'religion'] as $filter) {
        if (!empty($_GET[$filter]) && $_GET[$filter] !== 'Any') {
            $where[] = "{$filter} = ?";
            $params[] = $_GET[$filter];
        }
    }
    if (!empty($_GET['query'])) {
        $where[] = '(name LIKE ? OR profession LIKE ? OR community LIKE ?)';
        $query = '%' . $_GET['query'] . '%';
        array_push($params, $query, $query, $query);
    }

    $sql = 'SELECT id, role, name, email, age, height, city, religion, community, profession, education, income, bio, photo, intro_video, status, verified, premium, created_at FROM users WHERE ' . implode(' AND ', $where) . ' ORDER BY premium DESC, created_at DESC';
    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    json_response(['profiles' => $stmt->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $user = require_user();
    $body = request_json();
    $fields = ['name', 'age', 'height', 'city', 'religion', 'community', 'profession', 'education', 'income', 'bio', 'photo', 'intro_video'];
    $sets = [];
    $params = [];

    foreach ($fields as $field) {
        if (array_key_exists($field, $body)) {
            $sets[] = "{$field} = ?";
            $params[] = $body[$field];
        }
    }

    if (!$sets) {
        json_response(['error' => 'No changes submitted'], 422);
    }

    $params[] = $user['id'];
    db()->prepare('UPDATE users SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($params);
    $stmt = db()->prepare('SELECT * FROM users WHERE id = ?');
    $stmt->execute([$user['id']]);
    $_SESSION['user'] = public_user($stmt->fetch());
    json_response(['user' => $_SESSION['user']]);
}

json_response(['error' => 'Method not allowed'], 405);
