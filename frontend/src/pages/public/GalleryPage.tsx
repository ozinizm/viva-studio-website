import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/common/SEO';
import { getMediaUrl } from '../../utils/mediaUrl';

const CATEGORIES = ['Tümü', 'Görseller', 'Videolar', 'Pilates', 'EMS', 'Studio', 'Diğer'];

const MOCK_GALLERY = [
  { id: 1, url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800', title: 'Pilates Studio', category: 'Pilates', media_type: 'image', is_active: 1 },
  { id: 2, url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800', title: 'EMS Antrenman', category: 'EMS', media_type: 'image', is_active: 1 },
  { id: 3, url: 'https://images.unsplash.com/photo-1574680093662-425eb33d596c?auto=format&fit=crop&q=80&w=800', title: 'Vacu Activ', category: 'Studio', media_type: 'image', is_active: 1 },
  { id: 4, url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800', title: 'Ekipmanlar', category: 'Studio', media_type: 'image', is_active: 1 },
  { id: 5, url: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&q=80&w=800', title: 'Mat Pilates', category: 'Pilates', media_type: 'image', is_active: 1 },
  { id: 6, url: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=800', title: 'G5 Masajı', category: 'Studio', media_type: 'image', is_active: 1 },
  { id: 7, url: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&q=80&w=800', title: 'Esneme', category: 'Pilates', media_type: 'image', is_active: 1 },
  { id: 8, url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800', title: 'Studio Ortamı', category: 'Studio', media_type: 'image', is_active: 1 },
  { id: 9, url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800', title: 'Fitness', category: 'EMS', media_type: 'image', is_active: 1 },
];

const GalleryPage = () => {
  const [items, setItems] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [lightbox, setLightbox] = useState<any | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    fetch('/api/gallery/list.php')
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data?.data || []);
        const active = list.filter((i: any) => String(i.is_active) !== '0');
        setItems(active.length > 0 ? active : MOCK_GALLERY);
        setFiltered(active.length > 0 ? active : MOCK_GALLERY);
      })
      .catch(() => { setItems(MOCK_GALLERY); setFiltered(MOCK_GALLERY); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeCategory === 'Tümü') {
      setFiltered(items);
    } else if (activeCategory === 'Görseller') {
      setFiltered(items.filter(i => i.media_type !== 'video'));
    } else if (activeCategory === 'Videolar') {
      setFiltered(items.filter(i => i.media_type === 'video'));
    } else {
      setFiltered(items.filter(i => i.category === activeCategory));
    }
  }, [activeCategory, items]);

  // Lazy loading setup
  const setupLazyLoad = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observerRef.current?.unobserve(img);
          }
        }
      });
    }, { rootMargin: '200px' });
    document.querySelectorAll('img[data-src]').forEach(img => observerRef.current?.observe(img));
  }, []);

  useEffect(() => { setupLazyLoad(); }, [filtered, setupLazyLoad]);

  const openLightbox = (item: any) => {
    const idx = filtered.indexOf(item);
    setLightboxIndex(idx);
    setLightbox(item);
  };

  const prevItem = () => {
    const newIdx = (lightboxIndex - 1 + filtered.length) % filtered.length;
    setLightboxIndex(newIdx);
    setLightbox(filtered[newIdx]);
  };

  const nextItem = () => {
    const newIdx = (lightboxIndex + 1) % filtered.length;
    setLightboxIndex(newIdx);
    setLightbox(filtered[newIdx]);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowLeft') prevItem();
      if (e.key === 'ArrowRight') nextItem();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightbox, lightboxIndex]);

  return (
    <>
      <SEO
        title="Galeri | Viva Studio Tuzla"
        description="Viva Studio Tuzla galeri — studio ortamı, ekipmanlar, pilates, EMS ve wellness görselleri."
      />

      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-forest to-primary-dark">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 text-lime font-semibold text-sm uppercase tracking-widest mb-4">
              <span className="w-6 h-0.5 bg-lime rounded-full" />
              Galeri
            </div>
            <h1 className="text-white font-bold" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Studio Deneyimini Keşfet
            </h1>
            <p className="text-white/60 mt-2 text-lg">Ortamımız, ekipmanlarımız ve stüdyo atmosferi.</p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="sticky top-[72px] z-30 bg-white/90 backdrop-blur-md border-b border-sage/30 shadow-soft">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-glow'
                    : 'bg-mint/50 text-muted hover:bg-mint hover:text-primary'
                }`}
              >
                {cat}
                {cat === 'Tümü' && <span className="ml-1.5 text-xs opacity-60">({items.length})</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <section className="py-12 bg-ivory min-h-[60vh]">
        <div className="container mx-auto px-4 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="skeleton rounded-2xl aspect-square" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🖼️</div>
              <p className="text-muted text-lg">Bu kategoride görsel bulunamadı.</p>
            </div>
          ) : (
            <motion.div
              layout
              className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4"
            >
              <AnimatePresence>
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: i < 12 ? i * 0.04 : 0 }}
                    className="break-inside-avoid mb-4 group cursor-pointer relative overflow-hidden rounded-2xl bg-sage/20"
                    onClick={() => openLightbox(item)}
                  >
                    {item.media_type === 'video' ? (
                      <>
                        {item.poster_url ? (
                          <img
                            data-src={getMediaUrl(item.poster_url)}
                            src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                            alt={item.title || 'Video'}
                            className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${item.orientation === 'vertical' ? 'aspect-[9/16]' : 'aspect-video'}`}
                          />
                        ) : (
                          <video
                            src={getMediaUrl(item.video_url || item.image_url || item.url)}
                            className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${item.orientation === 'vertical' ? 'aspect-[9/16]' : 'aspect-video'}`}
                            muted
                            playsInline
                            onMouseEnter={(e) => {
                              const v = e.target as HTMLVideoElement;
                              v.play().catch(() => {});
                            }}
                            onMouseLeave={(e) => {
                              const v = e.target as HTMLVideoElement;
                              v.pause();
                              v.currentTime = 0;
                            }}
                          />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                          <div className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center border border-white/40">
                            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      </>
                    ) : (
                      <img
                        data-src={getMediaUrl(item.url || item.image_url)}
                        src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                        alt={item.title || item.alt_text || 'Galeri'}
                        className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800'; }}
                      />
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      {item.title && (
                        <p className="text-white text-sm font-semibold">{item.title}</p>
                      )}
                    </div>

                    {/* Category badge */}
                    {item.category && (
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-black/40 backdrop-blur-sm text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.category}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-5xl max-h-[90vh] w-full mx-4 flex items-center"
              onClick={e => e.stopPropagation()}
            >
              {lightbox.media_type === 'video' ? (
                <video controls autoPlay playsInline className="w-full max-h-[85vh] rounded-2xl bg-black" poster={lightbox.poster_url ? getMediaUrl(lightbox.poster_url) : ''}>
                  <source src={getMediaUrl(lightbox.video_url || lightbox.image_url || lightbox.url)} />
                </video>
              ) : (
                <img
                  src={getMediaUrl(lightbox.url || lightbox.image_url)}
                  alt={lightbox.title || 'Galeri'}
                  className="w-full max-h-[85vh] object-contain rounded-2xl"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=1200'; }}
                />
              )}

              {/* Close */}
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Nav */}
              {filtered.length > 1 && (
                <>
                  <button onClick={prevItem}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button onClick={nextItem}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 text-white text-xs">
                {lightboxIndex + 1} / {filtered.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GalleryPage;
