import { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';

export default function SettingsPage() {
    const [settings, setSettings] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('genel');

    useEffect(() => {
        apiClient.get('/settings/get.php')
            .then(res => setSettings(res || {}))
            .catch(err => setMessage('Hata: ' + err.message))
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            await apiClient.post('/settings/update.php', settings);
            setMessage('Ayarlar başarıyla kaydedildi.');
        } catch (err: any) {
            setMessage('Hata: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const tabs = [
        { id: 'genel', label: 'Genel' },
        { id: 'iletisim', label: 'İletişim' },
        { id: 'sosyal', label: 'Sosyal Medya' },
        { id: 'hero', label: 'Ana Sayfa / Hero' },
        { id: 'seo', label: 'SEO & Tracking' },
        { id: 'hukuki', label: 'Hukuki Metinler' }
    ];

    if (loading) return <div className="p-6">Yükleniyor...</div>;

    return (
        <div className="bg-warm-white rounded-2xl shadow-soft p-6 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h2 className="text-2xl font-serif text-charcoal font-bold">Site Ayarları</h2>
            </div>
            
            {message && (
                <div className={`p-4 rounded-xl mb-6 ${message.startsWith('Hata') ? 'bg-danger/10 text-danger' : 'bg-sage/10 text-sage-dark'}`}>
                    {message}
                </div>
            )}

            <div className="flex border-b border-border-soft mb-6 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
                            activeTab === tab.id ? 'border-sage text-sage-dark' : 'border-transparent text-charcoal/60 hover:text-charcoal'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {activeTab === 'genel' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Site Adı</label>
                            <input name="site_name" value={settings.site_name || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Logo URL</label>
                            <input name="logo_url" value={settings.logo_url || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" placeholder="/assets/logo.png" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Favicon URL</label>
                            <input name="favicon_url" value={settings.favicon_url || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" placeholder="/favicon.ico" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Footer Metni</label>
                            <textarea name="footer_text" value={settings.footer_text || ''} onChange={handleChange} rows={2} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                        </div>
                    </div>
                )}

                {activeTab === 'iletisim' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">Telefon</label>
                                <input name="phone" value={settings.phone || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">WhatsApp</label>
                                <input name="whatsapp" value={settings.whatsapp || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">E-posta</label>
                                <input name="email" value={settings.email || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">Çalışma Saatleri</label>
                                <input name="working_hours" value={settings.working_hours || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Açık Adres</label>
                            <textarea name="address" value={settings.address || ''} onChange={handleChange} rows={2} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Google Maps Linki</label>
                            <input name="google_maps_url" value={settings.google_maps_url || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                        </div>
                    </div>
                )}

                {activeTab === 'sosyal' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">Instagram</label>
                                <input name="instagram_url" value={settings.instagram_url || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">TikTok</label>
                                <input name="tiktok_url" value={settings.tiktok_url || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">Facebook</label>
                                <input name="facebook_url" value={settings.facebook_url || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">YouTube</label>
                                <input name="youtube_url" value={settings.youtube_url || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">LinkedIn</label>
                                <input name="linkedin_url" value={settings.linkedin_url || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'hero' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Hero Başlığı</label>
                            <input name="hero_title" value={settings.hero_title || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Hero Açıklaması</label>
                            <textarea name="hero_description" value={settings.hero_description || ''} onChange={handleChange} rows={3} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">CTA 1 Metni</label>
                                <input name="cta1_text" value={settings.cta1_text || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">CTA 1 Linki</label>
                                <input name="cta1_link" value={settings.cta1_link || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">CTA 2 Metni</label>
                                <input name="cta2_text" value={settings.cta2_text || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">CTA 2 Linki</label>
                                <input name="cta2_link" value={settings.cta2_link || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Hero Video URL</label>
                            <input name="hero_video_url" value={settings.hero_video_url || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Hero Görseli URL (Video yoksa gösterilir)</label>
                            <input name="hero_image_url" value={settings.hero_image_url || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Mobil Poster Görseli</label>
                            <input name="hero_mobile_poster_url" value={settings.hero_mobile_poster_url || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="hero_video_active" name="hero_video_active" checked={settings.hero_video_active === '1' || settings.hero_video_active === true} onChange={(e) => setSettings({...settings, hero_video_active: e.target.checked ? '1' : '0'})} className="mr-2" />
                            <label htmlFor="hero_video_active" className="text-sm font-medium text-charcoal">Video Aktif Mi?</label>
                        </div>
                    </div>
                )}

                {activeTab === 'seo' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Varsayılan Meta Title</label>
                            <input name="meta_title" value={settings.meta_title || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Varsayılan Meta Description</label>
                            <textarea name="meta_description" value={settings.meta_description || ''} onChange={handleChange} rows={2} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Open Graph Görseli URL</label>
                            <input name="og_image_url" value={settings.og_image_url || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">Google Analytics ID</label>
                                <input name="google_analytics_id" value={settings.google_analytics_id || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">GTM ID</label>
                                <input name="gtm_id" value={settings.gtm_id || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">Meta Pixel ID</label>
                                <input name="meta_pixel_id" value={settings.meta_pixel_id || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'hukuki' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">KVKK Aydınlatma Metni</label>
                            <textarea name="kvkk_text" value={settings.kvkk_text || ''} onChange={handleChange} rows={6} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none font-mono text-xs" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Gizlilik Politikası</label>
                            <textarea name="privacy_policy_text" value={settings.privacy_policy_text || ''} onChange={handleChange} rows={6} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none font-mono text-xs" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">Çerez Politikası</label>
                            <textarea name="cookie_policy_text" value={settings.cookie_policy_text || ''} onChange={handleChange} rows={6} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none font-mono text-xs" />
                        </div>
                    </div>
                )}

                <div className="pt-6 border-t border-border-soft flex justify-end">
                    <button type="submit" disabled={saving} className="bg-sage text-warm-white font-bold py-3 px-8 rounded-xl hover:bg-sage-dark transition-colors disabled:opacity-50">
                        {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
}
