import React, { useState } from 'react';

import { reservations } from '../../data/mockData';

const ReservationsPage = () => {
  const [data, setData] = useState(reservations);

  const updateStatus = (id: number, newStatus: string) => {
    setData(data.map((res: any) => res.id === id ? { ...res, status: newStatus } : res));
  };

  const deleteReservation = (id: number) => {
    if(window.confirm('Bu kaydı silmek istediğinize emin misiniz?')) {
      setData(data.filter((res: any) => res.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-charcoal">Rezervasyon Talepleri</h1>
        <button className="bg-sage text-warm-white px-4 py-2 rounded-xl font-medium hover:bg-sage-dark transition-colors text-sm">
          Dışa Aktar
        </button>
      </div>

      <div className="bg-warm-white rounded-2xl shadow-soft border border-border-soft overflow-hidden">
        <div className="p-4 border-b border-border-soft bg-cream/50 flex gap-4">
          <input 
            type="text" 
            placeholder="İsim veya telefon ara..." 
            className="px-4 py-2 rounded-lg border border-border-soft bg-warm-white focus:outline-none focus:border-sage text-sm w-64"
          />
          <select className="px-4 py-2 rounded-lg border border-border-soft bg-warm-white focus:outline-none focus:border-sage text-sm">
            <option value="">Tüm Durumlar</option>
            <option value="Yeni">Yeni</option>
            <option value="Arandı">Arandı</option>
            <option value="Randevuya Dönüştü">Randevuya Dönüştü</option>
            <option value="İptal">İptal</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-soft text-charcoal/70 text-sm bg-warm-white">
                <th className="py-4 px-6 font-medium">Ad Soyad</th>
                <th className="py-4 px-6 font-medium">İletişim</th>
                <th className="py-4 px-6 font-medium">Hizmet</th>
                <th className="py-4 px-6 font-medium">Mesaj</th>
                <th className="py-4 px-6 font-medium">Durum</th>
                <th className="py-4 px-6 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {data.map((res: any) => (
                <tr key={res.id} className="border-b border-border-soft last:border-0 hover:bg-cream/30 transition-colors">
                  <td className="py-4 px-6 text-charcoal font-medium whitespace-nowrap">{res.name}</td>
                  <td className="py-4 px-6 text-charcoal/80 whitespace-nowrap">{res.phone}</td>
                  <td className="py-4 px-6 text-charcoal/80 whitespace-nowrap">{res.service}</td>
                  <td className="py-4 px-6 text-charcoal/60 text-sm max-w-[200px] truncate">{res.message || '-'}</td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <select 
                      value={res.status}
                      onChange={(e) => updateStatus(res.id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full outline-none border-0 cursor-pointer ${
                        res.status === 'Yeni' ? 'bg-danger/10 text-danger' : 
                        res.status === 'Arandı' ? 'bg-warning/10 text-warning' : 
                        res.status === 'İptal' ? 'bg-charcoal/10 text-charcoal' :
                        'bg-sage-light text-sage-dark'
                      }`}
                    >
                      <option value="Yeni">Yeni</option>
                      <option value="Arandı">Arandı</option>
                      <option value="Randevuya Dönüştü">Randevuya Dönüştü</option>
                      <option value="İptal">İptal</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <button onClick={() => deleteReservation(res.id)} className="text-danger hover:bg-danger/10 p-2 rounded-lg transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-charcoal/60">Gösterilecek kayıt bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReservationsPage;
