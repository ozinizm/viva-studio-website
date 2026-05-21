import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiClient } from '../../services/apiClient';

const DashboardPage = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get('/contact/list.php').catch(() => []),
      apiClient.get('/services/list.php').catch(() => []),
      apiClient.get('/gallery/list.php').catch(() => [])
    ]).then(([reqList, servList, gallList]) => {
      const requests = Array.isArray(reqList) ? reqList : (reqList?.data || []);
      const services = Array.isArray(servList) ? servList : (servList?.data || []);
      const gallery = Array.isArray(gallList) ? gallList : (gallList?.data || []);

      const newReqCount = requests.filter((r: any) => r.status === 'new').length;
      const activeServices = services.filter((s: any) => String(s.is_active) === '1' || s.is_active === true).length;
      const galleryCount = gallery.length;

      setStats([
        { label: 'Yeni İletişim Talebi', value: newReqCount, color: 'text-primary' },
        { label: 'Aktif Hizmetler', value: activeServices, color: 'text-text-dark' },
        { label: 'Galeri Öğeleri', value: galleryCount, color: 'text-text-dark' },
        { label: 'Toplam Talep', value: requests.length, color: 'text-text-dark' },
      ]);

      setRecentRequests(requests.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32 rounded-3xl" />)}
        </div>
        <div className="skeleton h-64 rounded-3xl" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'new': return <span className="badge bg-primary/10 text-primary">Yeni</span>;
      case 'contacted': return <span className="badge bg-warning/10 text-warning">Arandı</span>;
      case 'converted': return <span className="badge bg-success/10 text-success">Dönüştü</span>;
      case 'closed': return <span className="badge bg-sage text-muted">Kapatıldı</span>;
      default: return <span className="badge bg-sage text-muted">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-dark">Dashboard</h1>
        <p className="text-muted text-sm mt-1">Viva Studio Tuzla yönetim paneline hoş geldiniz.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-card border border-sage/30"
          >
            <p className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">{stat.label}</p>
            <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-3xl shadow-card border border-sage/30 overflow-hidden"
      >
        <div className="p-6 border-b border-sage/30 flex justify-between items-center">
          <h2 className="text-lg font-bold text-text-dark">Son İletişim Talepleri</h2>
          <Link to="/admin/contact-requests" className="text-sm font-medium text-primary hover:underline">
            Tümünü Gör →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ad Soyad</th>
                <th>Telefon</th>
                <th className="hidden sm:table-cell">Hizmet</th>
                <th>Tarih</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted">
                    Henüz talep bulunmuyor.
                  </td>
                </tr>
              ) : (
                recentRequests.map(req => (
                  <tr key={req.id}>
                    <td className="font-medium text-text-dark">{req.name}</td>
                    <td><a href={`tel:${req.phone}`} className="hover:text-primary">{req.phone}</a></td>
                    <td className="hidden sm:table-cell text-muted">{req.service || '—'}</td>
                    <td className="text-muted text-sm">
                      {req.created_at ? new Date(req.created_at).toLocaleDateString('tr-TR') : '-'}
                    </td>
                    <td>{getStatusBadge(req.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
