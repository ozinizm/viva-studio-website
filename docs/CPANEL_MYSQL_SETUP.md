# cPanel MySQL ve API Kurulum Dokümantasyonu

Bu doküman, Viva Studio web sitesi için gerekli olan PHP + MySQL veritabanı kurulumunu ve API entegrasyonunu cPanel üzerinden nasıl yapacağınızı anlatmaktadır.

## 1. MySQL Veritabanı Oluşturma
1. cPanel hesabınıza giriş yapın.
2. **Databases (Veritabanları)** bölümünden **MySQL® Databases** simgesine tıklayın.
3. **Create New Database (Yeni Veritabanı Oluştur)** bölümünde veritabanı adını girin (Örn: `vivastud_db`) ve oluşturun.

## 2. MySQL Kullanıcısı Oluşturma
1. Aynı sayfada aşağı kaydırın ve **MySQL Users (MySQL Kullanıcıları) -> Add New User** bölümüne gelin.
2. Kullanıcı adınızı girin (Örn: `vivastud_user`).
3. Güçlü bir şifre belirleyin ve şifreyi güvenli bir yere not edin.
4. **Create User (Kullanıcı Oluştur)** butonuna tıklayın.

## 3. Kullanıcıyı Veritabanına Atama
1. Yine aynı sayfada en alta inip **Add User to Database (Kullanıcıyı Veritabanına Ekle)** bölümüne gelin.
2. Oluşturduğunuz kullanıcıyı ve veritabanını seçip **Add (Ekle)** butonuna tıklayın.
3. Açılan sayfada **ALL PRIVILEGES (Tüm Ayrıcalıklar)** seçeneğini işaretleyip **Make Changes (Değişiklikleri Kaydet)** diyerek yetkileri onaylayın.

## 4. Veritabanı Şemasını (Schema) İçe Aktarma
1. cPanel ana sayfasına dönün ve **phpMyAdmin** uygulamasına girin.
2. Sol taraftaki menüden yeni oluşturduğunuz veritabanına tıklayın.
3. Üst menüden **İçe Aktar (Import)** sekmesine geçin.
4. Dosya seç bölümünden projedeki `backend/database/schema.sql` dosyasını seçin.
5. Sayfanın en altından **Git (Go)** butonuna tıklayarak tabloların ve `admin` kullanıcısının otomatik olarak oluşturulmasını sağlayın.

## 5. API Config (Ayarlar) Dosyasını Oluşturma
1. cPanel **Dosya Yöneticisi (File Manager)**'ne girin.
2. Canlı sitenizin bulunduğu dizine (örn: `public_html` veya `vivastudiopilates.com`) gidin.
3. `/api/config/` dizinine girin.
4. Eğer yoksa, yeni bir dosya oluşturun ve adını `config.php` yapın. (Veya `config.example.php` içeriğini kopyalayıp kullanabilirsiniz).
5. `config.php` içine aşağıdaki kodu yapıştırın ve bilgileri güncelleyin:

```php
<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'OLUSTURDUGUNUZ_USER'); // Örn: fikircre_vivastud_user
define('DB_PASS', 'BELIRLEDIGINIZ_SIFRE');
define('DB_NAME', 'OLUSTURDUGUNUZ_DB'); // Örn: fikircre_vivastud_db
define('JWT_SECRET', 'cok-guclu-gizli-bir-anahtar-yazin');

define('ALLOWED_ORIGINS', ['https://vivastudiopilates.com']);
```

## 6. Admin Panel Girişi
- Kurulum başarıyla tamamlandıktan sonra, siteye girip `/admin/login` sayfasına ulaşabilirsiniz.
- **E-posta:** `admin@vivastudio.com`
- **Şifre:** `VivaAdmin2026!`
- Giriş yaptıktan sonra mutlaka Ayarlar sekmesinden şifrenizi güncelleyin!
