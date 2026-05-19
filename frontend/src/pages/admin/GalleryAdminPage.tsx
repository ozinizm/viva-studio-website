import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '../../services/apiClient';
import { getMediaUrl, handleImageError } from '../../utils/mediaUrl';

export default function GalleryAdminPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState<any>({ media_type: 'image', category: 'Genel', sort_order: 0, is_active: 1 });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadData = () => {
        setLoading(true);
        apiClient.get('/gallery/list.php')
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
            setMessage('Lütfen bir görsel seçin.');
            return;
        }

        if (file) {
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
        setMessage('');

        try {
            const token = localStorage.getItem('viva_admin_token') || '';
            const res = await fetch((import.meta.env.PROD ? '/api' : 'http://localhost/api') + '/gallery/upload.php', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: sendFormData
            });
            const result = await res.json();
            
            if (res.ok && result.success) {
                setShowModal(false);
                setFormData({ media_type: 'image', category: 'Genel', sort_order: 0, is_active: 1 });
                loadData();
            } else {
                setMessage('Hata: ' + (result.message || result.error || 'Yükleme başarısız'));
            }
        } catch (err: any) {
            setMessage('Hata: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-warm-white rounded-2xl shadow-soft p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-charcoal font-bold">Galeri Yönetimi</h2>
                <button onClick={() => {
                    setFormData({ media_type: 'image', category: 'Genel', sort_order: 0, is_active: 1 });
                    setShowModal(true);
                }} className="bg-sage text-warm-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-sage-dark transition-colors">
                    Yeni Medya Ekle
                </button>
            </div>
            
            {loading ? (
                <p>Yükleniyor...</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {data.length === 0 ? (
                        <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-border-soft shadow-soft">
                            <span className="text-4xl block mb-2">📸</span>
                            <div className="text-charcoal font-medium">Medya bulunamadı</div>
                            <div className="text-xs text-charcoal/50 mt-1">Sitenin galeri bölümünde gösterilecek henüz hiçbir görsel veya video yüklemediniz.</div>
                        </div>
                    ) : data.map((item: any) => (
                        <div key={item.id} className="relative group rounded-xl overflow-hidden shadow-sm border border-border-soft bg-white">
                            {item.media_type === 'video' ? (
                                <div className="w-full h-32 bg-sage-dark/10 flex items-center justify-center text-xs text-charcoal/70 relative">
                                    {item.image_url ? (
                                        <video src={getMediaUrl(item.image_url)} className="w-full h-full object-cover" muted playsInline />
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <span className="text-lg">🎬</span>
                                            <span className="mt-1 text-[10px]">Harici Video</span>
                                        </div>
                                    )}
                                    <span className="absolute top-2 left-2 bg-sage text-warm-white text-[10px] px-1.5 py-0.5 rounded">Video</span>
                                </div>
                            ) : (
                                <img src={getMediaUrl(item.image_url)} onError={handleImageError} alt={item.alt_text} className="w-full h-32 object-cover" />
                            )}
                            <div className="p-2 border-t">
                                <div className="text-xs font-bold truncate">{item.title || 'Başlıksız'}</div>
                                <div className="text-[10px] text-charcoal/60 flex justify-between mt-1">
                                    <span>{item.category}</span>
                                    <span>Sıra: {item.sort_order}</span>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-charcoal/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={() => handleDelete(item.id)} className="bg-danger text-white px-3 py-1 rounded-lg text-sm">Sil</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-charcoal/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-warm-white rounded-2xl p-6 w-full max-w-md max-h-[95vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4 text-charcoal">Yeni Medya Yükle</h3>
                        {message && <div className="text-danger mb-4 text-sm bg-danger/10 p-3 rounded">{message}</div>}
                        
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Medya Tipi *</label>
                                <select value={formData.media_type} className="w-full px-3 py-2 border rounded-xl" onChange={(e) => setFormData({...formData, media_type: e.target.value})}>
                                    <option value="image">Görsel (Image)</option>
                                    <option value="video">Video (MP4/WebM)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Dosya Yükle {formData.media_type === 'image' && '*'}</label>
                                <input type="file" ref={fileInputRef} accept={formData.media_type === 'video' ? 'video/mp4,video/webm' : 'image/*'} className="w-full text-sm" />
                            </div>

                            {formData.media_type === 'video' && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Dış Video URL (Opsiyonel)</label>
                                    <input type="text" value={formData.video_url || ''} onChange={e => setFormData({...formData, video_url: e.target.value})} className="w-full px-3 py-2 border rounded-xl" placeholder="https://youtube.com/... veya mp4 linki" />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-1">Başlık (Opsiyonel)</label>
                                <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border rounded-xl" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Kategori</label>
                                <input type="text" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border rounded-xl" placeholder="Genel, Stüdyo, Pilates vb." />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Alt Text (Açıklama)</label>
                                <input type="text" value={formData.alt_text || ''} onChange={e => setFormData({...formData, alt_text: e.target.value})} className="w-full px-3 py-2 border rounded-xl" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Sıralama</label>
                                    <input type="number" value={formData.sort_order || 0} onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value)})} className="w-full px-3 py-2 border rounded-xl" />
                                </div>
                                <div className="flex items-center pt-6">
                                    <input type="checkbox" id="item_active" checked={formData.is_active === 1 || formData.is_active === true} onChange={e => setFormData({...formData, is_active: e.target.checked ? 1 : 0})} className="mr-2" />
                                    <label htmlFor="item_active" className="text-sm font-medium">Aktif</label>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-charcoal hover:bg-black/5 rounded-xl">İptal</button>
                                <button type="submit" disabled={uploading} className="px-4 py-2 bg-sage text-white rounded-xl hover:bg-sage-dark disabled:opacity-50">
                                    {uploading ? 'Yükleniyor...' : 'Yükle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
