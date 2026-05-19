import React, { useState, useEffect } from 'react';
import SEO from '../../components/common/SEO';
import { galleryItems as mockGalleryItems } from '../../data/mockData';
import { getMediaUrl } from '../../utils/mediaUrl';

interface GalleryItem {
  id: number;
  title?: string;
  category: string;
  image_url: string;
  video_url?: string;
  media_type: 'image' | 'video';
  alt_text?: string;
  sort_order: number;
  is_active: boolean | number;
}

const GalleryPage = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Tümü');
  const [selectedMedia, setSelectedMedia] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetch('/api/gallery/list.php')
      .then(res => res.json())
      .then(data => {
        const rawList = Array.isArray(data) ? data : (data?.data || []);
        const active = rawList.filter((item: any) => String(item.is_active) === '1' || item.is_active === true);
        if (active.length > 0) {
          // Sort by sort_order
          active.sort((a: any, b: any) => (parseInt(a.sort_order) || 0) - (parseInt(b.sort_order) || 0));
          setItems(active);
        } else {
          // Map mock items to fit type
          const mappedMock = mockGalleryItems.map((m: any) => ({
            id: m.id,
            category: m.category,
            image_url: m.url,
            media_type: 'image' as const,
            sort_order: 0,
            is_active: true
          }));
          setItems(mappedMock);
        }
      })
      .catch(() => {
        const mappedMock = mockGalleryItems.map((m: any) => ({
          id: m.id,
          category: m.category,
          image_url: m.url,
          media_type: 'image' as const,
          sort_order: 0,
          is_active: true
        }));
        setItems(mappedMock);
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = ['Tümü', ...Array.from(new Set(items.map(item => item.category)))];

  const filteredItems = filter === 'Tümü' 
    ? items 
    : items.filter(item => item.category === filter);

  return (
    <>
      <SEO title="Galeri | Viva Studio" description="Viva Studio'nun premium stüdyo ortamını, modern ekipmanlarını ve atmosferini keşfedin." />
      
      <div className="bg-sage-light py-20 border-b border-border-soft">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-sage-dark mb-4">Galeri</h1>
          <p className="text-lg text-charcoal/80 max-w-2xl mx-auto">Viva Studio deneyimini yakından inceleyin.</p>
        </div>
      </div>

      <div className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          {loading ? (
            <div className="text-center py-10 text-charcoal/60">Yükleniyor...</div>
          ) : (
            <>
              {/* Filters */}
              <div className="flex flex-wrap justify-center gap-2 mb-12">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-6 py-2 rounded-full font-medium transition-all ${
                      filter === cat 
                        ? 'bg-sage text-warm-white shadow-soft' 
                        : 'bg-warm-white text-charcoal border border-border-soft hover:bg-sage-light'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => setSelectedMedia(item)}
                    className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer shadow-soft bg-sage-light/10 border border-border-soft"
                  >
                    {item.media_type === 'video' ? (
                      <div className="w-full h-full relative">
                        {item.image_url ? (
                          <video src={getMediaUrl(item.image_url)} className="w-full h-full object-cover" muted playsInline />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-sage-dark/10">
                            <span className="text-4xl">🎬</span>
                            <span className="mt-2 text-xs font-medium text-charcoal/70">Videoyu İzle</span>
                          </div>
                        )}
                        <span className="absolute top-4 left-4 bg-sage text-warm-white text-xs px-2.5 py-1 rounded-full shadow-sm">Video</span>
                      </div>
                    ) : (
                      <img src={getMediaUrl(item.image_url)} alt={item.alt_text || item.category} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    )}
                    <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center p-4">
                      <span className="text-warm-white font-medium text-lg tracking-wider mb-1">{item.title || item.category}</span>
                      <span className="text-warm-white/80 text-xs">{item.media_type === 'video' ? 'Oynatmak için tıklayın' : 'Büyütmek için tıklayın'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Lightbox / Video Modal */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 bg-charcoal/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedMedia(null)}
        >
          <div 
            className="relative bg-black rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex items-center justify-center shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 z-50 bg-charcoal/50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-charcoal transition-colors font-bold text-lg"
            >
              ✕
            </button>
            {selectedMedia.media_type === 'video' ? (
              <video 
                src={getMediaUrl(selectedMedia.image_url || selectedMedia.video_url)} 
                controls 
                autoPlay 
                className="max-w-full max-h-[80vh] object-contain" 
              />
            ) : (
              <img 
                src={getMediaUrl(selectedMedia.image_url)} 
                alt={selectedMedia.alt_text || selectedMedia.category} 
                className="max-w-full max-h-[80vh] object-contain" 
              />
            )}
            {selectedMedia.title && (
              <div className="absolute bottom-0 inset-x-0 bg-charcoal/80 text-warm-white p-4 text-center text-sm font-medium">
                {selectedMedia.title}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryPage;
