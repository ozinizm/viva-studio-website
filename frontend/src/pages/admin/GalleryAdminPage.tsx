import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { apiClient } from '../../services/apiClient';
import { getMediaUrl, handleImageError } from '../../utils/mediaUrl';

export default function GalleryAdminPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState<any>({ media_type: 'image', category: 'Genel', sort_order: 0, is_active: 1 });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadData = () => {
        setLoading(true);
        apiClient.get('/gallery/list.php')
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
            await apiClient.post('/gallery/delete.php', { id });
            loadData();
        } catch (e: any) {
            alert('Hata: ' + e.message);
        }
    };

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const sendFormData = new FormData();
        
        const file = fileInputRef.current?.files?.[0];
        if (!file && formData.media_type === 'image') {
            setMessage({ type: 'error', text: 'Lütfen bir görsel seçin.' });
            return;
        }

        if (file) {
            sendFormData.append('file', file); // changed 'image' to 'file' to match generic upload if needed, wait, the PHP expects 'image' or 'file'? Let's keep it 'image' if that's what backend expects or 'file' if generic.
            // Looking at the original: sendFormData.append('image', file);
            sendFormData.append('image', file);
        }
        
        sendFormData.append('media_type', formData.media_type || 'image');
        sendFormData.append('video_url', formData.video_url || '');
        sendFormData.append('title', formData.title || '');
        sendFormData.append('category', formData.category || 'Genel');
        sendFormData.append('alt_text', formData.alt_text || '');
        sendFormData.append('sort_order', String(formData.sort_order || 0));
        sendFormData.append('is_active', String(formData.is_active ? 1 : 0));

        setUploading(true);
        setMessage({ type: 'info', text: 'Yükleniyor...' });

        try {
            const token = localStorage.getItem('viva_admin_token') || '';
            const res = await fetch('/api/gallery/upload.php', {
                method: 'POST',
                headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: sendFormData
            });
            const result = await res.json();
            
            if (res.ok && result.success) {
                setShowModal(false);
                setFormData({ media_type: 'image', category: 'Genel', sort_order: 0, is_active: 1 });
                setMessage({ type: '', text: '' });
                loadData();
            } else {
                setMessage({ type: 'error', text: 'Hata: ' + (result.message || result.error || 'Yükleme başarısız') });
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: 'Hata: ' + err.message });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-dark">Galeri Yönetimi</h1>
                    <p className="text-muted text-sm mt-1">Sitede görünecek fotoğraf ve videoları buradan yönetin.</p>
                </div>
                <button onClick={() => {
                    setFormData({ media_type: 'image', category: 'Genel', sort_order: 0, is_active: 1 });
                    setShowModal(true);
                }} className="btn-primary py-2.5">
                    + Yeni Medya Ekle
                </button>
            </div>
            
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-48 rounded-3xl" />)}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {data.length === 0 ? (
                        <div className="col-span-full py-16 text-center bg-white rounded-3xl shadow-card">
                            <span className="text-5xl block mb-4">📸</span>
                            <div className="text-text-dark font-bold text-lg mb-2">Medya bulunamadı</div>
                            <div className="text-sm text-muted max-w-md mx-auto">Sitenin galeri bölümünde gösterilecek henüz hiçbir görsel veya video yüklemediniz.</div>
                        </div>
                    ) : data.map((item: any, i: number) => (
                        <motion.div 
                            key={item.id} 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="group bg-white rounded-3xl overflow-hidden shadow-card relative border border-sage/30 flex flex-col"
                        >
                            <div className="relative aspect-square">
                                {item.media_type === 'video' ? (
                                    <div className="w-full h-full bg-forest flex flex-col items-center justify-center text-white relative">
                                        {item.image_url ? (
                                            <video src={getMediaUrl(item.image_url)} className="w-full h-full object-cover opacity-80" muted playsInline />
                                        ) : (
                                            <>
                                                <span className="text-4xl mb-2">🎬</span>
                                                <span className="text-sm font-medium">Harici Video</span>
                                            </>
                                        )}
                                        <div className="absolute top-3 left-3 glass px-2 py-1 rounded-lg text-xs font-bold text-forest">VIDEO</div>
                                    </div>
                                ) : (
                                    <img src={getMediaUrl(item.image_url)} onError={handleImageError} alt={item.alt_text} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                                )}
                                
                                {/* Overlay & Actions */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                    <button onClick={() => handleDelete(item.id)} className="btn-secondary bg-danger text-white border-danger hover:bg-danger/90">
                                        Sil
                                    </button>
                                </div>
                            </div>
                            
                            <div className="p-4 flex flex-col flex-1">
                                <div className="font-bold text-text-dark text-sm line-clamp-1 mb-1">{item.title || 'Başlıksız'}</div>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">{item.category}</span>
                                    <span className="text-xs text-muted">Sıra: {item.sort_order}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
                    >
                        <h3 className="text-2xl font-bold mb-6 text-text-dark">Yeni Medya Yükle</h3>
                        
                        {message.text && (
                            <div className={`p-4 rounded-2xl mb-6 text-sm font-medium ${message.type === 'error' ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'}`}>
                                {message.text}
                            </div>
                        )}
                        
                        <form onSubmit={handleUpload} className="space-y-5">
                            <div>
                                <label className="form-label">Medya Tipi</label>
                                <select value={formData.media_type} className="form-input" onChange={(e) => setFormData({...formData, media_type: e.target.value})}>
                                    <option value="image">Görsel (Image)</option>
                                    <option value="video">Video (MP4/WebM)</option>
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Dosya Yükle {formData.media_type === 'image' && <span className="text-danger">*</span>}</label>
                                <input type="file" ref={fileInputRef} accept={formData.media_type === 'video' ? 'video/mp4,video/webm' : 'image/*'} className="form-input p-2" />
                            </div>

                            {formData.media_type === 'video' && (
                                <div>
                                    <label className="form-label">Dış Video URL (Opsiyonel)</label>
                                    <input type="text" value={formData.video_url || ''} onChange={e => setFormData({...formData, video_url: e.target.value})} className="form-input" placeholder="https://youtube.com/... veya mp4 linki" />
                                </div>
                            )}

                            <div>
                                <label className="form-label">Başlık</label>
                                <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="form-input" placeholder="Medya başlığı" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Kategori</label>
                                    <select value={formData.category || 'Genel'} onChange={e => setFormData({...formData, category: e.target.value})} className="form-input">
                                        <option value="Genel">Genel</option>
                                        <option value="Pilates">Pilates</option>
                                        <option value="EMS">EMS</option>
                                        <option value="Vacu Activ">Vacu Activ</option>
                                        <option value="G5">G5</option>
                                        <option value="Studio">Studio</option>
                                        <option value="Diğer">Diğer</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">Sıralama</label>
                                    <input type="number" value={formData.sort_order || 0} onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value)})} className="form-input" />
                                </div>
                            </div>

                            <div>
                                <label className="form-label">Alt Text (SEO için kısa açıklama)</label>
                                <input type="text" value={formData.alt_text || ''} onChange={e => setFormData({...formData, alt_text: e.target.value})} className="form-input" placeholder="Görsel açıklaması" />
                            </div>

                            <div className="flex items-center pt-2 pb-4">
                                <input type="checkbox" id="item_active" checked={formData.is_active === 1 || formData.is_active === true} onChange={e => setFormData({...formData, is_active: e.target.checked ? 1 : 0})} className="w-5 h-5 text-primary rounded focus:ring-primary border-gray-300" />
                                <label htmlFor="item_active" className="ml-3 text-sm font-medium text-text-dark cursor-pointer">Sitede Göster (Aktif)</label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-sage/30">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">İptal</button>
                                <button type="submit" disabled={uploading} className="btn-primary w-32 justify-center">
                                    {uploading ? 'Yükleniyor...' : 'Yükle'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
