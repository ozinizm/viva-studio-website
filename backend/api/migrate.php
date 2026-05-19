<?php
// backend/api/migrate.php
require_once __DIR__ . '/shared/response.php';
require_once __DIR__ . '/config/database.php';

handleCors();

try {
    $db = Database::getInstance();
    
    $sqlPath = dirname(__DIR__) . '/database/migration_final_cms_completion.sql';
    if (!file_exists($sqlPath)) {
        sendError('Migration SQL file not found', 404);
    }
    
    $sql = file_get_contents($sqlPath);
    
    // Split SQL by semicolon, but ignore semicolons inside parentheses or strings if simple
    // A robust way is using PDO exec directly or splitting by semicolon
    // Since our migration file has statements separated by semicolon on newlines, we can split by ;
    $statements = array_filter(
        array_map('trim', explode(';', $sql)),
        function($stmt) {
            return !empty($stmt);
        }
    );
    
    $executed = 0;
    foreach ($statements as $stmt) {
        // Skip comments
        if (strpos($stmt, '--') === 0 || strpos($stmt, '/*') === 0) {
            continue;
        }
        $db->exec($stmt);
        $executed++;
    }
    
    sendResponse([
        'success' => true,
        'message' => 'Migrations executed successfully',
        'statements_executed' => $executed
    ]);
} catch (Exception $e) {
    sendError('Migration failed: ' . $e->getMessage(), 500);
}
