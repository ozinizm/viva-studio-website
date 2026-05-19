# Technical Architecture
- **Frontend:** React, Vite, TypeScript, Tailwind CSS, React Router.
- **Veri Katmanı:** `src/data` içerisinde mock data ve `src/services` içerisinde servis tabanlı çağrılar.
- **Admin Panel:** Mock servislerle desteklenen UI foundation. İleride JWT tabanlı authentication yapısına uygun.
- **Deployment:** GitHub repository'sine commitlenen kodun cPanel üzerinden `.cpanel.yml` ile dist klasörünün deploy edilmesi.
