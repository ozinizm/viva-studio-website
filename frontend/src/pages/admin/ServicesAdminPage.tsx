import { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';

export default function ServicesAdminPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState<any>({});
    const [isEdit, setIsEdit] = useState(false);

    const loadData = () => {
        setLoading(true);
        apiClient.get('/services/list.php')
            .then(res => setData(res || []))
            .catch(() => setData([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Silmek istediğinize emin misiniz?')) return;
        try {
            await apiClient.post('/services/delete.php', { id });
            loadData();
        } catch (e: any) {
            alert('Hata: ' + e.message);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const endpoint = isEdit ? '/services/update.php' : '/services/create.php';
            await apiClient.post(endpoint, formData);
            setShowModal(false);
            loadData();
        } catch (err: any) {
            setMessage('Hata: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const openCreateModal = () => {
        setFormData({ is_active: 1, sort_order: 0 });
        setIsEdit(false);
        setMessage('');
        setShowModal(true);
    };

    const openEditModal = (item: any) => {
        setFormData(item);
        setIsEdit(true);
        setMessage('');
        setShowModal(true);
    };

    return (
        <div className="bg-warm-white rounded-2xl shadow-soft p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-charcoal font-bold">Hizmet Yönetimi</h2>
                <button onClick={openCreateModal} className="bg-sage text-warm-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-sage-dark">
                    Yeni Hizmet Ekle
                </button>
            </div>
            
            {loading ? (
                <p>Yükleniyor...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border-soft text-charcoal/60 text-sm">
                                <th className="pb-3">Hizmet Adı</th>
                                <th className="pb-3">Durum</th>
                                <th className="pb-3 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr><td colSpan={3} className="py-4 text-center text-charcoal/50">Kayıt bulunamadı.</td></tr>
                            ) : data.map((item: any) => (
                                <tr key={item.id} className="border-b border-border-soft last:border-0">
                                    <td className="py-4 font-medium">{item.title}</td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${item.is_active ? 'bg-sage/20 text-sage-dark' : 'bg-danger/20 text-danger'}`}>
                                            {item.is_active ? 'Aktif' : 'Pasif'}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <button onClick={() => openEditModal(item)} className="text-sage hover:text-sage-dark mr-3 text-sm font-medium">Düzenle</button>
                                        <button onClick={() => handleDelete(item.id)} className="text-danger hover:text-danger/80 text-sm font-medium">Sil</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-charcoal/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-warm-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4 text-charcoal">{isEdit ? 'Hizmeti Düzenle' : 'Yeni Hizmet'}</h3>
                        {message && <div className="text-danger mb-4 text-sm bg-danger/10 p-3 rounded">{message}</div>}
                        
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Başlık</label>
                                    <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border rounded-xl" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Slug</label>
                                    <input type="text" value={formData.slug || ''} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full px-3 py-2 border rounded-xl" required />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">Kısa Açıklama</label>
                                <textarea value={formData.short_description || ''} onChange={e => setFormData({...formData, short_description: e.target.value})} rows={2} className="w-full px-3 py-2 border rounded-xl" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Detaylı Açıklama (HTML destekler)</label>
                                <textarea value={formData.detail_description || ''} onChange={e => setFormData({...formData, detail_description: e.target.value})} rows={4} className="w-full px-3 py-2 border rounded-xl" />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Görsel URL</label>
                                    <input type="text" value={formData.image_url || ''} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full px-3 py-2 border rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Sıralama (Sayı)</label>
                                    <input type="number" value={formData.sort_order || 0} onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value)})} className="w-full px-3 py-2 border rounded-xl" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">SEO Title</label>
                                    <input type="text" value={formData.seo_title || ''} onChange={e => setFormData({...formData, seo_title: e.target.value})} className="w-full px-3 py-2 border rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">SEO Description</label>
                                    <input type="text" value={formData.seo_description || ''} onChange={e => setFormData({...formData, seo_description: e.target.value})} className="w-full px-3 py-2 border rounded-xl" />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" id="is_active" checked={formData.is_active === 1 || formData.is_active === true || formData.is_active === '1'} onChange={e => setFormData({...formData, is_active: e.target.checked ? 1 : 0})} className="mr-2" />
                                <label htmlFor="is_active" className="text-sm font-medium">Aktif olarak sitede göster</label>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-charcoal hover:bg-black/5 rounded-xl">İptal</button>
                                <button type="submit" disabled={saving} className="px-4 py-2 bg-sage text-white rounded-xl hover:bg-sage-dark disabled:opacity-50">
                                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
