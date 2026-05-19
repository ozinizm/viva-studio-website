import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import { services as mockServices } from '../../data/mockData';
import { getWhatsAppUrl, trackWhatsAppClick } from '../../services/trackingService';
import { getMediaUrl } from '../../utils/mediaUrl';

const ServiceDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/services/list.php')
      .then(res => res.json())
      .then(data => {
        const rawList = Array.isArray(data) ? data : (data?.data || []);
        const found = rawList.find((s: any) => s.slug === slug);
        if (found) {
          let parsedFaq = null;
          try {
            if (found.faq && String(found.faq).trim().startsWith('[')) {
              parsedFaq = JSON.parse(found.faq);
            }
          } catch (e) {
            console.error('FAQ parse error', e);
          }

          const mapped = {
            id: found.id,
            title: found.title,
            slug: found.slug,
            shortDescription: found.short_description || '',
            description: found.detail_description || '',
            imageUrl: found.image_url || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=1200',
            videoUrl: found.video_url || '',
            suitableFor: found.suitable_for 
              ? found.suitable_for.split(/[,\n]/).map((b: string) => b.trim()).filter(Boolean)
              : ['Sağlıklı bir bedene ve daha iyi bir duruşa sahip olmak isteyenler.', 'Bölgesel olarak incelmek ve sıkılaşmak isteyenler.', 'Kendine vakit ayırmak isteyenler.'],
            benefits: found.benefits
              ? found.benefits.split(/[,\n]/).map((b: string) => b.trim()).filter(Boolean)
              : ['Profesyonel Eğitmenler', 'Kişiye Özel Yaklaşım', 'Premium Ekipmanlar'],
            process: found.process || '',
            faq: parsedFaq,
            seoTitle: found.seo_title || `${found.title} | Viva Studio`,
            seoDescription: found.seo_description || found.short_description || ''
          };
          setService(mapped);
        } else {
          const mock = mockServices.find(s => s.slug === slug);
          if (mock) {
            setService({
              ...mock,
              suitableFor: ['Sağlıklı bir bedene ve daha iyi bir duruşa sahip olmak isteyenler.', 'Bölgesel olarak incelmek ve sıkılaşmak isteyenler.', 'Kendine vakit ayırmak isteyenler.'],
              process: '',
              faq: null,
              seoTitle: `${mock.title} | Viva Studio`,
              seoDescription: mock.shortDescription
            });
          } else {
            setService(null);
          }
        }
      })
      .catch(() => {
        const mock = mockServices.find(s => s.slug === slug);
        if (mock) {
          setService({
            ...mock,
            suitableFor: ['Sağlıklı bir bedene ve daha iyi bir duruşa sahip olmak isteyenler.', 'Bölgesel olarak incelmek ve sıkılaşmak isteyenler.', 'Kendine vakit ayırmak isteyenler.'],
            process: '',
            faq: null,
            seoTitle: `${mock.title} | Viva Studio`,
            seoDescription: mock.shortDescription
          });
        } else {
          setService(null);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-charcoal/65">
        Yükleniyor...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-sage-dark mb-4">Hizmet Bulunamadı</h1>
        <p className="mb-8 text-charcoal/70">Aradığınız hizmet mevcut değil veya yayından kaldırılmış olabilir.</p>
        <Link to="/hizmetler" className="text-sage hover:underline">Tüm Hizmetlere Dön</Link>
      </div>
    );
  }

  return (
    <>
      <SEO title={service.seoTitle || `${service.title} | Viva Studio`} description={service.seoDescription || service.shortDescription} />
      
      {/* Hero */}
      <div className="relative h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          {service.videoUrl ? (
            <video src={getMediaUrl(service.videoUrl)} autoPlay loop muted playsInline className="w-full h-full object-cover" />
          ) : (
            <img src={getMediaUrl(service.imageUrl)} alt={service.title} className="w-full h-full object-cover" />
          )}
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
              <div className="text-lg leading-relaxed text-charcoal/80 mb-6" dangerouslySetInnerHTML={{ __html: service.description }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-xl font-bold text-sage-dark mb-4">Kimler İçin Uygundur?</h3>
                <ul className="space-y-3">
                  {service.suitableFor.map((item: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <span className="w-2 h-2 mt-2 bg-sage rounded-full mr-3 shrink-0"></span>
                      <span className="text-charcoal/80 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-sage-dark mb-4">Temel Faydaları</h3>
                <ul className="space-y-3">
                  {service.benefits.map((item: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-5 h-5 text-sage mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-charcoal/80 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {service.process && (
              <div className="mb-12 border-t pt-8">
                <h3 className="text-xl font-bold text-sage-dark mb-4">Süreç Nasıl İşler?</h3>
                <p className="text-charcoal/80 text-sm whitespace-pre-line">{service.process}</p>
              </div>
            )}

            {service.faq && Array.isArray(service.faq) && (
              <div className="mb-12 border-t pt-8">
                <h3 className="text-xl font-bold text-sage-dark mb-6">Sıkça Sorulan Sorular</h3>
                <div className="space-y-4">
                  {service.faq.map((item: any, i: number) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-border-soft">
                      <h4 className="font-bold text-charcoal mb-2">{item.q}</h4>
                      <p className="text-charcoal/70 text-sm">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-sage-light p-8 rounded-2xl text-center mt-8">
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
