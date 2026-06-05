<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

$body = request_json();
$required = ['name', 'email', 'password', 'age', 'city', 'religion', 'community', 'profession'];
foreach ($required as $field) {
    if (empty($body[$field])) {
        json_response(['error' => "{$field} is required"], 422);
    }
}

$sql = 'INSERT INTO users (role, name, email, password_hash, age, height, city, religion, community, profession, education, income, bio, photo, status)
        VALUES ("user", :name, :email, :password_hash, :age, :height, :city, :religion, :community, :profession, :education, :income, :bio, :photo, "pending")';

$stmt = db()->prepare($sql);
$stmt->execute([
    'name' => $body['name'],
    'email' => $body['email'],
    'password_hash' => password_hash($body['password'], PASSWORD_DEFAULT),
    'age' => (int) $body['age'],
    'height' => $body['height'] ?? '',
    'city' => $body['city'],
    'religion' => $body['religion'],
    'community' => $body['community'],
    'profession' => $body['profession'],
    'education' => $body['education'] ?? '',
    'income' => $body['income'] ?? '',
    'bio' => $body['bio'] ?? '',
    'photo' => $body['photo'] ?? '',
]);

$id = (int) db()->lastInsertId();
$user = db()->query("SELECT * FROM users WHERE id = {$id}")->fetch();
$publicUser = public_user($user);

json_response([
    'user' => $publicUser,
    'token' => create_jwt($publicUser),
], 201);
