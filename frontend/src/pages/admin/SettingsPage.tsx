import { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';

export default function SettingsPage() {
    const [settings, setSettings] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

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

    if (loading) return <div className="p-6">Yükleniyor...</div>;

    return (
        <div className="bg-warm-white rounded-2xl shadow-soft p-6 max-w-3xl">
            <h2 className="text-2xl font-serif text-charcoal font-bold mb-6">Site Ayarları</h2>
            
            {message && (
                <div className={`p-4 rounded-xl mb-6 ${message.startsWith('Hata') ? 'bg-danger/10 text-danger' : 'bg-sage/10 text-sage-dark'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <label className="block text-sm font-medium text-charcoal mb-2">Instagram Username</label>
                        <input name="instagram" value={settings.instagram || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Adres</label>
                    <textarea name="address" value={settings.address || ''} onChange={handleChange} rows={2} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Çalışma Saatleri</label>
                    <textarea name="working_hours" value={settings.working_hours || ''} onChange={handleChange} rows={2} className="w-full px-4 py-2 rounded-xl border border-border-soft focus:ring-2 focus:ring-sage focus:border-sage outline-none" />
                </div>

                <div className="pt-4 border-t border-border-soft">
                    <button type="submit" disabled={saving} className="bg-sage text-warm-white font-bold py-3 px-6 rounded-xl hover:bg-sage-dark transition-colors disabled:opacity-50">
                        {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
}
