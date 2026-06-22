import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../components/common/SEO';

function getWaUrl(phone: string, msg: string) {
  const clean = (phone || '05365266936').replace(/\D/g, '');
  const num = clean.startsWith('90') ? clean : `90${clean}`;
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}

interface FormState {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
}

const SERVICES = ['Pilates', 'EMS Antrenmanı', 'Vacu Activ', 'G5 Masajı', 'Bölgesel İncelme', 'Genel Bilgi'];

const ContactPage = () => {
  const { settings } = useOutletContext<{ settings: any }>() || { settings: {} };
  const [form, setForm] = useState<FormState>({ name: '', phone: '', email: '', service: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const phone = settings.phone || '0536 526 69 36';
  const whatsapp = settings.whatsapp || '05365266936';
  const email = settings.email || 'info@vivastudiopilates.com';
  const address = settings.address || 'Tuzla, İstanbul';
  const hours = settings.working_hours || 'Hafta içi 09:00 - 21:00';
  const mapsUrl = settings.google_maps_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24088!2d29.3!3d40.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac0f8e4b3a7fd%3A0x7e5b2f3a1b9d!2sTuzla%2C+İstanbul!5e0!3m2!1str!2str!4v1';

  const waUrl = getWaUrl(whatsapp, 'Merhaba, Viva Studio hakkında bilgi almak istiyorum.');
  const phoneUrl = `tel:${phone.replace(/\s/g, '')}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact/submit.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Bir hata oluştu.');
      }
      setStatus('success');
      setForm({ name: '', phone: '', email: '', service: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Form gönderilemedi. Lütfen WhatsApp veya telefon ile iletişime geçin.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  let finalMapsEmbed = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12044!2d29.299!3d40.820!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac1b7ae9a0879%3A0x3a7b2e83f3b90cae!2sTuzla%2C%20%C4%B0stanbul!5e0!3m2!1str!2str!4v1`;

  if (mapsUrl) {
    if (mapsUrl.includes('<iframe')) {
      // User pasted the full HTML iframe tag from Google Maps
      const srcMatch = mapsUrl.match(/src="([^"]+)"/);
      if (srcMatch && srcMatch[1]) {
        finalMapsEmbed = srcMatch[1];
      }
    } else if (mapsUrl.includes('embed')) {
      // User pasted just the embed URL
      finalMapsEmbed = mapsUrl;
    }
  }

  return (
    <>
      <SEO
        title="İletişim | Viva Studio Tuzla"
        description="Viva Studio Tuzla iletişim. Telefon, WhatsApp veya form ile ulaşın. Tuzla, İstanbul adresimizi ziyaret edin."
      />

      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-forest to-primary-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ background: 'radial-gradient(ellipse at 80% 50%, #A8E063, transparent)' }} />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 text-lime font-semibold text-sm uppercase tracking-widest mb-4">
              <span className="w-6 h-0.5 bg-lime rounded-full" />
              İletişim
            </div>
            <h1 className="text-white font-bold" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Bize Ulaşın
            </h1>
            <p className="text-white/60 text-lg mt-2 max-w-xl">
              Randevu, bilgi veya danışmanlık için WhatsApp, telefon veya formu kullanabilirsiniz.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <section className="py-10 bg-ivory">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <motion.a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="flex items-center gap-4 p-6 bg-white rounded-3xl shadow-card border border-sage/30 hover:border-primary/30 hover:shadow-glow transition-all"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0" style={{ background: '#25D366' }}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                </svg>
              </div>
              <div>
                <p className="text-xs text-muted font-medium">WhatsApp</p>
                <p className="font-bold text-text-dark text-sm">{phone}</p>
                <p className="text-xs text-primary mt-0.5">Mesaj gönder →</p>
              </div>
            </motion.a>

            <motion.a
              href={phoneUrl}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -4 }}
              className="flex items-center gap-4 p-6 bg-white rounded-3xl shadow-card border border-sage/30 hover:border-primary/30 hover:shadow-glow transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shrink-0">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </div>
              <div>
                <p className="text-xs text-muted font-medium">Telefon</p>
                <p className="font-bold text-text-dark text-sm">{phone}</p>
                <p className="text-xs text-primary mt-0.5">Hemen ara →</p>
              </div>
            </motion.a>

            <motion.a
              href={`mailto:${email}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -4 }}
              className="flex items-center gap-4 p-6 bg-white rounded-3xl shadow-card border border-sage/30 hover:border-primary/30 hover:shadow-glow transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-forest flex items-center justify-center text-white shrink-0">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <div>
                <p className="text-xs text-muted font-medium">E-posta</p>
                <p className="font-bold text-text-dark text-sm truncate">{email}</p>
                <p className="text-xs text-primary mt-0.5">Mail gönder →</p>
              </div>
            </motion.a>
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Form */}
            <div className="lg:col-span-3 reveal-left">
              <div className="section-label">İletişim Formu</div>
              <h2 className="text-section font-bold text-text-dark mb-6">Mesaj Gönderin</h2>

              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 bg-primary/10 rounded-3xl border border-primary/30 text-center"
                >
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-xl font-bold text-text-dark mb-2">Mesajınız Alındı!</h3>
                  <p className="text-muted mb-6">En kısa sürede sizinle iletişime geçeceğiz.</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="btn-primary"
                  >
                    Yeni Mesaj Gönder
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {status === 'error' && (
                    <div className="p-4 rounded-2xl bg-danger/10 border border-danger/30 text-danger text-sm">
                      {errorMsg || 'Form gönderilemedi. Lütfen tekrar deneyin.'}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="form-label">Ad Soyad *</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Adınız Soyadınız"
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">Telefon *</label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        type="tel"
                        placeholder="0555 000 00 00"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="form-label">E-posta</label>
                      <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        type="email"
                        placeholder="ornek@email.com"
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">İlgilendiğiniz Hizmet</label>
                      <select name="service" value={form.service} onChange={handleChange} className="form-input">
                        <option value="">Seçiniz...</option>
                        {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Mesajınız</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Sorularınızı veya talebinizi yazın..."
                      className="form-textarea"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-gradient w-full sm:w-auto px-10 py-4 text-base"
                  >
                    {status === 'loading' ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Gönderiliyor...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                        Mesajı Gönder
                      </span>
                    )}
                  </button>

                  <p className="text-xs text-muted">
                    Form verileriniz KVKK kapsamında işlenir. Hızlı iletişim için{' '}
                    <a href={waUrl} target="_blank" rel="noreferrer" className="text-primary underline">
                      WhatsApp'ı tercih edebilirsiniz.
                    </a>
                  </p>
                </form>
              )}
            </div>

            {/* Info + Map */}
            <div className="lg:col-span-2 reveal-right space-y-6">
              <div>
                <div className="section-label">Konum & Bilgiler</div>
                <h2 className="text-section font-bold text-text-dark mb-6">Bizi Ziyaret Edin</h2>
              </div>

              {/* Info cards */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-ivory rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Adres</p>
                    <p className="text-text-dark font-medium text-sm">{address}</p>
                    {settings.google_maps_url && (
                      <a href={settings.google_maps_url} target="_blank" rel="noreferrer" className="text-xs text-primary mt-1 inline-block hover:underline">
                        Yol tarifi al →
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-ivory rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Çalışma Saatleri</p>
                    <p className="text-text-dark font-medium text-sm whitespace-pre-line">{hours}</p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="rounded-3xl overflow-hidden shadow-card h-64">
                <iframe
                  src={finalMapsEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Viva Studio Tuzla Konum"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
