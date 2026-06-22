<?php
require_once __DIR__ . '/../shared/response.php';
require_once __DIR__ . '/../shared/auth.php';
require_once __DIR__ . '/../config/database.php';
handleCors();
verifyToken();
$data = json_decode(file_get_contents('php://input'), true);
if(!is_array($data)) sendError('Invalid data');
try {
    $db = Database::getInstance();
    
    // Otomatik charset düzeltmesi (Canlı sunucuda latin1 kalan tüm tabloları UTF-8 yapar)
    try {
        $tables = [
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
            'activity_logs'
        ];
        foreach ($tables as $table) {
            $db->exec("ALTER TABLE `$table` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
        }
    } catch (Exception $ex) {
        // Hata olursa yoksay
    }

    $stmt = $db->prepare('INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)');
    foreach($data as $key => $value) {
        if ($key !== 'id') { $stmt->execute([$key, $value]); }
    }
    sendResponse(['success' => true, 'message' => 'Settings updated']);
} catch (Exception $e) {
    sendError('Database error', 500);
}
