import React, { useState } from 'react';

import SEO from '../../components/common/SEO';
import { galleryItems } from '../../data/mockData';

const GalleryPage = () => {
  const [filter, setFilter] = useState('Tümü');
  const categories = ['Tümü', ...Array.from(new Set(galleryItems.map(item => item.category)))];

  const filteredItems = filter === 'Tümü' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);

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
              <div key={item.id} className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer shadow-soft">
                <img src={item.url} alt={item.category} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-warm-white font-medium text-lg tracking-wider">{item.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default GalleryPage;
