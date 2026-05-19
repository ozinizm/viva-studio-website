# Viva Studio Website

Tuzla bölgesindeki lider wellness, reformer pilates ve bölgesel incelme stüdyosu Viva Studio için modern, hızlı ve SEO dostu kurumsal web projesi.

## Teknik Stack
- Frontend: React, Vite, TypeScript, Tailwind CSS
- State Management / Data: Mock Data Service Layer (İleride API'ye bağlanacak)
- Güvenlik: Frontend-only geçici Mock Auth (Gerçek production admin güvenliği için backend JWT auth gerekir)
- Routing: React Router
- Dağıtım: cPanel (GitHub Deployment)

## Kurulum
```bash
git clone https://github.com/ozinizm/viva-studio-website.git
cd viva-studio-website/frontend
npm install
npm run dev
```

## Geliştirme Komutları
- `npm run dev`: Geliştirme sunucusunu başlatır.
- `npm run build`: Production için `dist` klasörünü oluşturur.
- `npm run preview`: Build edilmiş projeyi yerel olarak görüntüler.

## Deployment (GitHub Actions FTP)
Bu proje, GitHub Actions kullanılarak cPanel sunucusuna **otomatik** olarak deploy edilmektedir:
- `main` branch'ine yapılan her push işleminde GitHub Actions tetiklenir.
- İşlem sırasında proje otomatik olarak derlenir (`npm run build`).
- Başarılı bir derleme sonucunda, yalnızca `frontend/dist` klasörü içindeki dosyalar FTP üzerinden canlı sunucuya (`/home/fikircre/vivastudiopilates.com`) aktarılır.
- Kaynak kodlar, `.env` dosyaları ve diğer gereksiz klasörler (`node_modules` vs.) canlı sunucuya gönderilmez.
- `CPANEL_FTP_SERVER`, `CPANEL_FTP_USERNAME`, `CPANEL_FTP_PASSWORD` ve `CPANEL_FTP_TARGET_DIR` gibi ayarlar GitHub Secrets üzerinden güvenle yönetilir.
- Eski `.cpanel.yml` dosyası yapılandırma geçmişi için repoda tutulmaktadır ancak ana deployment akışı GitHub Actions üzerinden sağlanmaktadır.

## Dokümantasyon
Projenin kapsamlı dökümanları `docs/` klasörü altındadır. Geliştirmeye başlamadan önce okunmalıdır.
