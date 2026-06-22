import React from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noIndex?: boolean;
  schemaType?: 'LocalBusiness' | 'Service' | 'Organization';
}

const SEO: React.FC<SEOProps> = ({
  title = 'Viva Studio Tuzla | Pilates, EMS, Vacu Activ, G5 — Premium Wellness',
  description = 'Tuzla\'nın premium wellness stüdyosu. Reformer pilates, EMS antrenmanı, Vacu Activ ve G5 masaj ile bedeninizi güçlendirin ve forma girin.',
  canonical,
  ogTitle,
  ogDescription,
  ogImage = '/og-image.jpg',
  ogType = 'website',
  noIndex = false,
  schemaType = 'LocalBusiness',
}) => {
  React.useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let tag = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // Core
    setMeta('description', description);
    setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
    setMeta('theme-color', '#2FB344');

    // Open Graph
    setMeta('og:type', ogType, true);
    setMeta('og:title', ogTitle || title, true);
    setMeta('og:description', ogDescription || description, true);
    setMeta('og:image', ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}`, true);
    setMeta('og:url', canonical || window.location.href, true);
    setMeta('og:locale', 'tr_TR', true);
    setMeta('og:site_name', 'Viva Studio Tuzla', true);

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', ogTitle || title);
    setMeta('twitter:description', ogDescription || description);

    // Canonical
    const finalCanonical = canonical || window.location.href.split('?')[0];
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.href = finalCanonical;

    // Structured Data (LocalBusiness)
    if (!noIndex) {
      const schema = {
        '@context': 'https://schema.org',
        '@type': schemaType || 'LocalBusiness',
        name: 'Viva Studio Tuzla',
        description: 'Tuzla\'nın premium wellness stüdyosu. Pilates, EMS, Vacu Activ ve G5 hizmetleri.',
        url: 'https://vivastudiopilates.com',
        telephone: '+905365266936',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Tuzla',
          addressRegion: 'İstanbul',
          addressCountry: 'TR',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 40.8186,
          longitude: 29.3004,
        },
        openingHoursSpecification: [
          { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '21:00' },
          { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '19:00' },
        ],
        image: ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}`,
        priceRange: '₺₺',
        currenciesAccepted: 'TRY',
        paymentAccepted: 'Cash, Credit Card',
        areaServed: 'Tuzla, İstanbul',
      };

      let schemaScript = document.getElementById('structured-data-schema');
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'structured-data-schema';
        schemaScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schema);
    }
  }, [title, description, canonical, ogTitle, ogDescription, ogImage, ogType, noIndex, schemaType]);

  return null;
};

export default SEO;
