<?php
require_once __DIR__ . '/../../shared/response.php';
require_once __DIR__ . '/../../config/database.php';
handleCors();
try {
    $db = Database::getInstance();
    $stmt = $db->query('SELECT setting_key, setting_value FROM site_settings');
    $results = $stmt->fetchAll();
    
    // Provide defaults if DB is empty
    $settings = [
        'phone' => '+90 (555) 555 55 55',
        'whatsapp' => '+905555555555',
        'email' => 'info@vivastudio.com',
        'address' => 'Tuzla, İstanbul',
        'instagram' => 'vivastudiopilates',
        'working_hours' => 'Hafta içi 09:00 - 21:00'
    ];
    
    foreach($results as $row) { 
        $settings[$row['setting_key']] = $row['setting_value']; 
    }
    
    sendResponse(['success' => true, 'data' => $settings]);
} catch (Exception $e) {
    // If DB fails, return defaults instead of crashing
    $settings = [
        'phone' => '+90 (555) 555 55 55',
        'whatsapp' => '+905555555555',
        'email' => 'info@vivastudio.com',
        'address' => 'Tuzla, İstanbul',
        'instagram' => 'vivastudiopilates',
        'working_hours' => 'Hafta içi 09:00 - 21:00'
    ];
    sendResponse(['success' => true, 'data' => $settings]);
}
