
import { Outlet, Link } from 'react-router-dom';

const Header = () => (
  <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-border-soft">
    <div className="container mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-serif text-sage-dark font-bold">
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
        <a href="https://wa.me/905365266936" className="bg-sage text-warm-white px-6 py-2 rounded-2xl hover:bg-sage-dark transition-colors font-medium">
          Randevu Al
        </a>
      </div>
      <button className="md:hidden text-charcoal">
        <svg xmlns="http://www.0w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  </header>
);

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
