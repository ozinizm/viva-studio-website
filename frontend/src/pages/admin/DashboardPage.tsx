
import { reservations, services, galleryItems } from '../../data/mockData';

const DashboardPage = () => {
  const stats = [
    { label: 'Yeni Rezervasyonlar', value: reservations.filter(r => r.status === 'Yeni').length, color: 'bg-sage-light text-sage-dark' },
    { label: 'Aktif Hizmetler', value: services.length, color: 'bg-cream text-charcoal' },
    { label: 'Galeri Öğeleri', value: galleryItems.length, color: 'bg-cream text-charcoal' },
    { label: 'Toplam Görüntülenme', value: '1.2k', color: 'bg-cream text-charcoal' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-charcoal mb-8">Dashboard</h1>
      
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
          <a href="/admin/reservations" className="text-sage text-sm font-medium hover:underline">Tümünü Gör</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-soft text-charcoal/70 text-sm">
                <th className="py-3 px-4 font-medium">Ad Soyad</th>
                <th className="py-3 px-4 font-medium">Hizmet</th>
                <th className="py-3 px-4 font-medium">Tarih</th>
                <th className="py-3 px-4 font-medium">Durum</th>
              </tr>
            </thead>
            <tbody>
              {reservations.slice(0, 3).map(res => (
                <tr key={res.id} className="border-b border-border-soft last:border-0 hover:bg-cream/50 transition-colors">
                  <td className="py-4 px-4 text-charcoal font-medium">{res.name}</td>
                  <td className="py-4 px-4 text-charcoal/80">{res.service}</td>
                  <td className="py-4 px-4 text-charcoal/80">{res.date}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
