import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';

const ReservationsPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    apiClient.get('/reservations/list.php')
      .then(res => setData(res || []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await apiClient.post('/reservations/update-status.php', { id, status: newStatus });
      loadData();
    } catch (e: any) {
      alert('Hata: ' + e.message);
    }
  };

  const deleteReservation = async (id: number) => {
    if(window.confirm('Bu kaydı silmek istediğinize emin misiniz?')) {
      try {
        await apiClient.post('/reservations/delete.php', { id });
        loadData();
      } catch (e: any) {
        alert('Hata: ' + e.message);
      }
    }
  };

  if (loading) return <div className="p-6">Yükleniyor...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-charcoal">Rezervasyon Talepleri</h1>
      </div>

      <div className="bg-warm-white rounded-2xl shadow-soft border border-border-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-soft text-charcoal/70 text-sm bg-warm-white">
                <th className="py-4 px-6 font-medium">Ad Soyad</th>
                <th className="py-4 px-6 font-medium">İletişim</th>
                <th className="py-4 px-6 font-medium">Hizmet ID</th>
                <th className="py-4 px-6 font-medium">Mesaj</th>
                <th className="py-4 px-6 font-medium">Durum</th>
                <th className="py-4 px-6 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {data.map((res: any) => (
                <tr key={res.id} className="border-b border-border-soft last:border-0 hover:bg-cream/30 transition-colors">
                  <td className="py-4 px-6 text-charcoal font-medium whitespace-nowrap">{res.full_name}</td>
                  <td className="py-4 px-6 text-charcoal/80 whitespace-nowrap">{res.phone}</td>
                  <td className="py-4 px-6 text-charcoal/80 whitespace-nowrap">{res.service_id || '-'}</td>
                  <td className="py-4 px-6 text-charcoal/60 text-sm max-w-[200px] truncate" title={res.message}>{res.message || '-'}</td>
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
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-charcoal/60">Kayıt bulunamadı.</td>
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
