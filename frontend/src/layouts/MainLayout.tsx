
import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Header = () => {
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
        <Link to="/" className="text-2xl font-serif text-sage-dark font-bold relative z-50">
          Viva Studio
        </Link>
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="text-charcoal hover:text-sage transition-colors">Ana Sayfa</Link>
          <Link to="/hizmetler" className="text-charcoal hover:text-sage transition-colors">Hizmetler</Link>
          <Link to="/galeri" className="text-charcoal hover:text-sage transition-colors">Galeri</Link>
          <Link to="/blog" className="text-charcoal hover:text-sage transition-colors">Blog</Link>
          <Link to="/iletisim" className="text-charcoal hover:text-sage transition-colors">İletişim</Link>
        </nav>
        <div className="hidden md:block">
          <Link to="/rezervasyon" className="bg-sage text-warm-white px-6 py-2 rounded-2xl hover:bg-sage-dark transition-colors font-medium">
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
          <Link to="/rezervasyon" className="bg-sage text-warm-white px-8 py-4 rounded-2xl hover:bg-sage-dark transition-colors font-bold text-xl mt-4 w-full inline-block">
            Randevu Al
          </Link>
        </nav>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-sage-light pt-16 pb-8 border-t border-border-soft">
    <div className="container mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h3 className="text-2xl font-serif text-sage-dark font-bold mb-4">Viva Studio</h3>
        <p className="text-charcoal/80 mb-4">Dönüşümün Başladığı Yer.</p>
        <p className="text-charcoal/80">Tuzla ve çevresinde premium wellness deneyimi.</p>
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
          <li>0536 526 69 36</li>
          <li>info@vivastudio.com.tr</li>
          <li>Postane, Nazan Sk, 34940 Tuzla/İstanbul</li>
        </ul>
      </div>
    </div>
    <div className="container mx-auto px-4 mt-12 pt-8 border-t border-border-soft text-center text-charcoal/60 text-sm">
      &copy; {new Date().getFullYear()} Viva Studio. Tüm hakları saklıdır.
    </div>
  </footer>
);

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
