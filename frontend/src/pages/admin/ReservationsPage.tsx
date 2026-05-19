import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';

const ReservationsPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRes, setSelectedRes] = useState<any | null>(null);
  const [modalNote, setModalNote] = useState('');
  const [modalStatus, setModalStatus] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [message, setMessage] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([
      apiClient.get('/reservations/list.php').catch(() => []),
      apiClient.get('/services/list.php').catch(() => [])
    ]).then(([resList, servList]) => {
      setData(Array.isArray(resList) ? resList : (resList?.data || []));
      setServices(Array.isArray(servList) ? servList : (servList?.data || []));
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNoteModal = (res: any) => {
    setSelectedRes(res);
    setModalNote(res.admin_note || '');
    setModalStatus(res.status || 'Yeni');
    setMessage('');
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRes) return;
    setSavingNote(true);
    setMessage('');
    try {
      await apiClient.post('/reservations/update-status.php', {
        id: selectedRes.id,
        status: modalStatus,
        admin_note: modalNote
      });
      setSelectedRes(null);
      loadData();
    } catch (err: any) {
      setMessage('Hata: ' + err.message);
    } finally {
      setSavingNote(false);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-charcoal font-serif">Rezervasyon Talepleri</h1>
      </div>

      <div className="bg-warm-white rounded-2xl shadow-soft border border-border-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-soft text-charcoal/70 text-sm bg-warm-white">
                <th className="py-4 px-6 font-medium">Tarih</th>
                <th className="py-4 px-6 font-medium">Ad Soyad</th>
                <th className="py-4 px-6 font-medium">İletişim</th>
                <th className="py-4 px-6 font-medium">Hizmet</th>
                <th className="py-4 px-6 font-medium">Mesaj</th>
                <th className="py-4 px-6 font-medium">Yönetici Notu</th>
                <th className="py-4 px-6 font-medium">Durum</th>
                <th className="py-4 px-6 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {data.map((res: any) => (
                <tr key={res.id} className="border-b border-border-soft last:border-0 hover:bg-cream/30 transition-colors">
                  <td className="py-4 px-6 text-charcoal/60 text-xs whitespace-nowrap">
                    {res.created_at ? new Date(res.created_at).toLocaleDateString('tr-TR') : '-'}
                  </td>
                  <td className="py-4 px-6 text-charcoal font-medium whitespace-nowrap">{res.full_name}</td>
                  <td className="py-4 px-6 text-charcoal/80 whitespace-nowrap">{res.phone}</td>
                  <td className="py-4 px-6 text-charcoal/80 whitespace-nowrap font-medium text-sage-dark">
                    {services.find((s: any) => String(s.id) === String(res.service_id))?.title || 'Genel İletişim / Rezervasyon'}
                  </td>
                  <td className="py-4 px-6 text-charcoal/60 text-sm max-w-[150px] truncate" title={res.message}>{res.message || '-'}</td>
                  <td className="py-4 px-6 text-charcoal/60 text-sm max-w-[150px] truncate italic" title={res.admin_note}>{res.admin_note || '-'}</td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                      res.status === 'Yeni' ? 'bg-danger/10 text-danger' : 
                      res.status === 'Arandı' ? 'bg-warning/20 text-warning-dark' : 
                      res.status === 'İptal' ? 'bg-charcoal/10 text-charcoal' :
                      'bg-sage/20 text-sage-dark'
                    }`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap space-x-2">
                    <button onClick={() => openNoteModal(res)} className="text-sage hover:bg-sage/10 px-3 py-1.5 rounded-lg transition-colors font-medium text-sm">
                      Detay / Not Yaz
                    </button>
                    <button onClick={() => deleteReservation(res.id)} className="text-danger hover:bg-danger/10 px-3 py-1.5 rounded-lg transition-colors font-medium text-sm">
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-charcoal/60">Kayıt bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note / Edit Modal */}
      {selectedRes && (
        <div className="fixed inset-0 bg-charcoal/50 flex items-center justify-center z-50 p-4">
          <div className="bg-warm-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-charcoal font-serif">Rezervasyon Detayı & Yönetici Notu</h3>
            {message && <div className="mb-4 text-sm p-3 rounded bg-danger/10 text-danger">{message}</div>}
            
            <div className="space-y-3 mb-6 text-sm">
              <div>
                <span className="font-semibold text-charcoal/70">Müşteri:</span> {selectedRes.full_name}
              </div>
              <div>
                <span className="font-semibold text-charcoal/70">Telefon:</span> {selectedRes.phone}
              </div>
              <div>
                <span className="font-semibold text-charcoal/70">Hizmet:</span> {
                  services.find((s: any) => String(s.id) === String(selectedRes.service_id))?.title || 'Genel İletişim'
                }
              </div>
              <div>
                <span className="font-semibold text-charcoal/70">Müşteri Mesajı:</span> 
                <p className="mt-1 bg-cream/50 p-3 rounded-lg border border-border-soft italic text-charcoal/80">
                  {selectedRes.message || 'Mesaj bırakılmadı.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Durum Güncelle</label>
                <select 
                  value={modalStatus} 
                  onChange={e => setModalStatus(e.target.value)} 
                  className="w-full px-3 py-2 border border-border-soft rounded-xl bg-white focus:ring-2 focus:ring-sage"
                >
                  <option value="Yeni">Yeni</option>
                  <option value="Arandı">Arandı</option>
                  <option value="Randevuya Dönüştü">Randevuya Dönüştü</option>
                  <option value="İptal">İptal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Eğitmen / Yönetici Notu</label>
                <textarea 
                  value={modalNote} 
                  onChange={e => setModalNote(e.target.value)} 
                  rows={4} 
                  className="w-full px-3 py-2 border border-border-soft rounded-xl focus:ring-2 focus:ring-sage outline-none resize-none"
                  placeholder="Seans saatleri, özel istekler veya görüşme detaylarını buraya not alabilirsiniz."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => setSelectedRes(null)} className="px-4 py-2 text-charcoal hover:bg-black/5 rounded-xl">İptal</button>
                <button type="submit" disabled={savingNote} className="px-4 py-2 bg-sage text-white rounded-xl hover:bg-sage-dark disabled:opacity-50">
                  {savingNote ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationsPage;
