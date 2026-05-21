import { useState, useEffect, useRef } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import SEO from '../../components/common/SEO';
import { apiClient } from '../../services/apiClient';
import { getMediaUrl } from '../../utils/mediaUrl';

// =============================================
// HELPERS
// =============================================
function getWaUrl(phone: string, msg: string) {
  const clean = (phone || '05365266936').replace(/\D/g, '');
  const num = clean.startsWith('90') ? clean : `90${clean}`;
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  });
}

// =============================================
// COUNTERS SECTION DATA
// =============================================
const WHY_US = [
  { icon: '🎯', title: 'Kişiye Özel Program', desc: 'Her müşteri için bireysel analiz yapılır ve programa özel protokol oluşturulur.' },
  { icon: '⚡', title: 'EMS Teknolojisi', desc: '20 dakikada 3 saatlik antrenman etkisi — Tuzla\'nın tek profesyonel EMS stüdyosu.' },
  { icon: '🌿', title: 'Premium Studio Ortamı', desc: 'Ferah, hijyenik ve modern stüdyo atmosferinde kendinizi özel hissedin.' },
  { icon: '💪', title: 'Pilates + EMS + Vacu + G5', desc: 'Tek çatı altında bütünleşik wellness programı — dört güçlü teknoloji bir arada.' },
  { icon: '📍', title: 'Tuzla\'da Merkezi Konum', desc: 'Tuzla ve çevresine kolayca ulaşılabilir, otopark imkânlı premium adres.' },
  { icon: '🤝', title: 'Kolay Randevu', desc: 'WhatsApp, telefon veya online form ile kolayca randevu alın, sizi bekleyelim.' },
];

const TRANSFORM_CARDS = [
  { emoji: '💪', title: 'Güçlen', desc: 'EMS ve pilates ile kas gücünüzü artırın', color: 'from-primary to-primary-dark' },
  { emoji: '✨', title: 'Sıkılaş', desc: 'G5 ve Vacu Activ ile hedeflenen bölgelerde sıkılaşma', color: 'from-forest to-forest-light' },
  { emoji: '🔥', title: 'Forma Gir', desc: 'Kişiye özel programlarla hızla forma girin', color: 'from-lime to-primary' },
  { emoji: '⚡', title: 'Enerji Kazan', desc: 'Düzenli seanslarla enerjinizi ve kondisyonunuzu yükseltin', color: 'from-logo-green to-forest' },
];

// =============================================
// HERO SECTION
// =============================================
interface HeroProps {
  settings: any;
}

const HeroSection: React.FC<HeroProps> = ({ settings }) => {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  const heroTitle = settings.hero_title ?? 'Bedenini Güçlendir,\nHayatını Dönüştür';
  const heroDesc = settings.hero_description ?? 'Tuzla\'nın premium wellness stüdyosunda pilates, EMS, Vacu Activ ve G5 ile forma girin.';
  const cta1Text = settings.cta1_text ?? 'Ücretsiz Danışma Al';
  const cta1Link = settings.cta1_link ?? getWaUrl(settings.whatsapp, 'Merhaba, ücretsiz danışma almak istiyorum.');
  const cta2Text = settings.cta2_text ?? 'Hizmetleri Keşfet';
  const cta2Link = settings.cta2_link ?? '/hizmetler';

  const isVideoActive = settings.hero_video_active === '1' || settings.hero_video_active === true;
  const mobileVideoActive = settings.hero_mobile_video_active === '1' || settings.hero_mobile_video_active === true;

  // Media selection logic
  const desktopVideo = settings.hero_video_url;
  const desktopPoster = settings.hero_image_url;
  const mobileVideo = settings.hero_mobile_video_url;
  const mobilePoster = settings.hero_mobile_poster_url || desktopPoster;

  const showDesktopVideo = isVideoActive && !isMobile && desktopVideo;
  const showMobileVideo = isVideoActive && isMobile && mobileVideoActive && mobileVideo;
  const showVideo = showDesktopVideo || showMobileVideo;
  const videoSrc = isMobile ? (mobileVideo || desktopVideo) : desktopVideo;
  const posterSrc = isMobile ? (mobilePoster || desktopPoster) : desktopPoster;

  const overlayOpacity = parseFloat(settings.hero_overlay_opacity || '0.5');

  const waLink = getWaUrl(settings.whatsapp, 'Merhaba, Viva Studio hakkında bilgi almak istiyorum.');

  return (
    <section
      ref={heroRef}
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: 'calc(100vh - 72px)', maxHeight: '900px' }}
    >
      {/* Background Media */}
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        {showVideo && videoSrc ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={posterSrc ? getMediaUrl(posterSrc) : undefined}
            className="w-full h-full object-cover"
            preload={isMobile ? 'none' : 'auto'}
          >
            <source src={getMediaUrl(videoSrc)} type="video/mp4" />
          </video>
        ) : posterSrc ? (
          <img
            src={getMediaUrl(posterSrc)}
            alt="Viva Studio Hero"
            className="w-full h-full object-cover"
            loading="eager"
          />
        ) : (
          // Premium placeholder when no media
          <div className="w-full h-full bg-gradient-to-br from-forest via-forest-light to-primary" />
        )}

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              160deg,
              rgba(18,61,42,${overlayOpacity + 0.1}) 0%,
              rgba(18,61,42,${overlayOpacity - 0.1}) 40%,
              rgba(18,61,42,${overlayOpacity + 0.15}) 100%
            )`
          }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        style={{ opacity }}
      >
        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-lime border border-lime/30 mb-6"
          style={{ background: 'rgba(168, 224, 99, 0.12)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
          Tuzla Premium Wellness Studio
        </motion.div>

        {/* Title */}
        {heroTitle && (
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-white font-bold mb-6 leading-tight"
            style={{
              fontSize: 'clamp(2.2rem, 6vw, 4.5rem)',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              whiteSpace: 'pre-line',
            }}
          >
            {heroTitle}
          </motion.h1>
        )}

        {/* Subtitle */}
        {heroDesc && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            {heroDesc}
          </motion.p>
        )}

        {/* Service Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          {['Pilates', 'EMS', 'Vacu Activ', 'G5', 'Bölgesel İncelme'].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-medium text-white/70"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* CTAs */}
        {(cta1Text || cta2Text) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {cta1Text && (
              cta1Link.startsWith('http') ? (
                <a href={cta1Link} target="_blank" rel="noreferrer" className="btn-gradient w-full sm:w-auto text-base">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                  </svg>
                  {cta1Text}
                </a>
              ) : (
                <Link to={cta1Link} className="btn-gradient w-full sm:w-auto text-base">{cta1Text}</Link>
              )
            )}

            {cta2Text && (
              cta2Link.startsWith('http') ? (
                <a href={cta2Link} target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-base text-white transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
                  {cta2Text}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ) : (
                <Link to={cta2Link}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-base text-white transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
                  {cta2Text}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{ opacity }}
      >
        <span className="text-white/50 text-xs uppercase tracking-widest font-medium">Keşfet</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center p-1"
        >
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>

      {/* WhatsApp quick link on mobile hero */}
      <motion.a
        href={waLink}
        target="_blank"
        rel="noreferrer"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 right-4 z-10 md:hidden flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-white"
        style={{ background: 'rgba(37,211,102,0.85)', backdropFilter: 'blur(8px)' }}
      >
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
        </svg>
        Hızlı İletişim
      </motion.a>
    </section>
  );
};

// =============================================
// SERVICE CARD
// =============================================
interface ServiceCardProps {
  service: any;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  const imgSrc = service.image_url || service.imageUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-card border border-sage/30 cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={imgSrc ? getMediaUrl(imgSrc) : `https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800`}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800'; }}
        />
        <div className="absolute inset-0 bg-gradient-card opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Category Badge */}
        {service.category && (
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-white shadow-soft">
            {service.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-text-dark mb-2 group-hover:text-primary transition-colors">
          {service.title}
        </h3>
        <p className="text-muted text-sm leading-relaxed mb-5 line-clamp-2">
          {service.short_description || service.shortDescription || service.description}
        </p>
        <Link
          to={`/hizmetler/${service.slug}`}
          className="inline-flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all"
        >
          Detaylı İncele
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* Bottom green line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </motion.div>
  );
};

// =============================================
// MAIN HOMEPAGE
// =============================================
const HomePage = () => {
  const { settings } = useOutletContext<{ settings: any }>() || { settings: {} };
  const [apiServices, setApiServices] = useState<any[]>([]);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [lightboxItem, setLightboxItem] = useState<any | null>(null);

  useReveal();

  useEffect(() => {
    apiClient.get('/services/list.php')
      .then(res => {
        const list = Array.isArray(res) ? res : (res?.data || []);
        const active = list.filter((s: any) => String(s.is_active) === '1' || s.is_active === true);
        active.sort((a: any, b: any) => (parseInt(a.sort_order) || 0) - (parseInt(b.sort_order) || 0));
        setApiServices(active);
      })
      .catch(() => setApiServices([]));

    fetch('/api/gallery/list.php')
      .then(r => r.json())
      .then(d => {
        const items = Array.isArray(d) ? d : (d?.data || []);
        setGalleryItems(items.filter((i: any) => String(i.is_active) !== '0').slice(0, 6));
      })
      .catch(() => setGalleryItems([]));
  }, []);

  const waUrl = getWaUrl(
    settings.whatsapp || '05365266936',
    `Merhaba, ${settings.site_name || 'Viva Studio'} hakkında bilgi almak istiyorum.`
  );
  const phoneUrl = `tel:${(settings.phone || '+905365266936').replace(/\s/g, '')}`;

  // Fallback gallery mock
  const displayGallery = galleryItems.length > 0 ? galleryItems : [
    { id: 1, url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800', title: 'Studio', category: 'Studio' },
    { id: 2, url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800', title: 'EMS', category: 'EMS' },
    { id: 3, url: 'https://images.unsplash.com/photo-1574680093662-425eb33d596c?auto=format&fit=crop&q=80&w=800', title: 'Vacu Activ', category: 'Pilates' },
    { id: 4, url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800', title: 'Ekipmanlar', category: 'Studio' },
    { id: 5, url: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&q=80&w=800', title: 'Pilates', category: 'Pilates' },
    { id: 6, url: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=800', title: 'G5', category: 'Studio' },
  ];

  return (
    <>
      <SEO
        title={settings.meta_title || 'Viva Studio Tuzla | Pilates, EMS, Vacu Activ, G5 — Premium Wellness'}
        description={settings.meta_description || 'Tuzla\'nın premium wellness stüdyosu. Reformer pilates, EMS antrenmanı, Vacu Activ ve G5 masaj ile bedeninizi güçlendirin ve forma girin.'}
      />

      {/* ===== 1. HERO ===== */}
      <HeroSection settings={settings} />

      {/* ===== 2. OPENING MESSAGE ===== */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="reveal">
              <div className="section-label justify-center">Viva Studio Tuzla</div>
              <h2 className="text-display font-bold text-text-dark mb-6">
                Pilates, EMS ve yenilikçi studio programlarıyla
                <span className="text-gradient"> bedenini güçlendir</span>
              </h2>
              <p className="text-lg text-muted leading-relaxed max-w-2xl mx-auto">
                {settings.about_intro || 'Tuzla\'nın premium wellness stüdyosunda kişiye özel programlar, modern ekipmanlar ve uzman eğitmenler eşliğinde sağlıklı yaşam hedeflerinize ulaşın.'}
              </p>
            </div>

            {/* Stats row */}
            <div className="reveal reveal-delay-2 grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-sage/30">
              {[
                { num: '500+', label: 'Mutlu Müşteri' },
                { num: '4', label: 'Premium Hizmet' },
                { num: '100%', label: 'Kişiye Özel' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.num}</p>
                  <p className="text-sm text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3. SERVICES PREVIEW ===== */}
      <section className="py-20 bg-ivory">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14 reveal">
            <div className="section-label justify-center">Hizmetlerimiz</div>
            <h2 className="text-display font-bold text-text-dark mb-4">
              Sizin İçin Neler Yapabiliriz?
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Modern ekipmanlar ve uzman kadromuzla hedeflerinize uygun kişiselleştirilmiş studio programları sunuyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(apiServices.length > 0 ? apiServices : [
              { id: 1, title: 'Pilates', slug: 'reformer-pilates', short_description: 'Vücudunuzu esnetin ve güçlendirin.', category: 'Pilates' },
              { id: 2, title: 'EMS Antrenmanı', slug: 'ems-antrenmani', short_description: '20 dakikada 3 saatlik spor etkisi.', category: 'EMS' },
              { id: 3, title: 'Vacu Activ', slug: 'vacu-active', short_description: 'Vakum ile bölgesel incelme.', category: 'Wellness' },
              { id: 4, title: 'G5 Masajı', slug: 'g5-masaji', short_description: 'Titreşimli masaj ile sıkılaşma.', category: 'Masaj' },
            ]).slice(0, 4).map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </div>

          <div className="text-center mt-12 reveal">
            <Link to="/hizmetler" className="btn-primary px-8 py-4 text-base">
              Tüm Hizmetleri İncele
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 4. WHY VIVA STUDIO ===== */}
      <section className="py-20 bg-forest relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #A8E063, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #2FB344, transparent)' }} />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center mb-14 reveal">
            <div className="inline-flex items-center gap-2 text-lime font-semibold text-sm uppercase tracking-widest mb-4">
              <span className="w-6 h-0.5 bg-lime rounded-full" />
              Neden Viva Studio?
            </div>
            <h2 className="text-display font-bold text-white mb-4">
              Tuzla'nın Tercih Ettiği Studio
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Kişiye özel yaklaşım, premium ekipman ve bütünleşik wellness anlayışı ile fark yaratıyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_US.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-3xl glass-dark hover:border-lime/20 transition-all duration-300 group"
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-lime transition-colors">
                  {item.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 5. TRANSFORMATION SECTION ===== */}
      <section className="py-20 bg-ivory">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14 reveal">
            <div className="section-label justify-center">Studio Programları</div>
            <h2 className="text-display font-bold text-text-dark mb-4">
              Hedefine Uygun Studio Deneyimi
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              Her hedef için özel program — güçlen, sıkılaş, forma gir veya enerji kazan.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {TRANSFORM_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className={`relative p-6 md:p-8 rounded-3xl text-white overflow-hidden cursor-pointer bg-gradient-to-br ${card.color}`}
              >
                <div className="absolute inset-0 opacity-10"
                  style={{ background: 'url("data:image/svg+xml,...")' }} />
                <div className="text-4xl md:text-5xl mb-4">{card.emoji}</div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">{card.title}</h3>
                <p className="text-white/75 text-sm leading-relaxed">{card.desc}</p>
                <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-white/60 group">
                  <Link to="/iletisim" className="hover:text-white transition-colors">
                    Başla →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 6. GALLERY PREVIEW ===== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 reveal">
            <div>
              <div className="section-label">Galeri</div>
              <h2 className="text-display font-bold text-text-dark">Studio Atmosferi</h2>
            </div>
            <Link to="/galeri" className="btn-ghost mt-4 md:mt-0">
              Tüm Görseller
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {displayGallery.map((item, i) => (
              <motion.div
                key={item.id || i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`relative group cursor-pointer overflow-hidden rounded-2xl ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                style={{ aspectRatio: i === 0 ? '16/10' : '1/1' }}
                onClick={() => setLightboxItem(item)}
              >
                {item.media_type === 'video' ? (
                  <>
                    <img
                      src={item.poster_url ? getMediaUrl(item.poster_url) : 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800'}
                      alt={item.title || 'Galeri'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                        <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </>
                ) : (
                  <img
                    src={getMediaUrl(item.url || item.image_url)}
                    alt={item.title || 'Galeri'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800'; }}
                  />
                )}
                <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/30 transition-all duration-300 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 7. PREMIUM CTA SECTION ===== */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-forest" />
        <div className="absolute inset-0 opacity-10"
          style={{ background: 'radial-gradient(ellipse at 30% 50%, #A8E063, transparent 60%), radial-gradient(ellipse at 70% 50%, #EAF7EC, transparent 60%)' }} />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center reveal">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-lime border border-lime/30 mb-6"
              style={{ background: 'rgba(168, 224, 99, 0.12)' }}>
              Harekete Geç
            </div>
            <h2 className="text-white font-bold mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.02em' }}>
              Sağlıklı Yaşama İlk Adımı At
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
              Ücretsiz danışma seansı için WhatsApp'tan yaz ya da bizi ara. Sana özel programını birlikte tasarlayalım.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-forest transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto justify-center"
                style={{ background: '#A8E063', boxShadow: '0 8px 32px rgba(168,224,99,0.35)' }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                </svg>
                WhatsApp'tan Yaz
              </a>
              <a
                href={phoneUrl}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto justify-center"
                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                Hemen Ara
              </a>
              <Link
                to="/iletisim"
                className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto justify-center"
                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Form Gönder
              </Link>
            </div>

            {/* Contact info mini */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10 text-white/50 text-sm">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {settings.address || 'Tuzla, İstanbul'}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
                </svg>
                {settings.working_hours || 'Hafta içi 09:00 - 21:00'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setLightboxItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={getMediaUrl(lightboxItem.url || lightboxItem.image_url)}
                alt={lightboxItem.title || 'Galeri'}
                className="w-full h-full object-contain rounded-2xl max-h-[85vh]"
              />
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HomePage;
