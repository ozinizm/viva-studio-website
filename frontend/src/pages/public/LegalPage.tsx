import { useState, useEffect } from 'react';
import SEO from '../../components/common/SEO';

interface LegalPageProps {
  title: string;
  slug?: string;
}

const LegalPage: React.FC<LegalPageProps> = ({ title, slug }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  const fieldMap: Record<string, string> = {
    'KVKK Aydınlatma Metni': 'kvkk_text',
    'Gizlilik Politikası': 'privacy_policy_text',
    'Çerez Politikası': 'cookie_policy_text',
  };

  const fieldKey = fieldMap[title] || 'kvkk_text';

  useEffect(() => {
    fetch('/api/settings/get.php')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) {
          setContent(data.data[fieldKey] || getDefaultContent(title));
        } else {
          setContent(getDefaultContent(title));
        }
      })
      .catch(() => setContent(getDefaultContent(title)))
      .finally(() => setLoading(false));
  }, [fieldKey, title]);

  return (
    <>
      <SEO title={`${title} | Viva Studio Tuzla`} description={`${title} — Viva Studio Tuzla`} noIndex />

      {/* Hero */}
      <section className="py-16 bg-forest">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-white font-bold text-3xl md:text-4xl">{title}</h1>
          <p className="text-white/50 mt-2 text-sm">
            Son güncelleme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-ivory">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-card">
            {loading ? (
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`skeleton h-4 ${i % 3 === 0 ? 'w-2/3' : 'w-full'}`} />
                ))}
              </div>
            ) : (
              <div
                className="prose prose-green max-w-none text-muted leading-relaxed"
                style={{ whiteSpace: 'pre-wrap' }}
                dangerouslySetInnerHTML={{
                  __html: content
                    .replace(/\n/g, '<br/>')
                    .replace(/#{3}\s(.+)/g, '<h3 class="text-lg font-bold text-text-dark mt-6 mb-2">$1</h3>')
                    .replace(/#{2}\s(.+)/g, '<h2 class="text-xl font-bold text-text-dark mt-8 mb-3">$1</h2>')
                    .replace(/#{1}\s(.+)/g, '<h1 class="text-2xl font-bold text-text-dark mt-8 mb-4">$1</h1>')
                }}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

function getDefaultContent(title: string): string {
  const defaults: Record<string, string> = {
    'KVKK Aydınlatma Metni': `## KVKK Aydınlatma Metni

Viva Studio Tuzla olarak kişisel verilerinizin güvenliği konusunda azami hassasiyet göstermekteyiz.

### 1. Veri Sorumlusu

6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca veri sorumlusu sıfatıyla Viva Studio Tuzla hareket etmektedir.

### 2. İşlenen Kişisel Veriler

Adınız, soyadınız, telefon numaranız, e-posta adresiniz ve iletişim formunda paylaştığınız bilgiler işlenebilmektedir.

### 3. Kişisel Verilerin İşlenme Amacı

Toplanan kişisel veriler; randevu yönetimi, müşteri hizmetleri ve yasal yükümlülüklerin yerine getirilmesi amacıyla kullanılmaktadır.

### 4. Haklarınız

KVKK'nın 11. maddesi uyarınca kişisel verilerinize ilişkin haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.`,

    'Gizlilik Politikası': `## Gizlilik Politikası

Viva Studio Tuzla olarak kullanıcılarımızın gizliliğini korumak en önemli önceliklerimizden biridir.

### Toplanan Bilgiler

Web sitemiz üzerinden iletişim formları aracılığıyla ad, soyad, telefon numarası ve e-posta bilgileri toplanmaktadır.

### Bilgilerin Kullanımı

Toplanan bilgiler sadece randevu ve bilgilendirme amaçlı kullanılmakta, üçüncü taraflarla paylaşılmamaktadır.

### Çerezler

Web sitemiz kullanıcı deneyimini iyileştirmek amacıyla çerezler kullanabilmektedir.`,

    'Çerez Politikası': `## Çerez Politikası

Bu çerez politikası, Viva Studio Tuzla web sitesinde kullanılan çerezleri açıklamaktadır.

### Çerez Nedir?

Çerezler, web siteleri tarafından tarayıcınıza gönderilen küçük metin dosyalarıdır.

### Kullandığımız Çerezler

- **Zorunlu Çerezler:** Sitenin çalışması için gerekli.
- **Analitik Çerezler:** Google Analytics ile ziyaretçi istatistikleri.
- **Pazarlama Çerezleri:** Hedefli reklamlar için.

### Çerez Yönetimi

Tarayıcı ayarlarınızdan çerezleri yönetebilir veya reddedebilirsiniz.`,
  };
  return defaults[title] || `## ${title}\n\nBu sayfanın içeriği yakında güncellenecektir.`;
}

export default LegalPage;
