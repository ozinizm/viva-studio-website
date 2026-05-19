import { useState, useEffect } from 'react';
import SEO from '../../components/common/SEO';

interface LegalPageProps {
  title: string;
}

const LegalPage: React.FC<LegalPageProps> = ({ title }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/settings/get.php')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          if (title === 'KVKK Aydınlatma Metni') {
            setContent(data.data.kvkk_text || '');
          } else if (title === 'Gizlilik Politikası') {
            setContent(data.data.privacy_policy_text || '');
          } else if (title === 'Çerez Politikası') {
            setContent(data.data.cookie_policy_text || '');
          }
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [title]);

  const defaultContent = () => {
    if (title === 'KVKK Aydınlatma Metni') {
      return `Viva Studio olarak kişisel verilerinizin güvenliğine son derece önem veriyoruz. Kişisel verileriniz 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında işlenmekte ve korunmaktadır. Bilgi almak veya randevu oluşturmak amacıyla paylaştığınız ad, soyad ve telefon bilgisi yalnızca talebinizi karşılamak üzere saklanır.`;
    } else if (title === 'Gizlilik Politikası') {
      return `Kullanıcılarımızın gizliliğini korumak temel ilkemizdir. Toplanan tüm bilgiler güvenli sunucularımızda saklanmakta ve üçüncü şahıslarla paylaşılmamaktadır.`;
    } else {
      return `Web sitemizde kullanıcı deneyimini artırmak ve performans analizi yapmak amacıyla çerezler (cookies) kullanılmaktadır. Sitemizi ziyaret ederek çerez kullanımını kabul etmiş olursunuz.`;
    }
  };

  return (
    <>
      <SEO title={`${title} | Viva Studio`} noIndex={true} />
      <div className="bg-sage-light py-16 border-b border-border-soft">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-sage-dark">{title}</h1>
        </div>
      </div>
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-warm-white p-8 md:p-12 rounded-[32px] shadow-soft border border-border-soft prose prose-sage max-w-none">
            {loading ? (
              <p className="text-charcoal/60">Yükleniyor...</p>
            ) : (
              <div className="whitespace-pre-line text-charcoal/80">
                {content || defaultContent()}
              </div>
            )}
            <p className="mt-8 text-sm italic text-charcoal/50">Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LegalPage;
