<?php
require_once __DIR__ . '/config/database.php';
try {
    $db = Database::getInstance();
    $sql = "CREATE TABLE IF NOT EXISTS contact_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        service VARCHAR(255),
        message TEXT,
        status ENUM('new', 'contacted', 'converted', 'closed') DEFAULT 'new',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );";
    $db->exec($sql);
    echo "Table contact_requests created successfully.";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
