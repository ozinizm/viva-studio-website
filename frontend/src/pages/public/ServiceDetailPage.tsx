import { useState, useEffect } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/common/SEO';
import { apiClient } from '../../services/apiClient';
import { getMediaUrl } from '../../utils/mediaUrl';

function getWaUrl(phone: string, msg: string) {
  const clean = (phone || '05365266936').replace(/\D/g, '');
  const num = clean.startsWith('90') ? clean : `90${clean}`;
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}

// FAQ Accordion
const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-sage/40 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left font-semibold text-text-dark hover:bg-mint/30 transition-colors"
      >
        {q}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <svg className="w-5 h-5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-5 pb-5 text-muted text-sm leading-relaxed border-t border-sage/30">
              <div className="pt-4">{a}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ServiceDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { settings } = useOutletContext<{ settings: any }>() || { settings: {} };
  const [service, setService] = useState<any>(null);
  const [relatedServices, setRelatedServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);

    Promise.all([
      fetch(`/api/services/list.php`).then(r => r.json()),
    ]).then(([allData]) => {
      const all = Array.isArray(allData) ? allData : (allData?.data || []);
      const found = all.find((s: any) => s.slug === slug);

      if (!found) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setService(found);
      // Related: same category, different slug, active
      const related = all.filter((s: any) =>
        s.slug !== slug &&
        (String(s.is_active) === '1' || s.is_active === true)
      ).slice(0, 3);
      setRelatedServices(related);
      setLoading(false);
    }).catch(() => {
      setNotFound(true);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory">
        <div className="h-80 skeleton" />
        <div className="container mx-auto px-4 py-12 space-y-4">
          <div className="skeleton h-10 w-2/3" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-4/5" />
        </div>
      </div>
    );
  }

  if (notFound || !service) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-text-dark mb-2">Hizmet Bulunamadı</h1>
          <p className="text-muted mb-6">Bu hizmet mevcut değil veya kaldırılmış olabilir.</p>
          <Link to="/hizmetler" className="btn-primary">Tüm Hizmetler</Link>
        </div>
      </div>
    );
  }

  // Parse FAQ
  let faqItems: { q: string; a: string }[] = [];
  if (service.faq) {
    try {
      const parsed = JSON.parse(service.faq);
      if (Array.isArray(parsed)) {
        faqItems = parsed.map((item: any) => ({ q: item.q || item.question || '', a: item.a || item.answer || '' }));
      }
    } catch {
      // Plain text FAQ
      const lines = service.faq.split('\n').filter(Boolean);
      lines.forEach((line: string, i: number) => {
        if (i % 2 === 0) faqItems.push({ q: line.replace(/^Q:|^Soru:/, '').trim(), a: '' });
        else if (faqItems.length > 0) faqItems[faqItems.length - 1].a = line.replace(/^A:|^Cevap:/, '').trim();
      });
      // Colon-separated: "Soru?:Cevap"
      if (faqItems.every(f => !f.a)) {
        faqItems = service.faq.split('\n').filter(Boolean).map((line: string) => {
          const [q, ...rest] = line.split(':');
          return { q: q?.trim() || '', a: rest.join(':').trim() };
        }).filter((f: any) => f.q);
      }
    }
  }

  // Parse benefits
  const benefits = service.benefits
    ? service.benefits.split(/,|\n/).map((b: string) => b.trim()).filter(Boolean)
    : [];

  // Parse suitable_for
  const suitableFor = service.suitable_for
    ? service.suitable_for.split(/,|\n/).map((s: string) => s.trim()).filter(Boolean)
    : [];

  const waUrl = getWaUrl(settings.whatsapp, `Merhaba, ${service.title} hakkında bilgi almak ve randevu oluşturmak istiyorum.`);
  const seoTitle = service.seo_title || `${service.title} | Viva Studio Tuzla`;
  const seoDesc = service.seo_description || `${service.title} — ${service.short_description}`;

  return (
    <>
      <SEO title={seoTitle} description={seoDesc} />

      {/* Hero */}
      <section className="relative h-80 md:h-[450px] overflow-hidden">
        {service.video_url ? (
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src={getMediaUrl(service.video_url)} type="video/mp4" />
          </video>
        ) : service.image_url ? (
          <img
            src={getMediaUrl(service.image_url)}
            alt={service.title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=1920'; }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-forest to-primary-dark" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {service.category && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary text-white mb-3">
                  {service.category}
                </span>
              )}
              <h1 className="text-white font-bold" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
                {service.title}
              </h1>
              {service.short_description && (
                <p className="text-white/80 mt-2 text-lg max-w-2xl">{service.short_description}</p>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-sage/30 py-3">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-muted">
            <Link to="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
            <Link to="/hizmetler" className="hover:text-primary transition-colors">Hizmetler</Link>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
            <span className="text-text-dark font-medium">{service.title}</span>
          </nav>
        </div>
      </div>

      {/* Content */}
      <section className="py-16 bg-ivory">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Main */}
            <div className="lg:col-span-2 space-y-10">
              {/* Description */}
              {service.detail_description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-8 shadow-card"
                >
                  <h2 className="text-xl font-bold text-text-dark mb-5 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg">📋</span>
                    Hizmet Detayı
                  </h2>
                  <div
                    className="prose prose-sm text-muted leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: service.detail_description.replace(/\n/g, '<br/>') }}
                  />
                </motion.div>
              )}

              {/* Benefits */}
              {benefits.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-8 shadow-card"
                >
                  <h2 className="text-xl font-bold text-text-dark mb-5 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg">✅</span>
                    Faydaları
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {benefits.map((b: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-mint/50">
                        <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        <span className="text-sm text-text-dark font-medium">{b}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Suitable For */}
              {suitableFor.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-8 shadow-card"
                >
                  <h2 className="text-xl font-bold text-text-dark mb-5 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg">👤</span>
                    Kimler İçin Uygun?
                  </h2>
                  <ul className="space-y-2">
                    {suitableFor.map((s: string, i: number) => (
                      <li key={i} className="flex items-center gap-3 text-muted text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Process */}
              {service.process && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-forest rounded-3xl p-8 text-white"
                >
                  <h2 className="text-xl font-bold mb-5 flex items-center gap-3 text-lime">
                    <span className="text-xl">⚡</span>
                    Süreç Nasıl İşler?
                  </h2>
                  <p className="text-white/80 leading-relaxed">{service.process}</p>
                </motion.div>
              )}

              {/* FAQ */}
              {faqItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-xl font-bold text-text-dark mb-5">Sıkça Sorulan Sorular</h2>
                  <div className="space-y-3">
                    {faqItems.map((faq, i) => (
                      <FaqItem key={i} q={faq.q} a={faq.a} />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* WhatsApp CTA - Sticky */}
              <div className="sticky top-24 space-y-4">
                <div className="bg-gradient-to-br from-primary to-forest rounded-3xl p-6 text-white shadow-glow">
                  <h3 className="font-bold text-xl mb-2">Randevu Al</h3>
                  <p className="text-white/70 text-sm mb-5">
                    {service.title} için hemen randevu oluşturun, sizi bekleyelim.
                  </p>
                  <a href={waUrl} target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-bold text-forest transition-all hover:-translate-y-1"
                    style={{ background: '#A8E063' }}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                    </svg>
                    WhatsApp Randevu
                  </a>
                  <Link to="/iletisim"
                    className="flex items-center justify-center gap-2 w-full py-3 mt-3 rounded-2xl font-semibold text-white text-sm transition-all"
                    style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    İletişim Formu
                  </Link>
                </div>

                {/* Duration info if available */}
                {service.duration_info && (
                  <div className="bg-white rounded-2xl p-5 shadow-card border border-sage/30">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
                      </svg>
                      <div>
                        <p className="text-xs text-muted font-medium">Seans Süresi</p>
                        <p className="font-semibold text-text-dark">{service.duration_info}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-section font-bold text-text-dark mb-8">Diğer Hizmetlerimiz</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedServices.map((rs) => (
                <Link
                  key={rs.id}
                  to={`/hizmetler/${rs.slug}`}
                  className="group flex items-center gap-4 p-4 bg-ivory rounded-2xl border border-sage/30 hover:border-primary/30 hover:shadow-card transition-all"
                >
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                    <img
                      src={getMediaUrl(rs.image_url || '')}
                      alt={rs.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=200'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-text-dark group-hover:text-primary transition-colors truncate">{rs.title}</h3>
                    <p className="text-xs text-muted line-clamp-2 mt-1">{rs.short_description}</p>
                  </div>
                  <svg className="w-4 h-4 text-muted group-hover:text-primary transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ServiceDetailPage;
