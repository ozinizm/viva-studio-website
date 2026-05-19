import React, { useState } from 'react';

import SEO from '../../components/common/SEO';
import { companyInfo, services } from '../../data/mockData';
import { getWhatsAppUrl, trackWhatsAppClick, trackReservationFormSubmit } from '../../services/trackingService';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    message: '',
    kvkk: false
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend validation is required by HTML5 attributes anyway.
    trackReservationFormSubmit();
    setSubmitted(true);
    // In future, call the API here.
  };

  return (
    <>
      <SEO title="İletişim & Rezervasyon | Viva Studio" description="Tuzla Viva Studio ile iletişime geçin. Reformer pilates ve diğer hizmetlerimiz için randevu talebi oluşturun." />
      
      <div className="bg-sage-light py-16 border-b border-border-soft">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-sage-dark mb-4">İletişim & Rezervasyon</h1>
          <p className="text-lg text-charcoal/80 max-w-2xl mx-auto">Sorularınız veya randevu talepleriniz için bizimle iletişime geçin.</p>
        </div>
      </div>

      <div className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 max-w-6xl mx-auto">
            
            {/* Contact Info */}
            <div className="w-full lg:w-1/3">
              <h2 className="text-2xl font-bold text-sage-dark mb-8">İletişim Bilgileri</h2>
              
              <div className="space-y-6">
                <div className="bg-warm-white p-6 rounded-2xl shadow-soft border border-border-soft flex items-start">
                  <div className="bg-sage/10 p-3 rounded-lg text-sage mr-4 shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-charcoal mb-1">Adres</h4>
                    <p className="text-charcoal/70 text-sm">{companyInfo.address}</p>
                  </div>
                </div>

                <div className="bg-warm-white p-6 rounded-2xl shadow-soft border border-border-soft flex items-start">
                  <div className="bg-sage/10 p-3 rounded-lg text-sage mr-4 shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-charcoal mb-1">Telefon / WhatsApp</h4>
                    <a href={getWhatsAppUrl()} onClick={() => trackWhatsAppClick('contact_page')} target="_blank" rel="noreferrer" className="text-sage font-medium hover:underline block mb-1">{companyInfo.phone}</a>
                    <a href={`tel:${companyInfo.phone.replace(/\s+/g, '')}`} className="text-charcoal/70 text-sm hover:text-sage transition-colors">Hemen Ara</a>
                  </div>
                </div>

                <div className="bg-warm-white p-6 rounded-2xl shadow-soft border border-border-soft flex items-start">
                  <div className="bg-sage/10 p-3 rounded-lg text-sage mr-4 shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-charcoal mb-1">Çalışma Saatleri</h4>
                    <p className="text-charcoal/70 text-sm">{companyInfo.hours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="w-full lg:w-2/3">
              <div className="bg-warm-white p-8 md:p-10 rounded-[32px] shadow-soft border border-border-soft">
                <h2 className="text-2xl font-bold text-sage-dark mb-6">Randevu Talebi Oluştur</h2>
                
                {submitted ? (
                  <div className="bg-sage-light text-sage-dark p-6 rounded-2xl text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <h3 className="text-xl font-bold mb-2">Talebiniz Alındı</h3>
                    <p>En kısa sürede sizinle iletişime geçeceğiz. Teşekkür ederiz.</p>
                    <button onClick={() => setSubmitted(false)} className="mt-6 text-sage font-medium hover:underline">Yeni bir talep oluştur</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-2">Ad Soyad *</label>
                        <input 
                          type="text" 
                          id="name" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-border-soft bg-cream focus:bg-warm-white focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage transition-colors"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-charcoal mb-2">Telefon Numarası *</label>
                        <input 
                          type="tel" 
                          id="phone" 
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-border-soft bg-cream focus:bg-warm-white focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage transition-colors"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-charcoal mb-2">İlgilendiğiniz Hizmet *</label>
                      <select 
                        id="service" 
                        required
                        value={formData.service}
                        onChange={(e) => setFormData({...formData, service: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-border-soft bg-cream focus:bg-warm-white focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage transition-colors"
                      >
                        <option value="">Lütfen seçin</option>
                        {services.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                        <option value="Diğer/Genel Bilgi">Diğer / Genel Bilgi</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-charcoal mb-2">Mesajınız (İsteğe Bağlı)</label>
                      <textarea 
                        id="message" 
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-border-soft bg-cream focus:bg-warm-white focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage transition-colors resize-none"
                      ></textarea>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input 
                          id="kvkk" 
                          type="checkbox" 
                          required
                          checked={formData.kvkk}
                          onChange={(e) => setFormData({...formData, kvkk: e.target.checked})}
                          className="w-4 h-4 text-sage bg-cream border-border-soft rounded focus:ring-sage"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="kvkk" className="text-charcoal/70">
                          <a href="/kvkk" target="_blank" className="text-sage hover:underline">KVKK Aydınlatma Metni</a>'ni okudum ve kabul ediyorum. *
                        </label>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-sage text-warm-white py-4 rounded-xl hover:bg-sage-dark transition-all font-bold text-lg shadow-soft"
                    >
                      Randevu Talebi Gönder
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
