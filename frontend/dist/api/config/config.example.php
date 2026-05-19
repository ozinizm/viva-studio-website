<?php
// backend/api/config/config.example.php
// Rename this file to config.php and update with your actual database credentials

define('DB_HOST', 'localhost');
define('DB_USER', 'vivastud_user');
define('DB_PASS', 'your_secure_password_here');
define('DB_NAME', 'vivastud_db');
define('JWT_SECRET', 'your_very_secure_jwt_secret_key_here'); // Note: For this simple implementation, we might just use sessions or basic tokens, but it's good practice to have a secret.

// CORS settings
define('ALLOWED_ORIGINS', ['https://vivastudiopilates.com', 'http://localhost:5173']);
