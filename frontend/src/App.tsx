
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import ServicesPage from './pages/public/ServicesPage';
import ServiceDetailPage from './pages/public/ServiceDetailPage';
import GalleryPage from './pages/public/GalleryPage';
import ContactPage from './pages/public/ContactPage';
import LegalPage from './pages/public/LegalPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import ReservationsPage from './pages/admin/ReservationsPage';
import PlaceholderAdminPage from './pages/admin/PlaceholderAdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="hizmetler" element={<ServicesPage />} />
          <Route path="hizmetler/:slug" element={<ServiceDetailPage />} />
          <Route path="galeri" element={<GalleryPage />} />
          <Route path="iletisim" element={<ContactPage />} />
          <Route path="rezervasyon" element={<Navigate to="/iletisim" replace />} />
          <Route path="kvkk" element={<LegalPage title="KVKK Aydınlatma Metni" />} />
          <Route path="gizlilik-politikasi" element={<LegalPage title="Gizlilik Politikası" />} />
          <Route path="cerez-politikasi" element={<LegalPage title="Çerez Politikası" />} />
          <Route path="blog" element={<PlaceholderAdminPage title="Blog" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="reservations" element={<ReservationsPage />} />
          <Route path="services" element={<PlaceholderAdminPage title="Hizmet Yönetimi" />} />
          <Route path="gallery" element={<PlaceholderAdminPage title="Galeri Yönetimi" />} />
          <Route path="blog" element={<PlaceholderAdminPage title="Blog Yönetimi" />} />
          <Route path="settings" element={<PlaceholderAdminPage title="Site Ayarları" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
