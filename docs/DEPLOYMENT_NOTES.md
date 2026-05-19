# Deployment Notes
- **GitHub Repo:** `https://github.com/ozinizm/viva-studio-website.git`
- **cPanel Repo Path:** `/home/fikircre/repositories/viva-studio-website`
- **Canlı Site Klasörü:** `/home/fikircre/vivastudiopilates.com`
- **Build Komutu:** Local ortamda `npm run build` ile `frontend/dist` alınır ve commitlenir.
- **cPanel YAML:** `.cpanel.yml` dosyası, GitHub'dan pull sonrasında `frontend/dist` içindeki statik dosyaları canlı klasöre taşır.
- **Önemli:** Sunucuda npm çalışmayacağı için dist klasörünün commitlendiğinden emin olun!
