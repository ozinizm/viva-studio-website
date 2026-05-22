import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../../components/common/SEO';

const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('expired') === 'true') {
      setError('Oturum süresi doldu, lütfen tekrar giriş yapın.');
    }

    if (sessionStorage.getItem('viva_admin_token')) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // First try real API
      const response = await fetch(`${API_BASE_URL}/auth/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('viva_admin_token', data.token);
        navigate('/admin/dashboard', { replace: true });
        return;
      } else {
        const errData = await response.json().catch(() => ({}));
        setError(errData.message || 'Geçersiz e-posta veya şifre.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.');
    }
  };

  return (
    <div className="min-h-screen bg-sage-light flex items-center justify-center p-4">
      <SEO title="Viva Studio | Admin Login" noIndex={true} />
      
      <div className="bg-warm-white p-8 md:p-10 rounded-2xl shadow-soft w-full max-w-md border border-border-soft">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-sage-dark font-bold mb-2">Viva Admin</h1>
          <p className="text-charcoal/70">Yönetim paneline erişmek için giriş yapın.</p>
        </div>
        
        {error && (
          <div className="bg-danger/10 text-danger px-4 py-3 rounded-lg mb-6 text-sm border border-danger/20">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-charcoal font-medium mb-2 text-sm" htmlFor="email">
              E-posta Adresi
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none transition-all"
              placeholder="admin@vivastudio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-charcoal font-medium mb-2 text-sm" htmlFor="password">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-sage text-warm-white font-bold py-3 px-4 rounded-xl hover:bg-sage-dark transition-colors shadow-sm"
          >
            Giriş Yap
          </button>
        </form>
        
        <div className="mt-8 text-center text-xs text-charcoal/50">
          <p>&copy; {new Date().getFullYear()} Viva Studio. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
