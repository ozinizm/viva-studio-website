import { useState, useEffect, useCallback } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getMediaUrl, handleImageError } from '../utils/mediaUrl';

interface Settings {
  site_name?: string;
  logo_url?: string;
  favicon_url?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  instagram_url?: string;
  facebook_url?: string;
  tiktok_url?: string;
  youtube_url?: string;
  working_hours?: string;
  google_maps_url?: string;
  footer_text?: string;
  hero_description?: string;
  google_analytics_id?: string;
  gtm_id?: string;
  meta_pixel_id?: string;
  [key: string]: string | undefined;
}

// =============================================
// SCROLL REVEAL HOOK
// =============================================
export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
}

// =============================================
// WHATSAPP HELPER
// =============================================
function getWhatsAppUrl(phone: string, msg: string = '') {
  const clean = phone.replace(/\D/g, '');
  const num = clean.startsWith('90') ? clean : `90${clean}`;
  return `https://wa.me/${num}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`;
}

// =============================================
// HEADER
// =============================================
const Header: React.FC<{ settings: Settings }> = ({ settings }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Ana Sayfa' },
    { to: '/hakkimizda', label: 'Hakkımızda' },
    { to: '/hizmetler', label: 'Hizmetler' },
    { to: '/galeri', label: 'Galeri' },
    { to: '/iletisim', label: 'İletişim' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const whatsappUrl = getWhatsAppUrl(
    settings.whatsapp || '05365266936',
    'Merhaba, Viva Studio hakkında bilgi almak istiyorum.'
  );
  const phoneUrl = `tel:${(settings.phone || '+905365266936').replace(/\s/g, '')}`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass shadow-card py-2'
          : 'bg-transparent py-4'
      }`}
      style={{
        background: isScrolled
          ? 'rgba(250, 248, 241, 0.92)'
          : 'transparent',
        backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(216, 232, 210, 0.5)' : 'none',
      }}
    >
      <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center relative z-50">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 relative z-50 shrink-0">
          {settings.logo_url ? (
            <img
              src={getMediaUrl(settings.logo_url)}
              onError={handleImageError}
              alt={settings.site_name || 'Viva Studio'}
              className="h-10 md:h-12 w-auto object-contain"
            />
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-forest flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-xl font-bold text-forest" style={{ fontFamily: 'Inter' }}>
                Viva<span className="text-primary">Studio</span>
              </span>
            </div>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive(link.to)
                  ? 'bg-primary text-white'
                  : 'text-text-dark hover:bg-mint hover:text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={phoneUrl}
            className="flex items-center gap-2 text-sm font-medium text-forest hover:text-primary transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            {settings.phone || '0536 526 69 36'}
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-gradient text-sm py-2.5 px-5"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M11.99 2C6.468 2 2 6.47 2 11.99a9.952 9.952 0 001.34 5.006L2 22l5.138-1.324A9.984 9.984 0 0011.99 22c5.522 0 9.99-4.47 9.99-9.99C21.98 6.47 17.51 2 11.99 2z" fillRule="evenodd" clipRule="evenodd"/>
            </svg>
            WhatsApp
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden relative z-50 p-2 rounded-xl text-text-dark"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menüyü aç/kapat"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${isMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
            <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden flex flex-col"
            style={{ background: 'rgba(250, 248, 241, 0.98)', backdropFilter: 'blur(20px)' }}
          >
            <div className="flex flex-col h-full pt-24 pb-8 px-6">
              {/* Nav Links */}
              <nav className="flex flex-col gap-2 flex-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <Link
                      to={link.to}
                      className={`flex items-center justify-between px-5 py-4 rounded-2xl text-xl font-semibold transition-all ${
                        isActive(link.to)
                          ? 'bg-primary text-white'
                          : 'text-text-dark hover:bg-mint'
                      }`}
                    >
                      {link.label}
                      <svg className="w-5 h-5 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-3 gap-3 mt-6"
              >
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-2 p-4 bg-primary text-white rounded-2xl font-medium text-sm"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                  </svg>
                  WhatsApp
                </a>
                <a
                  href={phoneUrl}
                  className="flex flex-col items-center gap-2 p-4 bg-forest text-white rounded-2xl font-medium text-sm"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  Ara
                </a>
                <a
                  href={settings.google_maps_url || 'https://maps.google.com/?q=Tuzla+Istanbul'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-2 p-4 bg-lime text-forest rounded-2xl font-medium text-sm"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  Yol Tarifi
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// =============================================
// WHATSAPP STICKY BUTTON
// =============================================
const WhatsAppSticky: React.FC<{ settings: Settings }> = ({ settings }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const whatsappUrl = getWhatsAppUrl(
    settings.whatsapp || '05365266936',
    'Merhaba, Viva Studio hakkında bilgi almak istiyorum.'
  );

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-premium"
          style={{ background: '#25D366' }}
          aria-label="WhatsApp ile iletişim"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884z"/>
            </svg>
          </motion.div>
          {/* Ping ring */}
          <span className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(37,211,102,0.3)' }} />
        </motion.a>
      )}
    </AnimatePresence>
  );
};

// =============================================
// FOOTER
// =============================================
const Footer: React.FC<{ settings: Settings }> = ({ settings }) => {
  const navLinks = [
    { to: '/hakkimizda', label: 'Hakkımızda' },
    { to: '/hizmetler', label: 'Hizmetler' },
    { to: '/galeri', label: 'Galeri' },
    { to: '/iletisim', label: 'İletişim' },
  ];

  const legalLinks = [
    { to: '/kvkk', label: 'KVKK Metni' },
    { to: '/gizlilik-politikasi', label: 'Gizlilik Politikası' },
    { to: '/cerez-politikasi', label: 'Çerez Politikası' },
  ];

  const phone = settings.phone || '0536 526 69 36';
  const whatsapp = settings.whatsapp || '05365266936';
  const email = settings.email || 'info@vivastudiotuzla.com';
  const address = settings.address || 'Tuzla, İstanbul';
  const hours = settings.working_hours || 'Hafta içi 09:00 - 21:00';

  const whatsappUrl = getWhatsAppUrl(whatsapp, 'Merhaba, bilgi almak istiyorum.');

  return (
    <footer className="bg-forest text-white/80 pt-16 pb-6">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-1">
            {settings.logo_url ? (
              <img
                src={getMediaUrl(settings.logo_url)}
                onError={handleImageError}
                alt={settings.site_name || 'Viva Studio'}
                className="h-12 w-auto object-contain brightness-0 invert mb-4"
              />
            ) : (
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                <span className="text-xl font-bold text-white">
                  Viva<span className="text-lime">Studio</span>
                </span>
              </div>
            )}
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              {settings.hero_description || 'Tuzla\'nın premium wellness stüdyosu. Pilates, EMS, Vacu Activ ve G5 ile bedeninizi güçlendirin.'}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              <a href={whatsappUrl} target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#25D366] flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Hızlı Linkler</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}
                    className="text-white/60 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-4 h-0.5 bg-primary/0 group-hover:bg-primary transition-all rounded-full" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Yasal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}
                    className="text-white/60 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-4 h-0.5 bg-primary/0 group-hover:bg-primary transition-all rounded-full" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">İletişim</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`tel:${phone.replace(/\s/g,'')}`}
                  className="flex items-start gap-3 text-white/60 hover:text-primary transition-colors">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  {phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`}
                  className="flex items-start gap-3 text-white/60 hover:text-primary transition-colors">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/60">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {address}
              </li>
              <li className="flex items-start gap-3 text-white/60">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
                </svg>
                {hours}
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} {settings.site_name || 'Viva Studio Tuzla'}. {settings.footer_text || 'Tüm hakları saklıdır.'}</p>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
            <p>Tuzla | İstanbul · Pilates · EMS · Vacu Activ · G5</p>
            <span className="hidden md:block opacity-30">|</span>
            <a href="https://fikircreative.com/" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors font-medium">
              Design by Fikir Creative
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// =============================================
// MAIN LAYOUT
// =============================================
const MainLayout = () => {
  const [settings, setSettings] = useState<Settings>({});

  const injectTracking = useCallback((data: Settings) => {
    // Favicon
    if (data.favicon_url) {
      const fullFavUrl = `${getMediaUrl(data.favicon_url)}?v=${Date.now()}`;
      ['icon', 'shortcut icon', 'apple-touch-icon'].forEach(rel => {
        let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
        if (!link) { link = document.createElement('link'); link.rel = rel; document.head.appendChild(link); }
        link.href = fullFavUrl;
      });
    }

    // GA4
    if (data.google_analytics_id && !document.getElementById('ga-script')) {
      const gaId = data.google_analytics_id.trim();
      const s1 = document.createElement('script');
      s1.id = 'ga-script-lib'; s1.async = true;
      s1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(s1);
      const s2 = document.createElement('script');
      s2.id = 'ga-script';
      s2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`;
      document.head.appendChild(s2);
    }

    // GTM
    if (data.gtm_id && !document.getElementById('gtm-script')) {
      const gtmId = data.gtm_id.trim();
      const s = document.createElement('script');
      s.id = 'gtm-script';
      s.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`;
      document.head.appendChild(s);
    }

    // Meta Pixel
    if (data.meta_pixel_id && !document.getElementById('pixel-script')) {
      const pixelId = data.meta_pixel_id.trim();
      const s = document.createElement('script');
      s.id = 'pixel-script';
      s.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`;
      document.head.appendChild(s);
    }
  }, []);

  useEffect(() => {
    fetch('/api/settings/get.php')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setSettings(data.data);
          injectTracking(data.data);
        }
      })
      .catch(console.error);
  }, [injectTracking]);

  return (
    <div className="flex flex-col min-h-screen bg-ivory">
      <Header settings={settings} />
      <main className="flex-grow">
        <Outlet context={{ settings }} />
      </main>
      <Footer settings={settings} />
      <WhatsAppSticky settings={settings} />
    </div>
  );
};

export default MainLayout;
