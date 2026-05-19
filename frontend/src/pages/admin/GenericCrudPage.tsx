import { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';

export default function GenericCrudPage({ title, endpoint }: { title: string, endpoint: string }) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get(`/${endpoint}/list.php`)
            .then(res => setData(res || []))
            .catch(() => setData([]))
            .finally(() => setLoading(false));
    }, [endpoint]);

    return (
        <div className="bg-warm-white rounded-2xl shadow-soft p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-charcoal font-bold">{title}</h2>
                <button className="bg-sage text-warm-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-sage-dark">Yeni Ekle</button>
            </div>
            {loading ? (
                <p>Yükleniyor...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border-soft text-charcoal/60 text-sm">
                                <th className="pb-3">ID</th>
                                <th className="pb-3">Başlık / Detay</th>
                                <th className="pb-3 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr><td colSpan={3} className="py-4 text-center text-charcoal/50">Kayıt bulunamadı. (Gerçek API bağlandığında veriler burada listelenecektir)</td></tr>
                            ) : data.map((item: any) => (
                                <tr key={item.id} className="border-b border-border-soft last:border-0">
                                    <td className="py-4 text-sm">{item.id}</td>
                                    <td className="py-4 font-medium">{item.title || item.full_name || item.question || item.author_name || item.setting_key || 'Kayıt'}</td>
                                    <td className="py-4 text-right">
                                        <button className="text-sage hover:text-sage-dark mr-3 text-sm font-medium">Düzenle</button>
                                        <button className="text-danger hover:text-danger/80 text-sm font-medium">Sil</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
