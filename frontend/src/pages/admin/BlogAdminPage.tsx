import { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';
import { getMediaUrl } from '../../utils/mediaUrl';

export default function BlogAdminPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState<any>({});
    const [isEdit, setIsEdit] = useState(false);

    const loadData = () => {
        setLoading(true);
        apiClient.get('/blog/list.php')
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
            await apiClient.post('/blog/delete.php', { id });
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
            const endpoint = isEdit ? '/blog/update.php' : '/blog/create.php';
            await apiClient.post(endpoint, formData);
            setShowModal(false);
            loadData();
        } catch (err: any) {
            setMessage('Hata: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formDataPayload = new FormData();
        formDataPayload.append('file', file);
        formDataPayload.append('folder', 'blog');

        setMessage('Dosya yükleniyor...');
        try {
            const token = localStorage.getItem('viva_admin_token') || '';
            const res = await fetch((import.meta.env.PROD ? '/api' : 'http://localhost/api') + '/shared/upload_file.php', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataPayload
            });
            const result = await res.json();
            if (res.ok && result.success) {
                setFormData((prev: any) => ({ ...prev, [fieldName]: result.url }));
                setMessage('Dosya başarıyla yüklendi.');
            } else {
                setMessage('Yükleme hatası: ' + (result.message || 'Başarısız'));
            }
        } catch (err: any) {
            setMessage('Hata: ' + err.message);
        }
    };

    const openCreateModal = () => {
        setFormData({ status: 'draft', is_active: 1 });
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
                <h2 className="text-2xl font-serif text-charcoal font-bold">Blog Yönetimi</h2>
                <button onClick={openCreateModal} className="bg-sage text-warm-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-sage-dark transition-colors">
                    Yeni Yazı Ekle
                </button>
            </div>
            
            {loading ? (
                <p>Yükleniyor...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border-soft text-charcoal/60 text-sm">
                                <th className="pb-3">Başlık</th>
                                <th className="pb-3">Durum</th>
                                <th className="pb-3">Kategori</th>
                                <th className="pb-3 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr><td colSpan={4} className="py-4 text-center text-charcoal/50">Kayıt bulunamadı.</td></tr>
                            ) : data.map((item: any) => (
                                <tr key={item.id} className="border-b border-border-soft last:border-0 hover:bg-black/[0.01]">
                                    <td className="py-4 font-medium">{item.title}</td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'published' ? 'bg-sage/20 text-sage-dark' : 'bg-charcoal/10 text-charcoal'}`}>
                                            {item.status === 'published' ? 'Yayında' : 'Taslak'}
                                        </span>
                                    </td>
                                    <td className="py-4">{item.category || '-'}</td>
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
                    <div className="bg-warm-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4 text-charcoal">{isEdit ? 'Yazıyı Düzenle' : 'Yeni Yazı'}</h3>
                        {message && <div className={`mb-4 text-sm p-3 rounded ${message.startsWith('Hata') ? 'bg-danger/10 text-danger' : 'bg-sage/10 text-sage-dark'}`}>{message}</div>}
                        
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Başlık *</label>
                                    <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border rounded-xl outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Slug *</label>
                                    <input type="text" value={formData.slug || ''} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full px-3 py-2 border rounded-xl outline-none" placeholder="saglikli-yasam-tuyolari" required />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">Özet (Summary)</label>
                                <textarea value={formData.summary || ''} onChange={e => setFormData({...formData, summary: e.target.value})} rows={2} className="w-full px-3 py-2 border rounded-xl outline-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">İçerik (HTML destekler)</label>
                                <textarea value={formData.content || ''} onChange={e => setFormData({...formData, content: e.target.value})} rows={8} className="w-full px-3 py-2 border rounded-xl outline-none font-mono text-sm" />
                            </div>
                            
                            <div className="bg-white p-4 rounded-xl border border-border-soft space-y-3">
                                <label className="block text-sm font-medium text-charcoal">Kapak Görseli</label>
                                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                    {formData.cover_image_url && <img src={getMediaUrl(formData.cover_image_url)} alt="Kapak" className="h-16 w-24 object-cover rounded border bg-sage/5" />}
                                    <div className="flex-1 space-y-2 w-full">
                                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover_image_url')} className="text-xs" />
                                        <input type="text" value={formData.cover_image_url || ''} onChange={e => setFormData({...formData, cover_image_url: e.target.value})} className="w-full px-3 py-1 text-xs border rounded font-mono" placeholder="Kapak Görseli URL veya yolu" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Kategori</label>
                                    <input type="text" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border rounded-xl outline-none" placeholder="Egzersiz, Beslenme..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Yayın Tarihi</label>
                                    <input type="datetime-local" value={formData.published_at ? formData.published_at.substring(0, 16) : ''} onChange={e => setFormData({...formData, published_at: e.target.value})} className="w-full px-3 py-2 border rounded-xl outline-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">SEO Title</label>
                                    <input type="text" value={formData.seo_title || ''} onChange={e => setFormData({...formData, seo_title: e.target.value})} className="w-full px-3 py-2 border rounded-xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">SEO Description</label>
                                    <input type="text" value={formData.seo_description || ''} onChange={e => setFormData({...formData, seo_description: e.target.value})} className="w-full px-3 py-2 border rounded-xl outline-none" />
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-border-soft">
                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center text-sm font-medium">
                                        <input type="radio" name="status" value="draft" checked={formData.status === 'draft'} onChange={e => setFormData({...formData, status: e.target.value})} className="mr-2" />
                                        Taslak
                                    </label>
                                    <label className="flex items-center text-sm font-medium">
                                        <input type="radio" name="status" value="published" checked={formData.status === 'published'} onChange={e => setFormData({...formData, status: e.target.value})} className="mr-2" />
                                        Yayınla
                                    </label>
                                </div>
                                <label className="flex items-center text-sm font-medium">
                                    <input type="checkbox" id="is_active" checked={formData.is_active === 1 || formData.is_active === true || formData.is_active === '1'} onChange={e => setFormData({...formData, is_active: e.target.checked ? 1 : 0})} className="mr-2" />
                                    Aktif
                                </label>
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
