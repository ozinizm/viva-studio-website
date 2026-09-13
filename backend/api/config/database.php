<?php
// backend/api/config/database.php

// Try to load config.php, fallback to example if not exists (for local development safety)
if (file_exists(__DIR__ . '/config.php')) {
    require_once __DIR__ . '/config.php';
} else {
    require_once __DIR__ . '/config.example.php';
}

class Database {
    private static $instance = null;
    private $conn;
    private static $utf8CheckedTables = [];

    private function __construct() {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
            ];
            
            $this->conn = new PDO($dsn, DB_USER, DB_PASS, $options);
            $this->conn->exec("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
            $this->conn->exec("SET CHARACTER SET utf8mb4");
        } catch (PDOException $e) {
            // For production, log error instead of outputting
            error_log("Connection failed: " . $e->getMessage());
            throw new Exception("Database connection failed");
        }
    }

    public static function getInstance() {
        if (!self::$instance) {
            self::$instance = new Database();
        }
        return self::$instance->conn;
    }

    public static function ensureUtf8mb4Schema($tables = []) {
        $allowedTables = [
            'admin_users',
            'site_settings',
            'services',
            'hero_sections',
            'reservations',
            'contact_requests',
            'gallery_items',
            'blog_posts',
            'campaigns',
            'faqs',
            'testimonials',
            'seo_settings',
            'activity_logs',
        ];

        $targetTables = empty($tables) ? $allowedTables : array_values(array_intersect($tables, $allowedTables));
        $targetTables = array_values(array_filter($targetTables, function($table) {
            return empty(self::$utf8CheckedTables[$table]);
        }));

        if (empty($targetTables)) {
            return;
        }

        $db = self::getInstance();
        $placeholders = implode(',', array_fill(0, count($targetTables), '?'));
        $stmt = $db->prepare("
            SELECT TABLE_NAME, TABLE_COLLATION
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = ?
            AND TABLE_NAME IN ($placeholders)
        ");
        $stmt->execute(array_merge([DB_NAME], $targetTables));

        $collations = [];
        foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $collations[$row['TABLE_NAME']] = $row['TABLE_COLLATION'];
        }

        foreach ($targetTables as $table) {
            if (!isset($collations[$table])) {
                continue;
            }

            if ($collations[$table] !== 'utf8mb4_unicode_ci') {
                $db->exec("ALTER TABLE `$table` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            }

            self::$utf8CheckedTables[$table] = true;
        }
    }
}
