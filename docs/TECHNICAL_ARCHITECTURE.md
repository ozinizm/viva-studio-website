# Technical Architecture
- **Frontend:** React, Vite, TypeScript, Tailwind CSS, React Router.
- **Veri Katmanı:** `src/data` içerisinde mock data ve `src/services` içerisinde servis tabanlı çağrılar.
- **Admin Panel:** Mock servislerle desteklenen UI foundation. **ÖNEMLİ:** Şu anki `admin` kimlik doğrulama sistemi (mock auth) sadece frontend tabanlı geçici bir güvenlik katmanıdır. Gerçek production admin güvenliği için backend JWT auth gereklidir.
- **Deployment:** GitHub repository'sine commitlenen kodun cPanel üzerinden `.cpanel.yml` ile dist klasörünün deploy edilmesi.
