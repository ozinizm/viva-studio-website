import { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [recentReservations, setRecentReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get('/reservations/list.php').catch(() => []),
      apiClient.get('/services/list.php').catch(() => []),
      apiClient.get('/gallery/list.php').catch(() => [])
    ]).then(([resList, servList, gallList]) => {
      const reservations = Array.isArray(resList) ? resList : (resList?.data || []);
      const services = Array.isArray(servList) ? servList : (servList?.data || []);
      const gallery = Array.isArray(gallList) ? gallList : (gallList?.data || []);

      const newResCount = reservations.filter((r: any) => r.status === 'Yeni').length;
      const activeServices = services.filter((s: any) => String(s.is_active) === '1' || s.is_active === true).length;
      const galleryCount = gallery.length;

      setStats([
        { label: 'Yeni Rezervasyonlar', value: newResCount, color: 'bg-sage-light text-sage-dark' },
        { label: 'Aktif Hizmetler', value: activeServices, color: 'bg-cream text-charcoal' },
        { label: 'Galeri Öğeleri', value: galleryCount, color: 'bg-cream text-charcoal' },
        { label: 'Toplam Rezervasyon', value: reservations.length, color: 'bg-cream text-charcoal' },
      ]);

      setRecentReservations(reservations.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-charcoal mb-8">Dashboard</h1>
      
      {loading ? (
        <div className="text-charcoal/60">Yükleniyor...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className={`p-6 rounded-2xl border border-border-soft shadow-soft ${stat.color}`}>
                <p className="text-sm font-medium mb-2 opacity-80">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-warm-white rounded-2xl shadow-soft border border-border-soft p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-charcoal">Son Rezervasyon Talepleri</h2>
              <Link to="/admin/reservations" className="text-sage text-sm font-medium hover:underline">Tümünü Gör</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-soft text-charcoal/70 text-sm">
                    <th className="py-3 px-4 font-medium">Ad Soyad</th>
                    <th className="py-3 px-4 font-medium">Telefon</th>
                    <th className="py-3 px-4 font-medium">Tarih</th>
                    <th className="py-3 px-4 font-medium">Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReservations.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-charcoal/50">Yeni rezervasyon talebi bulunamadı.</td>
                    </tr>
                  ) : (
                    recentReservations.map(res => (
                      <tr key={res.id} className="border-b border-border-soft last:border-0 hover:bg-cream/50 transition-colors">
                        <td className="py-4 px-4 text-charcoal font-medium">{res.full_name}</td>
                        <td className="py-4 px-4 text-charcoal/80">{res.phone}</td>
                        <td className="py-4 px-4 text-charcoal/80">{res.created_at ? new Date(res.created_at).toLocaleDateString('tr-TR') : '-'}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            res.status === 'Yeni' ? 'bg-danger/10 text-danger' : 
                            res.status === 'Arandı' ? 'bg-warning/10 text-warning' : 
                            'bg-sage-light text-sage-dark'
                          }`}>
                            {res.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
