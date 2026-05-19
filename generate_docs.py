import os

docs_dir = "docs"
os.makedirs(docs_dir, exist_ok=True)

docs = {
    "PROJECT_BRIEF.md": """# Project Brief: Viva Studio
## Amacı
Viva Studio, Tuzla ve çevresinde reformer pilates, EMS, Vacu Active ve G5 selülit masajı gibi hizmetler sunan premium bir wellness stüdyosudur.

## Hedef Kitle
Sağlıklı yaşam ve vücut şekillendirme hedefleyen, ağırlıklı olarak kadın kullanıcılardan oluşan bir kitle.

## Dönüşüm Hedefleri
- WhatsApp üzerinden rezervasyon ve bilgi talebi oluşturulması
- Form doldurularak ön görüşme talebi alınması

## İlk Versiyon Kapsamı
- Production-ready frontend (React, Vite, TailwindCSS)
- Statik public sayfalar (Ana sayfa, hizmetler, blog, iletişim)
- Admin panel arayüz temelleri
- SEO, Mock data ve servis katmanı entegrasyonu
- GitHub üzerinden cPanel deploy yapısının kurulması

## İlerideki Hedefler
FastAPI / NestJS backend entegrası, dinamik veri yönetimi.
""",
    "BRAND_GUIDE.md": """# Brand Guide: Viva Studio
## Renkler ve Stil
- **Primary:** Soft Adaçayı Yeşili
- **Background:** Beyaz ve Krem ferah alanlar
- **Tipografi:** Zarif ve okunabilir modern tipografi (Playfair Display, Montserrat)

## Yaklaşım
- **Premium Wellness:** Ucuz fitness görünümünden uzak, lüks ve güven verici bir tasarım.
- **CTA:** Soft ve destekleyici ("Detaylı Bilgi Al", "WhatsApp'tan Randevu Al"). Agresif satış dili kullanılmayacaktır.
- **Kaçınılacaklar:** Neon, agresif, koyu ve karmaşık görseller.
""",
    "UI_UX_REQUIREMENTS.md": """# UI/UX Requirements
- **Referans:** Stitch MCP üzerinden alınan tasarım sistemi (Viva Studio Wellness UI/UX).
- **Responsive:** Mobil öncelikli, desktop'ta ferah alan kullanımına sahip.
- **Component Yapısı:** Spacing, renk ve tipografi sadakati yüksek.
- **Form:** Kullanıcı yormayan, güven odaklı rezervasyon formları.
- **Erişilebilirlik:** Doğru aria-labellar, focus stateleri, yüksek renk kontrastı.
""",
    "TECHNICAL_ARCHITECTURE.md": """# Technical Architecture
- **Frontend:** React, Vite, TypeScript, Tailwind CSS, React Router.
- **Veri Katmanı:** `src/data` içerisinde mock data ve `src/services` içerisinde servis tabanlı çağrılar.
- **Admin Panel:** Mock servislerle desteklenen UI foundation. İleride JWT tabanlı authentication yapısına uygun.
- **Deployment:** GitHub repository'sine commitlenen kodun cPanel üzerinden `.cpanel.yml` ile dist klasörünün deploy edilmesi.
""",
    "DATABASE_SCHEMA.md": """# Database Schema (Gelecek Planı)
İlk versiyonda gerçek bir database kullanılmayacak, ancak ileride PostgreSQL ile aşağıdaki yapı planlanmıştır:
- users
- roles
- permissions
- site_settings
- hero_sections
- services
- service_categories
- gallery_items
- blog_posts
- blog_categories
- campaigns
- reservation_requests
- contact_messages
- faqs
- testimonials
- seo_settings
- legal_pages
- media_assets
""",
    "ADMIN_PANEL_MODULES.md": """# Admin Panel Modules
- **Login:** Giriş ekranı.
- **Dashboard:** Özet istatistikler ve son bildirimler.
- **Hero Yönetimi:** Ana sayfa başlık ve görsel/video.
- **Hizmet Yönetimi:** Servis ekleme, düzenleme, listeleme.
- **Galeri Yönetimi:** Görsel yükleme ve kategorizasyon.
- **Blog Yönetimi:** Makale içerikleri.
- **Rezervasyon Talepleri:** Gelen taleplerin durum (Yeni, Arandı, İptal) yönetimi.
- **Kampanya Yönetimi:** Promosyon ve duyurular.
- **SSS Yönetimi:** Sıkça sorulan sorular.
- **Müşteri Yorumları:** Ana sayfada gösterilecek müşteri geri bildirimleri.
- **SEO Ayarları:** Sayfa bazlı title, description ayarları.
- **Site Ayarları:** İletişim, adres ve sosyal medya bilgileri.
""",
    "API_REQUIREMENTS.md": """# API Requirements (Gelecek Planı)
Bu sürümde `src/services` altında mock olarak tasarlanan API'ler, ileride şu yapıya kavuşacaktır:
- `POST /api/auth/login`
- `GET /api/public/services`
- `POST /api/public/reservations`
- `GET /api/admin/reservations` (Protected)
- `PUT /api/admin/seo` (Protected)
""",
    "SEO_REQUIREMENTS.md": """# SEO Requirements
- **Meta Etiketler:** Her sayfa için title ve description yönetimi (`src/components/common/SEO.tsx`).
- **Open Graph:** Sosyal paylaşımlar için og:title, og:description, og:image desteği.
- **Local SEO:** "Tuzla", "Pendik" gibi bölgesel anahtar kelimelerin metinlerde organik kullanımı.
- **Dosyalar:** `robots.txt` ve basit bir `sitemap.xml`.
- **Tracking:** Event takibi için trackingService hazır bulunmalı (GA4/GTM).
""",
    "CONTENT_STRUCTURE.md": """# Content Structure
- **Ana Sayfa:** Hero, Hizmetler, Galeri Önizleme, Yorumlar, İletişim.
- **Hizmet:** Aletli Pilates, Vacu Active, EMS, G5 Masajı. (Fiyat belirtilmez)
- **Galeri Kategorileri:** Stüdyo, Ekipmanlar, Atmosfer, Video, Önce / Sonra.
- **Yasal Metinler:** KVKK, Gizlilik Politikası, Çerez Politikası sayfaları.
""",
    "QA_CHECKLIST.md": """# QA Checklist
- [ ] Build hatasız çalışıyor (`npm run build`).
- [ ] Mobil ve Desktop responsive görünümler Stitch tasarımına uyumlu.
- [ ] WhatsApp CTA yönlendirmeleri doğru çalışıyor (905365266936).
- [ ] Rezervasyon formu validation'ları aktif.
- [ ] SEO metaları, robots.txt ve sitemap mevcut.
- [ ] cPanel deployment dosyası `.cpanel.yml` repo kökünde mevcut.
- [ ] .env gizli bilgileri commitlenmedi.
- [ ] `frontend/dist` klasörü build çıktısını içeriyor.
""",
    "DEPLOYMENT_NOTES.md": """# Deployment Notes
- **GitHub Repo:** `https://github.com/ozinizm/viva-studio-website.git`
- **cPanel Repo Path:** `/home/fikircre/repositories/viva-studio-website`
- **Canlı Site Klasörü:** `/home/fikircre/vivastudiopilates.com`
- **Build Komutu:** Local ortamda `npm run build` ile `frontend/dist` alınır ve commitlenir.
- **cPanel YAML:** `.cpanel.yml` dosyası, GitHub'dan pull sonrasında `frontend/dist` içindeki statik dosyaları canlı klasöre taşır.
- **Önemli:** Sunucuda npm çalışmayacağı için dist klasörünün commitlendiğinden emin olun!
"""
}

for name, content in docs.items():
    with open(os.path.join(docs_dir, name), "w", encoding="utf-8") as f:
        f.write(content)
