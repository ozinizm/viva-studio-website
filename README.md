# Viva Studio Website

Tuzla bölgesindeki lider wellness, reformer pilates ve bölgesel incelme stüdyosu Viva Studio için modern, hızlı ve SEO dostu kurumsal web projesi.

## Teknik Stack
- Frontend: React, Vite, TypeScript, Tailwind CSS
- State Management / Data: Mock Data Service Layer (İleride API'ye bağlanacak)
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

## Deployment (cPanel)
Bu proje, GitHub üzerinden cPanel'e otomatik deploy edilmek üzere yapılandırılmıştır:
- Localde geliştirme tamamlandıktan sonra `npm run build` komutu çalıştırılarak `frontend/dist` klasörü güncellenmelidir.
- `frontend/dist` klasörü **MUTLAKA** git'e commitlenmelidir.
- Reponun kök dizininde bulunan `.cpanel.yml` dosyası, GitHub'dan pull işlemi yapıldığında otomatik olarak `dist` içindeki dosyaları `/home/fikircre/vivastudiopilates.com/` klasörüne kopyalar.
- Sunucuda `npm install` veya `npm run build` çalıştırılmaz, build her zaman geliştirici tarafından local ortamda alınmalıdır.

## Dokümantasyon
Projenin kapsamlı dökümanları `docs/` klasörü altındadır. Geliştirmeye başlamadan önce okunmalıdır.
