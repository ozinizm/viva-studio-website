<?php
// backend/api/sitemap.php
require_once __DIR__ . '/config/database.php';

$baseUrl = 'https://vivastudiopilates.com';

header('Content-Type: application/xml; charset=utf-8');

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

// Sabit sayfalar
$staticPages = [
    '/',
    '/hakkimizda',
    '/hizmetler',
    '/galeri',
    '/iletisim',
    '/yasal'
];

foreach ($staticPages as $page) {
    echo "  <url>\n";
    echo "    <loc>" . htmlspecialchars($baseUrl . $page) . "</loc>\n";
    echo "    <changefreq>weekly</changefreq>\n";
    echo "    <priority>" . ($page === '/' ? '1.0' : '0.8') . "</priority>\n";
    echo "  </url>\n";
}

// Dinamik hizmet sayfaları
try {
    $db = Database::getInstance();
    $stmt = $db->query("SELECT slug, updated_at FROM services WHERE is_active = 1");
    $services = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($services as $service) {
        $lastmod = date('Y-m-d', strtotime($service['updated_at']));
        echo "  <url>\n";
        echo "    <loc>" . htmlspecialchars($baseUrl . '/hizmetler/' . $service['slug']) . "</loc>\n";
        echo "    <lastmod>" . $lastmod . "</lastmod>\n";
        echo "    <changefreq>monthly</changefreq>\n";
        echo "    <priority>0.9</priority>\n";
        echo "  </url>\n";
    }
} catch (Exception $e) {
    // Veritabanı hatası olsa bile statik sayfaları döndürmeye devam et
}

echo '</urlset>';
