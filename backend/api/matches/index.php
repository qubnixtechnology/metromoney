<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';

$user = require_user();

$sql = 'SELECT id, name, age, height, city, religion, community, profession, education, income, bio, photo, verified, premium,
        LEAST(99, GREATEST(45,
          18
          + IF(religion = ?, 18, 0)
          + IF(community = ?, 12, 0)
          + IF(city = ?, 14, 0)
          + IF(education = ?, 10, 0)
          + IF(profession = ?, 8, 0)
          + IF(verified = 1, 12, 0)
          + IF(premium = 1, 6, 0)
          + IF(ABS(COALESCE(age, 0) - ?) <= 4, 12, 0)
          + IF(photo IS NOT NULL AND photo != "" AND bio IS NOT NULL AND CHAR_LENGTH(bio) >= 35, 8, 0)
        )) AS match_score,
        LEAST(100,
          IF(verified = 0, 24, 0)
          + IF(photo IS NULL OR photo = "", 18, 0)
          + IF(bio IS NULL OR CHAR_LENGTH(bio) < 35, 12, 0)
        ) AS fraud_risk_score
        FROM users WHERE role = "user" AND status = "approved" AND id != ? ORDER BY match_score DESC, premium DESC, created_at DESC LIMIT 50';
$stmt = db()->prepare($sql);
$stmt->execute([
    $user['religion'] ?? '',
    $user['community'] ?? '',
    $user['city'] ?? '',
    $user['education'] ?? '',
    $user['profession'] ?? '',
    (int) ($user['age'] ?? 0),
    $user['id'],
]);
json_response(['matches' => $stmt->fetchAll()]);
