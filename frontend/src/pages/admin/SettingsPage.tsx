import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { apiClient } from '../../services/apiClient';
import { getMediaUrl, handleImageError } from '../../utils/mediaUrl';

export default function SettingsPage() {
    const [settings, setSettings] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [activeTab, setActiveTab] = useState('genel');

    useEffect(() => {
        apiClient.get('/settings/get.php')
            .then(res => setSettings(res?.data || res || {}))
            .catch(err => setMessage({ type: 'error', text: 'Hata: ' + err.message }))
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            await apiClient.post('/settings/update.php', settings);
            setMessage({ type: 'success', text: 'Ayarlar başarıyla kaydedildi.' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err: any) {
            setMessage({ type: 'error', text: 'Hata: ' + err.message });
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, type: 'image' | 'video' = 'image') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', type === 'video' ? 'videos' : 'settings');

        setMessage({ type: 'info', text: 'Dosya yükleniyor...' });
        try {
            const token = sessionStorage.getItem('viva_admin_token') || '';
            const res = await fetch('/api/settings/upload.php', {
                method: 'POST',
                headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: fd
            });
            const data = await res.json();
            if (res.ok && data.url) {
                setSettings((prev: any) => ({ ...prev, [fieldName]: data.url }));
                setMessage({ type: 'success', text: 'Dosya başarıyla yüklendi.' });
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            } else {
                setMessage({ type: 'error', text: 'Yükleme hatası: ' + (data.message || 'Başarısız') });
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: 'Hata: ' + err.message });
        }
    };

    const tabs = [
        { id: 'genel', label: 'Genel' },
        { id: 'hakkimizda', label: 'Hakkımızda' },
        { id: 'iletisim', label: 'İletişim' },
        { id: 'sosyal', label: 'Sosyal Medya' },
        { id: 'hero', label: 'Ana Sayfa' },
        { id: 'seo', label: 'SEO & Tracking' },
        { id: 'hukuki', label: 'Hukuki Metinler' }
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="skeleton h-8 w-48 rounded-xl" />
                <div className="skeleton h-12 w-full rounded-xl" />
                <div className="skeleton h-64 w-full rounded-3xl" />
            </div>
        );
    }

    const FileUploadInput = ({ label, name, accept = "image/*", type = "image" }: { label: string, name: string, accept?: string, type?: 'image'|'video' }) => {
        const inputRef = useRef<HTMLInputElement>(null);
        return (
            <div>
                <label className="form-label">{label}</label>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input name={name} value={settings[name] || ''} onChange={handleChange} className="form-input flex-1 font-mono text-sm" placeholder="/uploads/... veya https://..." />
                    <button type="button" onClick={() => inputRef.current?.click()} className="btn-secondary px-4 py-2 shrink-0">Dosya Seç</button>
                    <input ref={inputRef} type="file" accept={accept} onChange={(e) => handleFileUpload(e, name, type)} className="hidden" />
                </div>
                {settings[name] && type === 'image' && (
                    <img src={getMediaUrl(settings[name])} alt="Önizleme" className="mt-3 h-16 w-auto object-contain rounded-lg border border-sage/40" onError={handleImageError} />
                )}
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-dark">Site Ayarları</h1>
                    <p className="text-muted text-sm mt-1">Sitenizin genel yapılandırmasını yönetin.</p>
                </div>
                <button onClick={handleSubmit} disabled={saving} className="btn-primary text-sm py-2.5 px-6">
                    {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
            </div>
            
            {message.text && (
                <div className={`p-4 rounded-2xl border text-sm font-medium ${
                    message.type === 'error' ? 'bg-danger/10 border-danger/30 text-danger' :
                    message.type === 'success' ? 'bg-primary/10 border-primary/30 text-primary' :
                    'bg-sage/20 border-sage/40 text-text-dark'
                }`}>
                    {message.text}
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar border-b border-sage/30 pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            activeTab === tab.id
                                ? 'bg-primary text-white shadow-glow'
                                : 'bg-transparent text-muted hover:bg-mint hover:text-primary'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Form */}
            <div className="bg-white rounded-3xl p-6 shadow-card">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* GENEL */}
                    {activeTab === 'genel' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                            <div>
                                <label className="form-label">Site Adı</label>
                                <input name="site_name" value={settings.site_name || ''} onChange={handleChange} className="form-input" />
                            </div>
                            <FileUploadInput label="Logo Yükle" name="logo_url" />
                            <FileUploadInput label="Favicon Yükle" name="favicon_url" accept=".ico,image/png,image/svg+xml" />
                            <div>
                                <label className="form-label">Footer Metni</label>
                                <textarea name="footer_text" value={settings.footer_text || ''} onChange={handleChange} rows={2} className="form-textarea" />
                            </div>
                        </motion.div>
                    )}

                    {/* HAKKIMIZDA */}
                    {activeTab === 'hakkimizda' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                            <div>
                                <label className="form-label">Hakkımızda Başlık</label>
                                <input name="about_title" value={settings.about_title || ''} onChange={handleChange} className="form-input" placeholder="Tuzla'nın Premium Wellness Studio'su" />
                            </div>
                            <div>
                                <label className="form-label">Hakkımızda Metni</label>
                                <textarea name="about_content" value={settings.about_content || ''} onChange={handleChange} rows={6} className="form-textarea" placeholder="Biz kimiz? Neler yapıyoruz?" />
                            </div>
                            <FileUploadInput label="Hakkımızda Görseli" name="about_image_url" />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">SEO Başlık</label>
                                    <input name="about_seo_title" value={settings.about_seo_title || ''} onChange={handleChange} className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">SEO Açıklama</label>
                                    <input name="about_seo_description" value={settings.about_seo_description || ''} onChange={handleChange} className="form-input" />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* İLETİŞİM */}
                    {activeTab === 'iletisim' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="form-label">Telefon</label>
                                    <input name="phone" value={settings.phone || ''} onChange={handleChange} className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">WhatsApp (Sadece rakam)</label>
                                    <input name="whatsapp" value={settings.whatsapp || ''} onChange={handleChange} className="form-input" placeholder="05365266936" />
                                </div>
                                <div>
                                    <label className="form-label">E-posta</label>
                                    <input name="email" value={settings.email || ''} onChange={handleChange} type="email" className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">Çalışma Saatleri</label>
                                    <input name="working_hours" value={settings.working_hours || ''} onChange={handleChange} className="form-input" />
                                </div>
                            </div>
                            <div>
                                <label className="form-label">Açık Adres</label>
                                <textarea name="address" value={settings.address || ''} onChange={handleChange} rows={2} className="form-textarea" />
                            </div>
                            <div>
                                <label className="form-label">Google Maps Linki (URL veya iframe src)</label>
                                <input name="google_maps_url" value={settings.google_maps_url || ''} onChange={handleChange} className="form-input" />
                            </div>
                        </motion.div>
                    )}

                    {/* SOSYAL MEDYA */}
                    {activeTab === 'sosyal' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {['instagram_url', 'tiktok_url', 'facebook_url', 'youtube_url'].map(field => (
                                <div key={field}>
                                    <label className="form-label capitalize">{field.replace('_url', '')}</label>
                                    <input name={field} value={settings[field] || ''} onChange={handleChange} className="form-input" />
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* HERO */}
                    {activeTab === 'hero' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                            <p className="text-sm text-muted mb-4">Ana sayfa hero yönetimi artık özel Hero sayfasında yapılmaktadır. Lütfen menüden Hero'yu seçin.</p>
                            <a href="/admin/hero" className="btn-secondary px-6 py-2 inline-flex items-center gap-2">
                                Hero Sayfasına Git
                            </a>
                        </motion.div>
                    )}

                    {/* SEO & TRACKING */}
                    {activeTab === 'seo' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                            <div>
                                <label className="form-label">Varsayılan Meta Başlık</label>
                                <input name="meta_title" value={settings.meta_title || ''} onChange={handleChange} className="form-input" />
                            </div>
                            <div>
                                <label className="form-label">Varsayılan Meta Açıklama</label>
                                <textarea name="meta_description" value={settings.meta_description || ''} onChange={handleChange} rows={2} className="form-textarea" />
                            </div>
                            <FileUploadInput label="Varsayılan Open Graph Görseli (og:image)" name="og_image_url" />
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-sage/30 pt-5 mt-5">
                                <div>
                                    <label className="form-label">Google Analytics ID (G-XXXXX)</label>
                                    <input name="google_analytics_id" value={settings.google_analytics_id || ''} onChange={handleChange} className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">GTM ID (GTM-XXXXX)</label>
                                    <input name="gtm_id" value={settings.gtm_id || ''} onChange={handleChange} className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">Meta Pixel ID</label>
                                    <input name="meta_pixel_id" value={settings.meta_pixel_id || ''} onChange={handleChange} className="form-input" />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* HUKUKİ */}
                    {activeTab === 'hukuki' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <p className="text-sm text-muted">Aşağıdaki alanlarda başlıklar için `## Başlık` (Markdown) kullanabilirsiniz.</p>
                            <div>
                                <label className="form-label">KVKK Aydınlatma Metni</label>
                                <textarea name="kvkk_text" value={settings.kvkk_text || ''} onChange={handleChange} rows={6} className="form-textarea font-mono text-xs" />
                            </div>
                            <div>
                                <label className="form-label">Gizlilik Politikası</label>
                                <textarea name="privacy_policy_text" value={settings.privacy_policy_text || ''} onChange={handleChange} rows={6} className="form-textarea font-mono text-xs" />
                            </div>
                            <div>
                                <label className="form-label">Çerez Politikası</label>
                                <textarea name="cookie_policy_text" value={settings.cookie_policy_text || ''} onChange={handleChange} rows={6} className="form-textarea font-mono text-xs" />
                            </div>
                        </motion.div>
                    )}
                </form>
            </div>
        </div>
    );
}
