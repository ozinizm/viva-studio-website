import { useState, useEffect, useRef } from 'react';
import { apiClient } from '../../services/apiClient';

export default function GalleryAdminPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
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
        const formData = new FormData(e.currentTarget);
        const file = formData.get('image') as File;
        
        if (!file || file.size === 0) {
            setMessage('Lütfen bir görsel seçin.');
            return;
        }

        setUploading(true);
        setMessage('');

        try {
            const token = localStorage.getItem('viva_admin_auth_token') || '';
            const res = await fetch((import.meta.env.PROD ? '/api' : 'http://localhost/api') + '/gallery/upload.php', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            const result = await res.json();
            
            if (res.ok && result.success) {
                setShowModal(false);
                loadData();
            } else {
                setMessage('Hata: ' + (result.message || result.error || 'Upload failed'));
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
                <button onClick={() => setShowModal(true)} className="bg-sage text-warm-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-sage-dark">
                    Yeni Görsel Ekle
                </button>
            </div>
            
            {loading ? (
                <p>Yükleniyor...</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {data.length === 0 ? (
                        <div className="col-span-full py-4 text-center text-charcoal/50">Kayıt bulunamadı.</div>
                    ) : data.map((item: any) => (
                        <div key={item.id} className="relative group rounded-xl overflow-hidden shadow-sm border border-border-soft bg-white">
                            <img src={item.image_url} alt={item.alt_text} className="w-full h-32 object-cover" />
                            <div className="absolute inset-0 bg-charcoal/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={() => handleDelete(item.id)} className="bg-danger text-white px-3 py-1 rounded-lg text-sm">Sil</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-charcoal/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-warm-white rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4 text-charcoal">Yeni Görsel Yükle</h3>
                        {message && <div className="text-danger mb-4 text-sm">{message}</div>}
                        
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Medya Tipi</label>
                                <select name="media_type" className="w-full px-3 py-2 border rounded-xl" onChange={(e) => {
                                    // Just to force re-render or handle state if needed, but simple uncontrolled form works
                                }}>
                                    <option value="image">Görsel (Image)</option>
                                    <option value="video">Video (MP4/WebM)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Dosya Yükle (Görsel veya Video)</label>
                                <input type="file" name="image" accept="image/*,video/mp4,video/webm" ref={fileInputRef} className="w-full text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Video URL (Dosya yerine dış link)</label>
                                <input type="text" name="video_url" className="w-full px-3 py-2 border rounded-xl" placeholder="https://youtube.com/..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Başlık (Opsiyonel)</label>
                                <input type="text" name="title" className="w-full px-3 py-2 border rounded-xl" />
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
