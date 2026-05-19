
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import { services } from '../../data/mockData';
import { getWhatsAppUrl, trackWhatsAppClick } from '../../services/trackingService';

const ServicesPage = () => {
  return (
    <>
      <SEO title="Hizmetlerimiz | Viva Studio Tuzla" description="Reformer pilates, EMS antrenmanı, Vacu Active ve G5 selülit masajı hizmetlerimizle sağlıklı yaşam hedeflerinize ulaşın." />
      
      <div className="bg-sage-light py-20 border-b border-border-soft">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-sage-dark mb-4">Hizmetlerimiz</h1>
          <p className="text-lg text-charcoal/80 max-w-2xl mx-auto">İhtiyaçlarınıza özel olarak tasarlanmış programlarımızla sağlıklı bir dönüşüm yaşayın.</p>
        </div>
      </div>

      <div className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="space-y-20">
            {services.map((service, index) => (
              <div key={service.id} className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="w-full lg:w-1/2">
                  <div className="rounded-[32px] overflow-hidden shadow-soft aspect-[4/3]">
                    <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="w-full lg:w-1/2">
                  <h2 className="text-3xl font-bold text-sage-dark mb-4">{service.title}</h2>
                  <p className="text-lg text-charcoal/80 mb-8">{service.description}</p>
                  
                  <div className="mb-8">
                    <h4 className="font-bold mb-4 text-charcoal">Neden Tercih Etmelisiniz?</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {service.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center text-charcoal/80">
                          <svg className="w-5 h-5 text-sage mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <Link to={`/hizmetler/${service.slug}`} className="bg-warm-white border border-border-soft text-charcoal px-6 py-3 rounded-xl hover:bg-sage-light hover:border-sage transition-all font-medium">
                      Detaylı Bilgi
                    </Link>
                    <a 
                      href={getWhatsAppUrl(`Merhaba, ${service.title} hakkında detaylı bilgi almak ve randevu oluşturmak istiyorum.`)}
                      target="_blank" rel="noreferrer"
                      onClick={() => trackWhatsAppClick('service_list_cta')}
                      className="bg-sage text-warm-white px-6 py-3 rounded-xl hover:bg-sage-dark transition-all font-medium inline-flex items-center"
                    >
                      WhatsApp'tan Randevu Al
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicesPage;
