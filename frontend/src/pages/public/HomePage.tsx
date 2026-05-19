
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import { testimonials, services as mockServices } from '../../data/mockData';
import { getWhatsAppUrl, trackWhatsAppClick } from '../../services/trackingService';
import { apiClient } from '../../services/apiClient';

const HomePage = () => {
  const [apiServices, setApiServices] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get('/services/list.php')
      .then(res => {
        const rawList = Array.isArray(res) ? res : (res?.data || []);
        const active = rawList.filter((s: any) => String(s.is_active) === '1' || s.is_active === true);
        if (active.length > 0) {
          active.sort((a: any, b: any) => (parseInt(a.sort_order) || 0) - (parseInt(b.sort_order) || 0));
          setApiServices(active);
        } else {
          setApiServices(mockServices.map((m: any) => ({
            id: m.id,
            title: m.title,
            slug: m.slug,
            short_description: m.shortDescription,
            image_url: m.imageUrl
          })));
        }
      })
      .catch(() => {
        setApiServices(mockServices.map((m: any) => ({
          id: m.id,
          title: m.title,
          slug: m.slug,
          short_description: m.shortDescription,
          image_url: m.imageUrl
        })));
      });
  }, []);
  return (
    <>
      <SEO />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=1920" className="w-full h-full object-cover">
            <source src="https://player.vimeo.com/external/403610931.sd.mp4?s=1236fb6bb271aeb9775bb8d150242cd1744b2568&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-charcoal/40" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl text-warm-white font-bold mb-6 drop-shadow-lg">
            Dönüşümün Başladığı Yer
          </h1>
          <p className="text-lg md:text-xl text-warm-white/90 mb-10 max-w-2xl mx-auto drop-shadow-md">
            Tuzla'nın premium wellness stüdyosunda kendinize zaman ayırın. Reformer pilates, EMS ve bölgesel incelme ile bedeninizi yeniden keşfedin.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={getWhatsAppUrl("Merhaba, ücretsiz ön görüşme talep etmek istiyorum.")} 
              target="_blank" 
              rel="noreferrer"
              onClick={() => trackWhatsAppClick('hero_cta')}
              className="bg-sage text-warm-white px-8 py-4 rounded-2xl hover:bg-sage-dark transition-all text-lg font-medium shadow-soft w-full sm:w-auto"
            >
              Ücretsiz Ön Görüşme
            </a>
            <Link to="/hizmetler" className="bg-warm-white text-charcoal px-8 py-4 rounded-2xl hover:bg-cream transition-all text-lg font-medium shadow-soft w-full sm:w-auto">
              Hizmetleri İncele
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-sage-dark mb-4">Sizin İçin Neler Yapabiliriz?</h2>
            <p className="text-charcoal/80 max-w-2xl mx-auto">Modern ekipmanlar ve uzman kadromuzla hedeflerinize uygun kişiselleştirilmiş programlar sunuyoruz.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {apiServices.slice(0, 4).map(service => (
              <div key={service.id} className="bg-warm-white rounded-[24px] overflow-hidden shadow-soft border border-border-soft transition-transform hover:-translate-y-1">
                <div className="h-48 overflow-hidden">
                  <img src={service.image_url || 'https://via.placeholder.com/400x300'} alt={service.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-sage-dark mb-2">{service.title}</h3>
                  <p className="text-charcoal/70 mb-6 text-sm">{service.short_description || service.shortDescription}</p>
                  <Link to={`/hizmetler/${service.slug}`} className="text-sage font-medium hover:text-sage-dark inline-flex items-center">
                    Detaylı Bilgi
                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us / CTA */}
      <section className="py-24 bg-sage-light">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-sage-dark mb-6">Neden Viva Studio?</h2>
              <ul className="space-y-6">
                <li className="flex items-start">
                  <div className="bg-sage text-warm-white p-2 rounded-xl mr-4 shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Uzman Eğitmenler</h4>
                    <p className="text-charcoal/80">Alanında sertifikalı, deneyimli eğitmen kadromuzla güvenli ve etkili antrenmanlar.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-sage text-warm-white p-2 rounded-xl mr-4 shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Premium Atmosfer</h4>
                    <p className="text-charcoal/80">Ferah, hijyenik ve modern stüdyo ortamında kendinizi özel hissedeceğiniz bir deneyim.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-sage text-warm-white p-2 rounded-xl mr-4 shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Bütünsel Yaklaşım</h4>
                    <p className="text-charcoal/80">Reformer, bölgesel incelme ve masaj ile sadece fiziksel değil ruhsal yenilenme.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2 w-full">
              <div className="bg-warm-white p-8 rounded-[32px] shadow-soft border border-border-soft text-center">
                <h3 className="text-2xl font-bold text-sage-dark mb-4">Hazır Mısınız?</h3>
                <p className="text-charcoal/80 mb-8">Sağlıklı ve fit bir hayata ilk adımı atmak için bizimle iletişime geçin.</p>
                <a 
                  href={getWhatsAppUrl()} 
                  target="_blank" 
                  rel="noreferrer"
                  onClick={() => trackWhatsAppClick('why_us_cta')}
                  className="bg-sage text-warm-white px-8 py-4 rounded-2xl hover:bg-sage-dark transition-all font-medium inline-block w-full sm:w-auto"
                >
                  WhatsApp'tan Randevu Al
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-sage-dark mb-12 text-center">Misafirlerimiz Ne Diyor?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-warm-white p-8 rounded-[24px] shadow-soft border border-border-soft relative">
                <div className="text-sage opacity-20 absolute top-4 right-6">
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                </div>
                <p className="text-charcoal/80 mb-6 relative z-10">"{testimonial.comment}"</p>
                <div className="flex items-center justify-between mt-auto">
                  <h4 className="font-bold text-sage-dark">{testimonial.name}</h4>
                  <span className="text-xs text-charcoal/50 font-medium px-3 py-1 bg-sage-light rounded-full">{testimonial.service}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
