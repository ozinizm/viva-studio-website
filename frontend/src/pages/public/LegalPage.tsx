
import SEO from '../../components/common/SEO';

interface LegalPageProps {
  title: string;
}

const LegalPage: React.FC<LegalPageProps> = ({ title }) => {
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
            <p className="text-charcoal/80 lead">Bu sayfa ilk versiyon için taslak olarak oluşturulmuştur. Lütfen gerçek hukuki metinlerinizi bu alana yerleştiriniz.</p>
            <h2 className="text-2xl font-bold text-charcoal mt-8 mb-4">1. Giriş</h2>
            <p className="text-charcoal/80">Viva Studio olarak kişisel verilerinizin güvenliğine önem veriyoruz...</p>
            <h2 className="text-2xl font-bold text-charcoal mt-8 mb-4">2. Toplanan Veriler</h2>
            <p className="text-charcoal/80">Web sitemiz üzerinden iletişim formları aracılığıyla ad, soyad ve telefon bilgisi toplamaktayız.</p>
            <h2 className="text-2xl font-bold text-charcoal mt-8 mb-4">3. Verilerin Kullanımı</h2>
            <p className="text-charcoal/80">Toplanan bu veriler yalnızca size randevu oluşturmak ve bilgi vermek amacıyla kullanılır.</p>
            <p className="text-charcoal/80 mt-8 text-sm italic">Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LegalPage;
