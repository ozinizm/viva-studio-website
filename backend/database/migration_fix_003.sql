-- migration_fix_003.sql
-- Seed legal texts into site_settings if they do not exist

INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES 
('kvkk_text', 'Viva Studio olarak kişisel verilerinizin güvenliğine son derece önem veriyoruz. Kişisel verileriniz 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında işlenmekte ve korunmaktadır. Bilgi almak veya randevu oluşturmak amacıyla paylaştığınız ad, soyad ve telefon bilgisi yalnızca talebinizi karşılamak üzere saklanır.'),
('privacy_policy_text', 'Kullanıcılarımızın gizliliğini korumak temel ilkemizdir. Toplanan tüm bilgiler güvenli sunucularımızda saklanmakta ve üçüncü şahıslarla paylaşılmamaktadır.'),
('cookie_policy_text', 'Web sitemizde kullanıcı deneyimini artırmak ve performans analizi yapmak amacıyla çerezler (cookies) kullanılmaktadır. Sitemizi ziyaret ederek çerez kullanımını kabul etmiş olursunuz.');
