import { companyInfo } from '../data/mockData';

export const trackWhatsAppClick = (source: string) => {
  console.log(`[Tracking] WhatsApp Clicked from: ${source}`);
  // In the future, this will connect to GA4/GTM
  // window.gtag('event', 'whatsapp_click', { source });
};

export const getWhatsAppUrl = (text: string = "Merhaba Viva Studio, bilgi almak istiyorum.") => {
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${companyInfo.whatsapp}?text=${encodedText}`;
};

export const trackReservationFormSubmit = () => {
  console.log(`[Tracking] Reservation Form Submitted`);
};
