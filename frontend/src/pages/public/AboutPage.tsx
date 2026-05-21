import { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../components/common/SEO';
import { getMediaUrl } from '../../utils/mediaUrl';

function getWaUrl(phone: string, msg: string) {
  const clean = (phone || '05365266936').replace(/\D/g, '');
  const num = clean.startsWith('90') ? clean : `90${clean}`;
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}

const VALUES = [
  { icon: '🎯', title: 'Kişisel Yaklaşım', desc: 'Her müşterimize birebir ilgi ve kişiye özel program.' },
  { icon: '🏆', title: 'Mükemmellik', desc: 'Premium ekipman, temiz ortam, profesyonel ekip.' },
  { icon: '💚', title: 'Sağlıklı Yaşam', desc: 'Sadece form değil; sürdürülebilir, sağlıklı bir yaşam anlayışı.' },
  { icon: '🤝', title: 'Güven & Şeffaflık', desc: 'Açık iletişim ve dürüst danışmanlık ilkesiyle çalışıyoruz.' },
];

const AboutPage = () => {
  const { settings } = useOutletContext<{ settings: any }>() || { settings: {} };
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    // Scroll reveal
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const aboutTitle = settings.about_title || 'Tuzla\'nın Premium Wellness Studio\'su';
  const aboutContent = settings.about_content || 'Viva Studio Tuzla, 2022 yılında Tuzla\'nın kalbinde hayata geçirilmiş premium bir wellness ve studio markasıdır. Pilates, EMS antrenmanı, Vacu Activ ve G5 masaj teknolojilerini tek çatı altında buluşturan stüdyomuz, her müşteriye kişiye özel bir sağlıklı yaşam deneyimi sunmayı hedefler.\n\nModern ekipmanlarımız, ferah ve hijyenik studio ortamımız ve uzman eğitmen kadromuzla Tuzla ve çevresindeki müşterilerimize üst düzey hizmet veriyoruz. Her seans, size özel hazırlanan bir program çerçevesinde, deneyimli eğitmenlerimiz gözetiminde gerçekleştirilir.';
  const aboutImage = settings.about_image_url;
  const waUrl = getWaUrl(settings.whatsapp, 'Merhaba, Viva Studio hakkında bilgi almak istiyorum.');

  return (
    <>
      <SEO
        title={settings.about_seo_title || 'Hakkımızda | Viva Studio Tuzla'}
        description={settings.about_seo_description || 'Viva Studio Tuzla hakkında — pilates, EMS, Vacu Activ ve G5 hizmetleri sunan Tuzla\'nın premium wellness stüdyosu.'}
      />

      {/* Page Hero */}
      <section className="relative py-24 bg-forest overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ background: 'radial-gradient(ellipse at 70% 50%, #A8E063, transparent 60%)' }} />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 text-lime font-semibold text-sm uppercase tracking-widest mb-4">
              <span className="w-6 h-0.5 bg-lime rounded-full" />
              Biz Kimiz?
            </div>
            <h1 className="text-white font-bold mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>
              {aboutTitle}
            </h1>
            <p className="text-white/60 text-lg">
              Pilates, EMS, Vacu Activ ve G5 ile Tuzla'da wellness deneyimini yeniden tanımlıyoruz.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal-left">
              <div className="section-label">Hikayemiz</div>
              <h2 className="text-section font-bold text-text-dark mb-6">
                Sağlıklı Yaşamın Adresi
              </h2>
              <div className="prose prose-green text-muted space-y-4">
                {aboutContent.split('\n\n').map((para: string, i: number) => (
                  <p key={i} className="leading-relaxed">{para}</p>
                ))}
              </div>
              <div className="mt-8 flex gap-4">
                <a href={waUrl} target="_blank" rel="noreferrer" className="btn-primary">
                  Bizimle İletişime Geç
                </a>
                <Link to="/hizmetler" className="btn-secondary">
                  Hizmetlerimiz
                </Link>
              </div>
            </div>

            <div className="reveal-right">
              {aboutImage ? (
                <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-premium">
                  <img
                    src={getMediaUrl(aboutImage)}
                    alt="Viva Studio"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=1200'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/30 to-transparent" />
                </div>
              ) : (
                <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-premium bg-gradient-to-br from-mint to-sage">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🏃‍♀️</div>
                      <p className="text-forest font-bold text-xl">Viva Studio Tuzla</p>
                      <p className="text-muted text-sm mt-2">Premium Wellness Studio</p>
                    </div>
                  </div>
                  {/* Grid decoration */}
                  <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: 'linear-gradient(#2FB344 1px, transparent 1px), linear-gradient(90deg, #2FB344 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                </div>
              )}

              {/* Float badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-6 right-6 glass px-4 py-2 rounded-2xl shadow-card text-sm font-semibold text-forest"
              >
                ✅ 500+ Mutlu Müşteri
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Quick List */}
      <section className="py-20 bg-ivory">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14 reveal">
            <div className="section-label justify-center">Ne Sunuyoruz?</div>
            <h2 className="text-section font-bold text-text-dark">Hizmet Alanlarımız</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { title: 'Pilates', icon: '🧘', desc: 'Reformer & Mat', slug: 'reformer-pilates' },
              { title: 'EMS', icon: '⚡', desc: '20 dk = 3 saat', slug: 'ems-antrenmani' },
              { title: 'Vacu Activ', icon: '🌀', desc: 'Vakumlu incelme', slug: 'vacu-active' },
              { title: 'G5 Masajı', icon: '💆', desc: 'Titreşimli selülit', slug: 'g5-masaji' },
            ].map((svc, i) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/hizmetler/${svc.slug}`}
                  className="block p-6 bg-white rounded-3xl shadow-card border border-sage/30 text-center hover:border-primary hover:shadow-glow transition-all duration-300 group"
                >
                  <div className="text-4xl mb-3">{svc.icon}</div>
                  <h3 className="font-bold text-text-dark mb-1 group-hover:text-primary transition-colors">{svc.title}</h3>
                  <p className="text-xs text-muted">{svc.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-forest">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14 reveal">
            <div className="inline-flex items-center gap-2 text-lime font-semibold text-sm uppercase tracking-widest mb-4">
              <span className="w-6 h-0.5 bg-lime rounded-full" />
              Değerlerimiz
            </div>
            <h2 className="text-section font-bold text-white">Çalışma Prensibimiz</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-3xl glass-dark text-center"
              >
                <div className="text-4xl mb-4">{val.icon}</div>
                <h3 className="text-white font-bold mb-2">{val.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8 text-center reveal">
          <h2 className="text-section font-bold text-text-dark mb-4">Sizi Bekliyoruz</h2>
          <p className="text-muted mb-8 max-w-xl mx-auto">
            İlk seansınız için randevu alın, size özel programınızı birlikte belirleyelim.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={waUrl} target="_blank" rel="noreferrer" className="btn-gradient text-base py-4 px-8">
              WhatsApp ile Randevu Al
            </a>
            <Link to="/iletisim" className="btn-secondary text-base py-4 px-8">
              İletişim Sayfası
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
