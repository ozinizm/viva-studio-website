
import { Outlet, Link } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-cream">
      {/* Sidebar */}
      <aside className="w-64 bg-warm-white border-r border-border-soft flex flex-col">
        <div className="p-6 border-b border-border-soft">
          <Link to="/admin" className="text-2xl font-serif text-sage-dark font-bold">Viva Admin</Link>
        </div>
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          <Link to="/admin/dashboard" className="block px-4 py-3 rounded-xl text-charcoal hover:bg-sage-light hover:text-sage-dark transition-colors font-medium">Dashboard</Link>
          <Link to="/admin/reservations" className="block px-4 py-3 rounded-xl text-charcoal hover:bg-sage-light hover:text-sage-dark transition-colors font-medium">Rezervasyonlar</Link>
          <Link to="/admin/services" className="block px-4 py-3 rounded-xl text-charcoal hover:bg-sage-light hover:text-sage-dark transition-colors font-medium">Hizmetler</Link>
          <Link to="/admin/gallery" className="block px-4 py-3 rounded-xl text-charcoal hover:bg-sage-light hover:text-sage-dark transition-colors font-medium">Galeri</Link>
          <Link to="/admin/blog" className="block px-4 py-3 rounded-xl text-charcoal hover:bg-sage-light hover:text-sage-dark transition-colors font-medium">Blog</Link>
          <Link to="/admin/settings" className="block px-4 py-3 rounded-xl text-charcoal hover:bg-sage-light hover:text-sage-dark transition-colors font-medium">Ayarlar</Link>
        </nav>
        <div className="p-4 border-t border-border-soft">
          <button className="w-full text-left px-4 py-3 rounded-xl text-danger hover:bg-danger/10 transition-colors font-medium">Çıkış Yap</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
