<?php
// backend/api/migrate.php
require_once __DIR__ . '/shared/response.php';
require_once __DIR__ . '/config/database.php';

handleCors();

// 1. Enforce Token Security to protect the endpoint from unauthorized public execution
$securityToken = 'VivaMigrate2026!';
$receivedToken = $_GET['token'] ?? $_POST['token'] ?? '';

if ($receivedToken !== $securityToken) {
    sendError('Unauthorized access. Valid security token required. Please append ?token=VivaMigrate2026! to the URL.', 401);
}

try {
    $db = Database::getInstance();
    
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
        } catch (Exception $colEx) {
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
} catch (Exception $e) {
    sendError('Migration failed: ' . $e->getMessage(), 500);
}
