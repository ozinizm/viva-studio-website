
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';

const NotFoundPage = () => {
  return (
    <>
      <SEO title="Sayfa Bulunamadı | Viva Studio" noIndex={true} />
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-6xl md:text-8xl font-serif font-bold text-sage-dark mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-6">Aradığınız Sayfa Bulunamadı</h2>
        <p className="text-charcoal/80 mb-8 max-w-md mx-auto">Taşınmış, silinmiş veya hiç var olmamış bir sayfaya ulaşmaya çalışıyor olabilirsiniz.</p>
        <Link to="/" className="bg-sage text-warm-white px-8 py-4 rounded-xl hover:bg-sage-dark transition-all font-medium inline-flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Ana Sayfaya Dön
        </Link>
      </div>
    </>
  );
};

export default NotFoundPage;
