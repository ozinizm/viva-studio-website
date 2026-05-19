import React from 'react';


interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noIndex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title = "Viva Studio Tuzla | Reformer Pilates, EMS ve Wellness Stüdyosu",
  description = "Tuzla Viva Studio'da reformer pilates, EMS, Vacu Active, G5 masajı ve vücut şekillendirme hizmetleriyle sağlıklı dönüşüm yolculuğunuza başlayın.",
  canonical,
  ogTitle,
  ogDescription,
  ogImage = "https://vivastudiopilates.com/og-image.jpg",
  noIndex = false,
}) => {
  React.useEffect(() => {
    document.title = title;

    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setMetaTag('description', description);
    
    if (ogTitle) setMetaTag('og:title', ogTitle, true);
    if (ogDescription) setMetaTag('og:description', ogDescription, true);
    if (ogImage) setMetaTag('og:image', ogImage, true);
    
    if (noIndex) {
      setMetaTag('robots', 'noindex, nofollow');
    } else {
      setMetaTag('robots', 'index, follow');
    }

    if (canonical) {
      let link = document.querySelector(`link[rel="canonical"]`);
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
    }
  }, [title, description, canonical, ogTitle, ogDescription, ogImage, noIndex]);

  return null;
};

export default SEO;
