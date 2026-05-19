export const services = [
  {
    id: 1,
    title: 'Reformer Pilates',
    slug: 'reformer-pilates',
    shortDescription: 'Vücudunuzu esnetin, güçlendirin ve duruşunuzu düzeltin.',
    description: 'Aletli pilates ile kaslarınızı uzatın ve güçlendirin. Deneyimli eğitmenlerimiz eşliğinde duruş bozukluklarını giderin ve esnekliğinizi artırın.',
    benefits: ['Esneklik artışı', 'Core bölgesi güçlendirme', 'Duruş bozukluğu düzeltme', 'Sırt ve bel ağrılarında azalma'],
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 2,
    title: 'EMS Antrenmanı',
    slug: 'ems-antrenmani',
    shortDescription: '20 dakikada 3 saatlik spor etkisi yaratın.',
    description: 'Elektriksel kas uyarımı ile tüm kas gruplarınızı aynı anda çalıştırın. Zamanınız yoksa EMS tam size göre.',
    benefits: ['Zaman tasarrufu', 'Hızlı kas gelişimi', 'Eklem dostu', 'Metabolizma hızlandırma'],
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 3,
    title: 'Vacu Active',
    slug: 'vacu-active',
    shortDescription: 'Vakum teknolojisi ile bölgesel incelme ve selülit tedavisi.',
    description: 'Yürüyüş yaparken vakum teknolojisi ile kan dolaşımını hızlandırın, bölgesel yağlardan kurtulun ve selülit görünümünü azaltın.',
    benefits: ['Bölgesel incelme', 'Selülit görünümünde azalma', 'Kan dolaşımı hızlandırma', 'Hızlı kalori yakımı'],
    imageUrl: 'https://images.unsplash.com/photo-1574680093662-425eb33d596c?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 4,
    title: 'G5 Selülit Masajı',
    slug: 'g5-selulit-masaji',
    shortDescription: 'Titreşimli masaj ile pürüzsüz bir cilt.',
    description: 'G5 masajı ile kan dolaşımını hızlandırın, ödem atın ve selülitli bölgelerde gözle görülür bir düzelme sağlayın.',
    benefits: ['Selülit tedavisi', 'Ödem atma', 'Cilt sıkılaştırma', 'Kan dolaşımı artışı'],
    imageUrl: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=1200'
  }
];

export const galleryItems = [
  { id: 1, url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800', category: 'Stüdyo' },
  { id: 2, url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800', category: 'Stüdyo' },
  { id: 3, url: 'https://images.unsplash.com/photo-1574680093662-425eb33d596c?auto=format&fit=crop&q=80&w=800', category: 'Atmosfer' },
  { id: 4, url: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=800', category: 'Ekipmanlar' },
  { id: 5, url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800', category: 'Ekipmanlar' },
  { id: 6, url: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&q=80&w=800', category: 'Atmosfer' },
];

export const reservations = [
  { id: 1, name: 'Ayşe Yılmaz', phone: '05551234567', service: 'Reformer Pilates', message: 'Hafta sonu sabah saatleri uygun olur.', status: 'Yeni', date: '2023-10-25' },
  { id: 2, name: 'Fatma Demir', phone: '05559876543', service: 'Vacu Active', message: 'Bilgi almak istiyorum.', status: 'Arandı', date: '2023-10-24' },
  { id: 3, name: 'Zeynep Kaya', phone: '05554567890', service: 'G5 Selülit Masajı', message: '', status: 'Randevuya Dönüştü', date: '2023-10-23' },
];

export const testimonials = [
  { id: 1, name: 'Büşra S.', comment: 'Viva Studio ile duruşum düzeldi, sırt ağrılarım geçti. Harika bir ortam.', service: 'Reformer Pilates' },
  { id: 2, name: 'Ceren K.', comment: 'G5 masajı sonrası cildimdeki fark inanılmaz. Çok temiz ve ilgili bir stüdyo.', service: 'G5 Masajı' },
  { id: 3, name: 'Elif M.', comment: 'EMS antrenmanları sayesinde kısa sürede sıkılaştım. Eğitmenler çok profesyonel.', service: 'EMS Antrenmanı' }
];

export const companyInfo = {
  name: 'Viva Studio',
  phone: '0536 526 69 36',
  whatsapp: '905365266936',
  email: 'info@vivastudio.com.tr',
  address: 'Postane, Nazan Sk, 34940 Tuzla/İstanbul',
  hours: 'Pzt-Cts: 08:00 - 21:00, Pzr: 09:00 - 18:00',
  instagram: 'https://instagram.com/vivastudio',
}
