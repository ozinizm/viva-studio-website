import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiClient } from '../../services/apiClient';
import { getMediaUrl, handleImageError } from '../../utils/mediaUrl';

export default function ServicesAdminPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState<any>({});
    const [isEdit, setIsEdit] = useState(false);

    const loadData = () => {
        setLoading(true);
        apiClient.get('/services/list.php')
            .then(res => setData(res?.data || res || []))
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
        setMessage({ type: '', text: '' });

        try {
            const endpoint = isEdit ? '/services/update.php' : '/services/create.php';
            await apiClient.post(endpoint, formData);
            setShowModal(false);
            loadData();
        } catch (err: any) {
            setMessage({ type: 'error', text: 'Hata: ' + err.message });
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', 'services');

        setMessage({ type: 'info', text: 'Dosya yükleniyor...' });
        try {
            const token = localStorage.getItem('viva_admin_token') || '';
            const res = await fetch('/api/shared/upload_file.php', {
                method: 'POST',
                headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: fd
            });
            const result = await res.json();
            if (res.ok && result.success) {
                setFormData((prev: any) => ({ ...prev, [fieldName]: result.url }));
                setMessage({ type: 'success', text: 'Dosya başarıyla yüklendi.' });
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            } else {
                setMessage({ type: 'error', text: 'Yükleme hatası: ' + (result.message || 'Başarısız') });
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: 'Hata: ' + err.message });
        }
    };

    const openCreateModal = () => {
        setFormData({ is_active: 1, sort_order: 0, category: 'Pilates' });
        setIsEdit(false);
        setMessage({ type: '', text: '' });
        setShowModal(true);
    };

    const openEditModal = (item: any) => {
        setFormData(item);
        setIsEdit(true);
        setMessage({ type: '', text: '' });
        setShowModal(true);
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-dark">Hizmet Yönetimi</h1>
                    <p className="text-muted text-sm mt-1">Sitede sunulan hizmetleri, kategorileri ve içerikleri düzenleyin.</p>
                </div>
                <button onClick={openCreateModal} className="btn-primary py-2.5">
                    + Yeni Hizmet Ekle
                </button>
            </div>
            
            {loading ? (
                <div className="bg-white rounded-3xl shadow-card p-6 border border-sage/30">
                    <div className="skeleton h-12 w-full mb-4 rounded-xl" />
                    <div className="skeleton h-12 w-full mb-4 rounded-xl" />
                    <div className="skeleton h-12 w-full rounded-xl" />
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-card border border-sage/30 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Görsel</th>
                                    <th>Hizmet Adı</th>
                                    <th>Kategori</th>
                                    <th>Sıra</th>
                                    <th>Durum</th>
                                    <th className="text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length === 0 ? (
                                    <tr><td colSpan={6} className="py-8 text-center text-muted">Kayıt bulunamadı.</td></tr>
                                ) : data.map((item: any, idx: number) => (
                                    <motion.tr 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={item.id}
                                    >
                                        <td className="w-16">
                                            {item.image_url ? (
                                                <img src={getMediaUrl(item.image_url)} alt="" className="w-10 h-10 rounded-lg object-cover border border-sage/30" onError={handleImageError} />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-sage/20 flex items-center justify-center text-xl">✨</div>
                                            )}
                                        </td>
                                        <td className="font-bold text-text-dark">{item.title}</td>
                                        <td><span className="badge bg-mint text-forest">{item.category}</span></td>
                                        <td className="text-muted">{item.sort_order}</td>
                                        <td>
                                            <span className={`badge ${item.is_active ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger'}`}>
                                                {item.is_active ? 'Aktif' : 'Pasif'}
                                            </span>
                                        </td>
                                        <td className="text-right space-x-3">
                                            <button onClick={() => openEditModal(item)} className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors">Düzenle</button>
                                            <button onClick={() => handleDelete(item.id)} className="text-sm font-semibold text-danger hover:text-danger/80 transition-colors">Sil</button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
                    >
                        <h3 className="text-2xl font-bold mb-6 text-text-dark">{isEdit ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}</h3>
                        
                        {message.text && (
                            <div className={`p-4 rounded-2xl mb-6 text-sm font-medium ${message.type === 'error' ? 'bg-danger/10 text-danger' : message.type === 'info' ? 'bg-mint text-forest' : 'bg-primary/10 text-primary'}`}>
                                {message.text}
                            </div>
                        )}
                        
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="form-label">Başlık <span className="text-danger">*</span></label>
                                    <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="form-input" required />
                                </div>
                                <div>
                                    <label className="form-label">URL Slug <span className="text-danger">*</span></label>
                                    <input type="text" value={formData.slug || ''} onChange={e => setFormData({...formData, slug: e.target.value})} className="form-input" placeholder="reformer-pilates" required />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="form-label">Kategori</label>
                                    <input type="text" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className="form-input" placeholder="Pilates, EMS, Masaj..." />
                                </div>
                                <div>
                                    <label className="form-label">Sıralama (Sayı)</label>
                                    <input type="number" value={formData.sort_order || 0} onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value)})} className="form-input" />
                                </div>
                            </div>

                            <div>
                                <label className="form-label">Kısa Açıklama (Liste görünümünde çıkar)</label>
                                <textarea value={formData.short_description || ''} onChange={e => setFormData({...formData, short_description: e.target.value})} rows={2} className="form-textarea" />
                            </div>

                            <div>
                                <label className="form-label">Detaylı Açıklama (HTML destekler)</label>
                                <textarea value={formData.detail_description || ''} onChange={e => setFormData({...formData, detail_description: e.target.value})} rows={4} className="form-textarea" />
                            </div>

                            {/* Image and Video Uploaders */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="p-4 rounded-2xl border border-sage/30 bg-mint/5">
                                    <label className="form-label">Hizmet Görseli</label>
                                    {formData.image_url && <img src={getMediaUrl(formData.image_url)} alt="Hizmet" className="h-24 w-full object-cover rounded-xl mb-3 border border-sage/20 shadow-sm" onError={handleImageError} />}
                                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image_url')} className="form-input p-2 text-sm" />
                                    <input type="text" value={formData.image_url || ''} onChange={e => setFormData({...formData, image_url: e.target.value})} className="form-input mt-2 text-xs font-mono" placeholder="Görsel URL manuel giriş" />
                                </div>
                                <div className="p-4 rounded-2xl border border-sage/30 bg-mint/5">
                                    <label className="form-label">Hizmet Videosu (Sessiz autoplay)</label>
                                    {formData.video_url && (
                                        <div className="h-24 w-full bg-forest rounded-xl mb-3 flex items-center justify-center text-white text-xs font-bold shadow-sm">VİDEO EKLENDİ</div>
                                    )}
                                    <input type="file" accept="video/mp4,video/webm" onChange={(e) => handleFileUpload(e, 'video_url')} className="form-input p-2 text-sm" />
                                    <input type="text" value={formData.video_url || ''} onChange={e => setFormData({...formData, video_url: e.target.value})} className="form-input mt-2 text-xs font-mono" placeholder="Video URL manuel giriş" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div>
                                    <label className="form-label">Kimler İçin Uygun?</label>
                                    <textarea value={formData.suitable_for || ''} onChange={e => setFormData({...formData, suitable_for: e.target.value})} rows={3} className="form-textarea text-sm" placeholder="Örn: Bel fıtığı olanlar" />
                                </div>
                                <div>
                                    <label className="form-label">Faydalar (Virgülle veya satırla ayırın)</label>
                                    <textarea value={formData.benefits || ''} onChange={e => setFormData({...formData, benefits: e.target.value})} rows={3} className="form-textarea text-sm" placeholder="Örn: Esneklik, güç..." />
                                </div>
                                <div>
                                    <label className="form-label">Süreç Nasıl İşler?</label>
                                    <textarea value={formData.process || ''} onChange={e => setFormData({...formData, process: e.target.value})} rows={3} className="form-textarea text-sm" placeholder="1. Analiz 2. Egzersiz..." />
                                </div>
                            </div>

                            <div>
                                <label className="form-label flex items-center justify-between">
                                    <span>Sıkça Sorulan Sorular</span>
                                    <span className="text-xs text-muted font-normal">Format: Soru:Cevap (Her satırda bir soru) veya JSON</span>
                                </label>
                                <textarea value={formData.faq || ''} onChange={e => setFormData({...formData, faq: e.target.value})} rows={3} className="form-textarea font-mono text-sm" placeholder="Soru 1?:Cevap 1&#10;Soru 2?:Cevap 2" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-sage/30 pt-5">
                                <div>
                                    <label className="form-label">SEO Title</label>
                                    <input type="text" value={formData.seo_title || ''} onChange={e => setFormData({...formData, seo_title: e.target.value})} className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">SEO Description</label>
                                    <input type="text" value={formData.seo_description || ''} onChange={e => setFormData({...formData, seo_description: e.target.value})} className="form-input" />
                                </div>
                            </div>

                            <div className="flex items-center pt-2">
                                <input type="checkbox" id="is_active" checked={formData.is_active === 1 || formData.is_active === true || formData.is_active === '1'} onChange={e => setFormData({...formData, is_active: e.target.checked ? 1 : 0})} className="w-5 h-5 text-primary rounded focus:ring-primary border-gray-300 cursor-pointer" />
                                <label htmlFor="is_active" className="ml-3 text-sm font-semibold text-text-dark cursor-pointer">Sitede aktif olarak göster</label>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-sage/30 mt-8">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary px-6">İptal</button>
                                <button type="submit" disabled={saving} className="btn-primary px-8">
                                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
