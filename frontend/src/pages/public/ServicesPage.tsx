import { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../components/common/SEO';
import { apiClient } from '../../services/apiClient';
import { getMediaUrl } from '../../utils/mediaUrl';

function getWaUrl(phone: string, msg: string) {
  const clean = (phone || '05365266936').replace(/\D/g, '');
  const num = clean.startsWith('90') ? clean : `90${clean}`;
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}

const MOCK_SERVICES = [
  { id: 1, title: 'Pilates', slug: 'reformer-pilates', short_description: 'Vücudunuzu esnetin ve güçlendirin.', category: 'Pilates', image_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800', is_active: 1 },
  { id: 2, title: 'EMS Antrenmanı', slug: 'ems-antrenmani', short_description: '20 dakikada 3 saatlik spor etkisi.', category: 'EMS', image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800', is_active: 1 },
  { id: 3, title: 'Vacu Activ', slug: 'vacu-active', short_description: 'Vakum teknolojisi ile bölgesel incelme.', category: 'Wellness', image_url: 'https://images.unsplash.com/photo-1574680093662-425eb33d596c?auto=format&fit=crop&q=80&w=800', is_active: 1 },
  { id: 4, title: 'G5 Masajı', slug: 'g5-masaji', short_description: 'Titreşimli masaj ile sıkılaşma.', category: 'Masaj', image_url: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=800', is_active: 1 },
];

const ServicesPage = () => {
  const { settings } = useOutletContext<{ settings: any }>() || { settings: {} };
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/services/list.php')
      .then(res => {
        const list = Array.isArray(res) ? res : (res?.data || []);
        const active = list.filter((s: any) => String(s.is_active) === '1' || s.is_active === true);
        active.sort((a: any, b: any) => (parseInt(a.sort_order) || 0) - (parseInt(b.sort_order) || 0));
        setServices(active.length > 0 ? active : MOCK_SERVICES);
      })
      .catch(() => setServices(MOCK_SERVICES))
      .finally(() => setLoading(false));
  }, []);

  const waUrl = getWaUrl(settings.whatsapp, 'Merhaba, hizmetleriniz hakkında bilgi almak istiyorum.');

  return (
    <>
      <SEO
        title="Hizmetler | Viva Studio Tuzla — Pilates, EMS, Vacu Activ, G5"
        description="Viva Studio Tuzla hizmetleri: Reformer pilates, EMS antrenmanı, Vacu Activ vakumlu incelme ve G5 selülit masajı. Tuzla'nın premium wellness stüdyosu."
      />

      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-forest to-primary-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ background: 'radial-gradient(ellipse at 80% 50%, #A8E063, transparent 60%)' }} />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 text-lime font-semibold text-sm uppercase tracking-widest mb-4">
              <span className="w-6 h-0.5 bg-lime rounded-full" />
              Studio Programları
            </div>
            <h1 className="text-white font-bold mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>
              Sizin İçin Tasarlanmış<br/>Premium Hizmetler
            </h1>
            <p className="text-white/70 text-lg max-w-2xl">
              Pilates'tan EMS'e, Vacu Activ'den G5'e — her hedef için kişiye özel program.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-ivory">
        <div className="container mx-auto px-4 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-card">
                  <div className="skeleton h-56" />
                  <div className="p-6 space-y-3">
                    <div className="skeleton h-6 w-2/3" />
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-4 w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                  className="group bg-white rounded-3xl overflow-hidden shadow-card border border-sage/30 hover:border-primary/30 hover:shadow-glow transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={getMediaUrl(service.image_url || '')}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-card opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {service.category && (
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-white">
                        {service.category}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-text-dark mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-muted text-sm leading-relaxed mb-6 line-clamp-3">
                      {service.short_description}
                    </p>

                    {/* Benefits preview */}
                    {service.benefits && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {service.benefits.split(',').slice(0, 3).map((b: string) => (
                          <span key={b} className="px-2 py-1 rounded-lg text-xs bg-mint text-forest font-medium">
                            ✓ {b.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <Link
                        to={`/hizmetler/${service.slug}`}
                        className="flex-1 btn-primary text-sm py-2.5 justify-center"
                      >
                        Detaylı İncele
                      </Link>
                      <a
                        href={getWaUrl(settings.whatsapp, `Merhaba, ${service.title} hakkında bilgi almak istiyorum.`)}
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                        style={{ background: '#25D366' }}
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-forest">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-white text-3xl font-bold mb-4">Hangi Program Sana Uygun?</h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Ücretsiz danışmanlık seansında size en uygun programı birlikte belirleyelim.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={waUrl} target="_blank" rel="noreferrer" className="btn-gradient">
                WhatsApp ile Danışma Al
              </a>
              <Link to="/iletisim" className="btn-secondary">
                İletişim Formu
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;
