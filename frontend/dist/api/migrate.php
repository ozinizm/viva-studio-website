<?php
// backend/api/migrate.php
require_once __DIR__ . '/shared/response.php';

handleCors();

// 1. Production Safety: Endpoint is strictly disabled by default.
// To temporarily re-enable without changing version-controlled files,
// define the constant VIVA_MIGRATION_SECRET inside config.php (which is excluded from Git):
// define('VIVA_MIGRATION_SECRET', 'your_custom_secret_here');
// Then request the endpoint with: ?secret=your_custom_secret_here
$migrationSecret = defined('VIVA_MIGRATION_SECRET') ? VIVA_MIGRATION_SECRET : null;
$receivedSecret = $_GET['secret'] ?? $_POST['secret'] ?? '';

if (empty($migrationSecret) || $receivedSecret !== $migrationSecret) {
    sendResponse([
        'success' => false,
        'message' => 'Migration endpoint disabled in production'
    ]);
    exit;
}

try {
    require_once __DIR__ . '/config/database.php';
    $db = Database::getInstance();
    
    // Silent database self-healing is strictly restricted to authorized admin/secret context only
    if ($db) {
        $db->exec("UPDATE `services` SET `slug` = 'g5-masaji' WHERE `id` = 3");
        $db->exec("UPDATE `services` SET `slug` = 'bolgesel-incelme' WHERE `id` = 5");
    }
    
    // 2. Idempotent Schema Expansion: Add necessary columns if they do not exist
    $columnsToAdd = [
        'video_url' => "VARCHAR(255) NULL AFTER `image_url`",
        'suitable_for' => "TEXT NULL AFTER `detail_description`",
        'benefits' => "TEXT NULL AFTER `suitable_for`",
        'process' => "TEXT NULL AFTER `benefits`",
        'faq' => "TEXT NULL AFTER `process`"
    ];

    foreach ($columnsToAdd as $colName => $colDef) {
        try {
            $check = $db->query("SHOW COLUMNS FROM `services` LIKE '$colName'")->fetch();
            if (!$check) {
                $db->exec("ALTER TABLE `services` ADD `$colName` $colDef");
            }
        } catch (Throwable $colEx) {
            // Ignore column addition errors (e.g. if column already exists)
        }
    }
    
    // 3. Locate and execute the CMS Seeding SQL Migration
    $sqlPath = __DIR__ . '/migrations/final_cms_completion.sql';
    if (!file_exists($sqlPath)) {
        sendError('Migration SQL file not found.', 404);
    }
    
    $sql = file_get_contents($sqlPath);
    
    // Split statements safely by semicolon
    $statements = array_filter(
        array_map('trim', explode(';', $sql)),
        function($stmt) {
            return !empty($stmt);
        }
    );
    
    $executed = 0;
    foreach ($statements as $stmt) {
        // Strip SQL comments cleanly (both single-line and multi-line comments)
        $stmtClean = preg_replace('/--.*/', '', $stmt);
        $stmtClean = preg_replace('!\/\*.*?\*\/!s', '', $stmtClean);
        $stmtClean = trim($stmtClean);
        
        if (empty($stmtClean)) {
            continue;
        }
        
        try {
            $db->exec($stmtClean);
            $executed++;
        } catch (PDOException $pdoEx) {
            // Code 1060 = Duplicate Column, Code 1062 = Duplicate Entry (already seeded)
            if ($pdoEx->errorInfo[1] === 1060 || $pdoEx->errorInfo[1] === 1062) {
                // Ignore and continue safely
                continue;
            } else {
                throw $pdoEx; // Rethrow other database exceptions
            }
        }
    }
    
    sendResponse([
        'success' => true,
        'message' => 'Migrations executed successfully',
        'statements_executed' => $executed
    ]);
} catch (Throwable $e) {
    sendError('Migration failed: ' . $e->getMessage(), 500);
}
