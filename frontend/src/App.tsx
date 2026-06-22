import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ServicesPage from './pages/public/ServicesPage';
import ServiceDetailPage from './pages/public/ServiceDetailPage';
import GalleryPage from './pages/public/GalleryPage';
import ContactPage from './pages/public/ContactPage';
import LegalPage from './pages/public/LegalPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import HeroAdminPage from './pages/admin/HeroAdminPage';
import ServicesAdminPage from './pages/admin/ServicesAdminPage';
import GalleryAdminPage from './pages/admin/GalleryAdminPage';
import ContactRequestsPage from './pages/admin/ContactRequestsPage';
import SettingsPage from './pages/admin/SettingsPage';
import LoginPage from './pages/admin/LoginPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import ScrollToTop from './components/common/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="hakkimizda" element={<AboutPage />} />
          <Route path="hizmetler" element={<ServicesPage />} />
          <Route path="hizmetler/:slug" element={<ServiceDetailPage />} />
          <Route path="galeri" element={<GalleryPage />} />
          <Route path="iletisim" element={<ContactPage />} />
          <Route path="rezervasyon" element={<Navigate to="/iletisim" replace />} />
          <Route path="kvkk" element={<LegalPage title="KVKK Aydınlatma Metni" />} />
          <Route path="gizlilik-politikasi" element={<LegalPage title="Gizlilik Politikası" />} />
          <Route path="cerez-politikasi" element={<LegalPage title="Çerez Politikası" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Admin Routes (Protected) */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="hero" element={<HeroAdminPage />} />
            <Route path="services" element={<ServicesAdminPage />} />
            <Route path="gallery" element={<GalleryAdminPage />} />
            <Route path="contact-requests" element={<ContactRequestsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
