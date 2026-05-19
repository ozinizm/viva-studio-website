
import { useParams, Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import { services } from '../../data/mockData';
import { getWhatsAppUrl, trackWhatsAppClick } from '../../services/trackingService';

const ServiceDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = services.find(s => s.slug === slug);

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-sage-dark mb-4">Hizmet Bulunamadı</h1>
        <p className="mb-8">Aradığınız hizmet mevcut değil veya yayından kaldırılmış olabilir.</p>
        <Link to="/hizmetler" className="text-sage hover:underline">Tüm Hizmetlere Dön</Link>
      </div>
    );
  }

  return (
    <>
      <SEO title={`${service.title} | Viva Studio`} description={service.shortDescription} />
      
      {/* Hero */}
      <div className="relative h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-charcoal/50" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-warm-white mb-4 drop-shadow-md">{service.title}</h1>
          <p className="text-xl text-warm-white/90 max-w-2xl mx-auto drop-shadow-md">{service.shortDescription}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-warm-white rounded-[32px] p-8 md:p-12 shadow-soft border border-border-soft -mt-32 relative z-20">
            <h2 className="text-2xl font-bold text-sage-dark mb-6">Hizmet Hakkında</h2>
            <div className="prose prose-sage max-w-none mb-12">
              <p className="text-lg leading-relaxed text-charcoal/80 mb-6">{service.description}</p>
            </div>

            <div className="mb-12">
              <h3 className="text-xl font-bold text-sage-dark mb-6">Kimler İçin Uygundur?</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="w-2 h-2 mt-2 bg-sage rounded-full mr-3 shrink-0"></span>
                  <span className="text-charcoal/80">Sağlıklı bir bedene ve daha iyi bir duruşa sahip olmak isteyenler.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 mt-2 bg-sage rounded-full mr-3 shrink-0"></span>
                  <span className="text-charcoal/80">Bölgesel olarak incelmek ve sıkılaşmak isteyenler.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 mt-2 bg-sage rounded-full mr-3 shrink-0"></span>
                  <span className="text-charcoal/80">Günlük hayatın stresinden uzaklaşıp kendine vakit ayırmak isteyenler.</span>
                </li>
              </ul>
            </div>

            <div className="bg-sage-light p-8 rounded-2xl text-center">
              <h3 className="text-2xl font-bold text-sage-dark mb-4">Hemen Başlayın</h3>
              <p className="text-charcoal/80 mb-6">Size en uygun programı belirlemek için uzmanlarımızla ücretsiz bir ön görüşme ayarlayın.</p>
              <a 
                href={getWhatsAppUrl(`Merhaba, ${service.title} hizmetinizle ilgileniyorum. Randevu almak istiyorum.`)}
                target="_blank" rel="noreferrer"
                onClick={() => trackWhatsAppClick('service_detail_cta')}
                className="bg-sage text-warm-white px-8 py-4 rounded-xl hover:bg-sage-dark transition-all font-medium inline-block w-full sm:w-auto"
              >
                WhatsApp İle İletişime Geç
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceDetailPage;
