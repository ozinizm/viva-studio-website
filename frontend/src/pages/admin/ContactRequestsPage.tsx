import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiClient } from '../../services/apiClient';

interface ContactRequest {
  id: number;
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message?: string;
  status: 'new' | 'contacted' | 'converted' | 'closed';
  created_at: string;
  notes?: string;
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'Yeni', color: 'bg-primary/10 text-primary' },
  { value: 'contacted', label: 'Arandı', color: 'bg-warning/10 text-warning' },
  { value: 'converted', label: 'Randevuya Döndü', color: 'bg-success/10 text-success' },
  { value: 'closed', label: 'Kapatıldı', color: 'bg-sage text-muted' },
];

const getStatusStyle = (status: string) => {
  return STATUS_OPTIONS.find(s => s.value === status)?.color || 'bg-sage text-muted';
};

const getStatusLabel = (status: string) => {
  return STATUS_OPTIONS.find(s => s.value === status)?.label || status;
};

function getWaUrl(phone: string, name: string) {
  const clean = phone.replace(/\D/g, '');
  const num = clean.startsWith('90') ? clean : `90${clean}`;
  return `https://wa.me/${num}?text=${encodeURIComponent(`Merhaba ${name}, Viva Studio'dan arıyoruz.`)}`;
}

const ContactRequestsPage = () => {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/contact/list.php');
      const list = Array.isArray(data) ? data : (data?.data || []);
      setRequests(list);
    } catch {
      // If API not ready, show empty state
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      await apiClient.post('/contact/update.php', { id, status });
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: status as any } : r));
      if (selectedRequest?.id === id) {
        setSelectedRequest(prev => prev ? { ...prev, status: status as any } : null);
      }
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const saveNotes = async (id: number) => {
    setUpdatingId(id);
    try {
      await apiClient.post('/contact/update.php', { id, notes });
      setRequests(prev => prev.map(r => r.id === id ? { ...r, notes } : r));
    } catch (err) {
      console.error('Notes save failed:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteRequest = async (id: number) => {
    if (!confirm('Bu talebi silmek istediğinizden emin misiniz?')) return;
    try {
      await apiClient.delete('/contact/delete.php', { id });
      setRequests(prev => prev.filter(r => r.id !== id));
      if (selectedRequest?.id === id) setSelectedRequest(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const filtered = selectedFilter === 'all'
    ? requests
    : requests.filter(r => r.status === selectedFilter);

  const stats = {
    all: requests.length,
    new: requests.filter(r => r.status === 'new').length,
    contacted: requests.filter(r => r.status === 'contacted').length,
    converted: requests.filter(r => r.status === 'converted').length,
  };

  const formatDate = (dt: string) => {
    if (!dt) return '';
    try {
      return new Date(dt).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return dt; }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">İletişim Talepleri</h1>
          <p className="text-muted text-sm mt-1">Form başvurularını yönetin.</p>
        </div>
        <button onClick={loadRequests} className="btn-secondary text-sm py-2 px-4">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          Yenile
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Toplam', count: stats.all, color: 'text-text-dark', filter: 'all' },
          { label: 'Yeni', count: stats.new, color: 'text-primary', filter: 'new' },
          { label: 'Arandı', count: stats.contacted, color: 'text-warning', filter: 'contacted' },
          { label: 'Dönüştü', count: stats.converted, color: 'text-success', filter: 'converted' },
        ].map(stat => (
          <button
            key={stat.filter}
            onClick={() => setSelectedFilter(stat.filter)}
            className={`p-5 rounded-2xl text-left transition-all ${
              selectedFilter === stat.filter
                ? 'bg-primary text-white shadow-glow'
                : 'bg-white shadow-card hover:shadow-premium hover:-translate-y-0.5'
            }`}
          >
            <p className={`text-3xl font-bold mb-1 ${selectedFilter === stat.filter ? 'text-white' : stat.color}`}>
              {stat.count}
            </p>
            <p className={`text-sm ${selectedFilter === stat.filter ? 'text-white/80' : 'text-muted'}`}>
              {stat.label}
            </p>
          </button>
        ))}
      </div>

      {/* Main Content: Table + Detail */}
      <div className="flex gap-6">
        {/* List */}
        <div className={`flex-1 bg-white rounded-3xl shadow-card overflow-hidden ${selectedRequest ? 'hidden lg:block lg:w-1/2' : ''}`}>
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton h-16 rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-muted">Henüz iletişim talebi yok.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ad Soyad</th>
                    <th>Telefon</th>
                    <th className="hidden md:table-cell">Hizmet</th>
                    <th>Durum</th>
                    <th className="hidden lg:table-cell">Tarih</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((req) => (
                    <motion.tr
                      key={req.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`cursor-pointer ${selectedRequest?.id === req.id ? 'bg-mint/30' : ''}`}
                      onClick={() => { setSelectedRequest(req); setNotes(req.notes || ''); }}
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                            {req.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-text-dark">{req.name}</p>
                            {req.email && <p className="text-xs text-muted">{req.email}</p>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <a href={`tel:${req.phone}`} className="text-primary font-medium hover:underline" onClick={e => e.stopPropagation()}>
                          {req.phone}
                        </a>
                      </td>
                      <td className="hidden md:table-cell text-muted">{req.service || '—'}</td>
                      <td>
                        <span className={`badge ${getStatusStyle(req.status)}`}>
                          {getStatusLabel(req.status)}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell text-muted text-xs">{formatDate(req.created_at)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <a
                            href={getWaUrl(req.phone, req.name)}
                            target="_blank"
                            rel="noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white transition-colors"
                            style={{ background: '#25D366' }}
                            title="WhatsApp"
                          >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                            </svg>
                          </a>
                          <button
                            onClick={e => { e.stopPropagation(); deleteRequest(req.id); }}
                            className="w-7 h-7 rounded-lg bg-danger/10 hover:bg-danger/20 flex items-center justify-center text-danger transition-colors"
                            title="Sil"
                          >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-96 bg-white rounded-3xl shadow-card p-6 space-y-5 shrink-0 self-start"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-text-dark">Talep Detayı</h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="w-8 h-8 rounded-xl hover:bg-sage flex items-center justify-center text-muted"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-ivory rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {selectedRequest.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-text-dark">{selectedRequest.name}</p>
                  <p className="text-xs text-muted">{formatDate(selectedRequest.created_at)}</p>
                </div>
              </div>

              {[
                { label: 'Telefon', value: selectedRequest.phone, href: `tel:${selectedRequest.phone}` },
                { label: 'E-posta', value: selectedRequest.email, href: `mailto:${selectedRequest.email}` },
                { label: 'Hizmet', value: selectedRequest.service },
                { label: 'Mesaj', value: selectedRequest.message },
              ].filter(f => f.value).map(field => (
                <div key={field.label} className="p-3 bg-ivory rounded-xl">
                  <p className="text-xs font-semibold text-muted mb-1">{field.label}</p>
                  {field.href ? (
                    <a href={field.href} className="text-primary font-medium text-sm hover:underline">{field.value}</a>
                  ) : (
                    <p className="text-sm text-text-dark">{field.value}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Status */}
            <div>
              <p className="form-label">Durum Güncelle</p>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => updateStatus(selectedRequest.id, opt.value)}
                    disabled={updatingId === selectedRequest.id}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      selectedRequest.status === opt.value
                        ? 'ring-2 ring-primary bg-primary text-white'
                        : `${opt.color} hover:ring-1 hover:ring-primary/30`
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <p className="form-label">Notlar</p>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="Dahili not ekleyin..."
                className="form-textarea text-sm"
              />
              <button
                onClick={() => saveNotes(selectedRequest.id)}
                disabled={updatingId === selectedRequest.id}
                className="btn-primary w-full mt-2 py-2 text-sm"
              >
                {updatingId === selectedRequest.id ? 'Kaydediliyor...' : 'Notu Kaydet'}
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 pt-2 border-t border-sage/30">
              <a
                href={getWaUrl(selectedRequest.phone, selectedRequest.name)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-white transition-colors"
                style={{ background: '#25D366' }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                </svg>
                WhatsApp
              </a>
              <a
                href={`tel:${selectedRequest.phone}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-forest text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                Ara
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ContactRequestsPage;
