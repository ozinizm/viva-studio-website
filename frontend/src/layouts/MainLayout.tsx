import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { getMediaUrl, handleImageError } from '../utils/mediaUrl';

interface SettingsProps {
  settings: any;
}

const Header: React.FC<SettingsProps> = ({ settings }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-border-soft">
      <div className="container mx-auto px-4 lg:px-8 py-4 flex justify-between items-center relative z-50">
        <Link to="/" className="flex items-center gap-2 relative z-50">
          {settings.logo_url ? (
            <img 
              src={getMediaUrl(settings.logo_url)} 
              onError={handleImageError} 
              alt={settings.site_name || 'Viva Studio'} 
              className="h-10 md:h-12 object-contain" 
            />
          ) : (
            <span className="text-2xl font-serif text-sage-dark font-bold">
              {settings.site_name || 'Viva Studio'}
            </span>
          )}
        </Link>
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="text-charcoal hover:text-sage transition-colors">Ana Sayfa</Link>
          <Link to="/hizmetler" className="text-charcoal hover:text-sage transition-colors">Hizmetler</Link>
          <Link to="/galeri" className="text-charcoal hover:text-sage transition-colors">Galeri</Link>
          <Link to="/blog" className="text-charcoal hover:text-sage transition-colors">Blog</Link>
          <Link to="/iletisim" className="text-charcoal hover:text-sage transition-colors">İletişim</Link>
        </nav>
        <div className="hidden md:block">
          <Link to="/iletisim" className="bg-sage text-warm-white px-6 py-2 rounded-2xl hover:bg-sage-dark transition-colors font-medium">
            Randevu Al
          </Link>
        </div>
        <button 
          className="md:hidden text-charcoal relative z-50 p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-cream z-40 transition-transform duration-300 ease-in-out md:hidden flex flex-col justify-center items-center ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col space-y-6 text-center w-full px-8">
          <Link to="/" className="text-2xl text-charcoal font-medium hover:text-sage transition-colors border-b border-border-soft pb-4 w-full">Ana Sayfa</Link>
          <Link to="/hizmetler" className="text-2xl text-charcoal font-medium hover:text-sage transition-colors border-b border-border-soft pb-4 w-full">Hizmetler</Link>
          <Link to="/galeri" className="text-2xl text-charcoal font-medium hover:text-sage transition-colors border-b border-border-soft pb-4 w-full">Galeri</Link>
          <Link to="/blog" className="text-2xl text-charcoal font-medium hover:text-sage transition-colors border-b border-border-soft pb-4 w-full">Blog</Link>
          <Link to="/iletisim" className="text-2xl text-charcoal font-medium hover:text-sage transition-colors border-b border-border-soft pb-4 w-full">İletişim</Link>
          <Link to="/iletisim" className="bg-sage text-warm-white px-8 py-4 rounded-2xl hover:bg-sage-dark transition-colors font-bold text-xl mt-4 w-full inline-block">
            Randevu Al
          </Link>
        </nav>
      </div>
    </header>
  );
};

const Footer: React.FC<SettingsProps> = ({ settings }) => (
  <footer className="bg-sage-light pt-16 pb-8 border-t border-border-soft">
    <div className="container mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h3 className="text-2xl font-serif text-sage-dark font-bold mb-4">
          {settings.logo_url ? (
            <img 
              src={getMediaUrl(settings.logo_url)} 
              onError={handleImageError} 
              alt={settings.site_name || 'Viva Studio'} 
              className="h-10 md:h-12 object-contain" 
            />
          ) : (
            settings.site_name || 'Viva Studio'
          )}
        </h3>
        <p className="text-charcoal/80 mb-4">{settings.hero_description || 'Dönüşümün Başladığı Yer.'}</p>
        <p className="text-charcoal/80">{settings.address || 'Tuzla ve çevresinde premium wellness deneyimi.'}</p>
      </div>
      <div>
        <h4 className="font-bold text-charcoal mb-4 uppercase tracking-wider text-sm">Hızlı Linkler</h4>
        <ul className="space-y-2">
          <li><Link to="/hizmetler" className="text-charcoal/80 hover:text-sage transition-colors">Hizmetlerimiz</Link></li>
          <li><Link to="/galeri" className="text-charcoal/80 hover:text-sage transition-colors">Galeri</Link></li>
          <li><Link to="/iletisim" className="text-charcoal/80 hover:text-sage transition-colors">İletişim</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-charcoal mb-4 uppercase tracking-wider text-sm">Yasal</h4>
        <ul className="space-y-2">
          <li><Link to="/kvkk" className="text-charcoal/80 hover:text-sage transition-colors">KVKK Metni</Link></li>
          <li><Link to="/gizlilik-politikasi" className="text-charcoal/80 hover:text-sage transition-colors">Gizlilik Politikası</Link></li>
          <li><Link to="/cerez-politikasi" className="text-charcoal/80 hover:text-sage transition-colors">Çerez Politikası</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-charcoal mb-4 uppercase tracking-wider text-sm">İletişim</h4>
        <ul className="space-y-2 text-charcoal/80">
          <li>{settings.phone || '0536 526 69 36'}</li>
          <li>{settings.email || 'info@vivastudio.com.tr'}</li>
          <li>{settings.address || 'Postane, Nazan Sk, 34940 Tuzla/İstanbul'}</li>
        </ul>
      </div>
    </div>
    <div className="container mx-auto px-4 mt-12 pt-8 border-t border-border-soft text-center text-charcoal/60 text-sm">
      &copy; {new Date().getFullYear()} {settings.site_name || 'Viva Studio'}. {settings.footer_text || 'Tüm hakları saklıdır.'}
    </div>
  </footer>
);

const MainLayout = () => {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    fetch('/api/settings/get.php')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setSettings(data.data);
          
          // 1. Update Favicon dynamically
          const favUrl = data.data.favicon_url;
          if (favUrl) {
            const fullFavUrl = `${getMediaUrl(favUrl)}?v=${Date.now()}`;
            const rels = ['icon', 'shortcut icon', 'apple-touch-icon'];
            rels.forEach(rel => {
              let link: HTMLLinkElement | null = document.querySelector(`link[rel="${rel}"]`);
              if (!link) {
                link = document.createElement('link');
                link.rel = rel;
                document.head.appendChild(link);
              }
              link.href = fullFavUrl;
            });
          }

          // 2. Dynamically Inject Tracking Scripts
          if (data.data.google_analytics_id) {
            const gaId = data.data.google_analytics_id.trim();
            if (gaId && !document.getElementById('ga-script')) {
              const script1 = document.createElement('script');
              script1.id = 'ga-script-lib';
              script1.async = true;
              script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
              document.head.appendChild(script1);
              
              const script2 = document.createElement('script');
              script2.id = 'ga-script';
              script2.innerHTML = `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `;
              document.head.appendChild(script2);
            }
          }
          
          if (data.data.gtm_id) {
            const gtmId = data.data.gtm_id.trim();
            if (gtmId && !document.getElementById('gtm-script')) {
              const script = document.createElement('script');
              script.id = 'gtm-script';
              script.innerHTML = `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `;
              document.head.appendChild(script);
            }
          }
          
          if (data.data.meta_pixel_id) {
            const pixelId = data.data.meta_pixel_id.trim();
            if (pixelId && !document.getElementById('pixel-script')) {
              const script = document.createElement('script');
              script.id = 'pixel-script';
              script.innerHTML = `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${pixelId}');
                fbq('track', 'PageView');
              `;
              document.head.appendChild(script);
            }
          }
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Header settings={settings} />
      <main className="flex-grow">
        <Outlet context={{ settings }} />
      </main>
      <Footer settings={settings} />
    </div>
  );
};

export default MainLayout;
