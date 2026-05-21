import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../components/common/SEO';

const NotFoundPage = () => {
  return (
    <>
      <SEO title="404 — Sayfa Bulunamadı | Viva Studio Tuzla" noIndex />
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-ivory px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-8xl mb-8"
          >
            🧘
          </motion.div>
          <h1 className="text-[8rem] font-black leading-none text-gradient mb-2">404</h1>
          <h2 className="text-2xl font-bold text-text-dark mb-4">Sayfa Bulunamadı</h2>
          <p className="text-muted mb-10 max-w-sm mx-auto">
            Aradığınız sayfa mevcut değil ya da taşınmış olabilir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-gradient py-4 px-8">
              Ana Sayfaya Dön
            </Link>
            <Link to="/hizmetler" className="btn-secondary py-4 px-8">
              Hizmetlerimiz
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default NotFoundPage;
