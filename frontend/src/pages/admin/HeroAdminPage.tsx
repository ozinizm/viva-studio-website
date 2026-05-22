import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { apiClient } from '../../services/apiClient';
import { getMediaUrl } from '../../utils/mediaUrl';

interface HeroSettings {
  hero_title: string;
  hero_description: string;
  hero_badge_text: string;
  hero_tags: string;
  hero_text_active: string;
  hero_buttons_active: string;
  cta1_text: string;
  cta1_link: string;
  cta1_active: string;
  cta2_text: string;
  cta2_link: string;
  cta2_active: string;
  hero_overlay_opacity: string;
  hero_image_url: string;
  hero_video_url: string;
  hero_video_active: string;
  hero_mobile_video_url: string;
  hero_mobile_poster_url: string;
  hero_mobile_video_active: string;
}

const HERO_DEFAULTS: HeroSettings = {
  hero_title: 'Bedenini Güçlendir,\nHayatını Dönüştür',
  hero_description: 'Tuzla\'nın premium wellness stüdyosunda pilates, EMS, Vacu Activ ve G5 ile forma girin.',
  hero_badge_text: 'Tuzla Premium Wellness Studio',
  hero_tags: 'Pilates, EMS, Vacu Activ, G5, Bölgesel İncelme',
  hero_text_active: '1',
  hero_buttons_active: '1',
  cta1_text: 'Ücretsiz Danışma Al',
  cta1_link: '',
  cta1_active: '1',
  cta2_text: 'Hizmetleri Keşfet',
  cta2_link: '/hizmetler',
  cta2_active: '1',
  hero_overlay_opacity: '0.5',
  hero_image_url: '',
  hero_video_url: '',
  hero_video_active: '0',
  hero_mobile_video_url: '',
  hero_mobile_poster_url: '',
  hero_mobile_video_active: '0',
};

const HeroAdminPage = () => {
  const [form, setForm] = useState<HeroSettings>(HERO_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const mobileVideoRef = useRef<HTMLInputElement>(null);
  const mobilePosterRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/settings/get.php')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) {
          const s = data.data;
          setForm(prev => ({
            ...prev,
            hero_title: s.hero_title ?? prev.hero_title,
            hero_description: s.hero_description ?? prev.hero_description,
            hero_badge_text: s.hero_badge_text ?? prev.hero_badge_text,
            hero_tags: s.hero_tags ?? prev.hero_tags,
            hero_text_active: s.hero_text_active ?? '1',
            hero_buttons_active: s.hero_buttons_active ?? '1',
            cta1_text: s.cta1_text ?? prev.cta1_text,
            cta1_link: s.cta1_link ?? prev.cta1_link,
            cta1_active: s.cta1_active ?? prev.cta1_active,
            cta2_text: s.cta2_text ?? prev.cta2_text,
            cta2_link: s.cta2_link ?? prev.cta2_link,
            cta2_active: s.cta2_active ?? prev.cta2_active,
            hero_overlay_opacity: s.hero_overlay_opacity ?? prev.hero_overlay_opacity,
            hero_image_url: s.hero_image_url ?? '',
            hero_video_url: s.hero_video_url ?? '',
            hero_video_active: s.hero_video_active ?? '0',
            hero_mobile_video_url: s.hero_mobile_video_url ?? '',
            hero_mobile_poster_url: s.hero_mobile_poster_url ?? '',
            hero_mobile_video_active: s.hero_mobile_video_active ?? '0',
          }));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? ((e.target as HTMLInputElement).checked ? '1' : '0') : value,
    }));
  };

  const handleUpload = async (file: File, fieldName: string, accept: 'image' | 'video' | 'both') => {
    setUploadingField(fieldName);
    setError('');
    const token = sessionStorage.getItem('viva_admin_token');
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', accept === 'video' ? 'videos' : 'hero');

    try {
      const res = await fetch('/api/shared/upload_file.php', {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.message || 'Upload failed');
      setForm(prev => ({ ...prev, [fieldName]: data.url }));
    } catch (e: any) {
      setError(`Dosya yüklenemedi: ${e.message}`);
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/settings/update.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionStorage.getItem('viva_admin_token') ? { Authorization: `Bearer ${sessionStorage.getItem('viva_admin_token')}` } : {}),
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) throw new Error(data.message || 'Kaydedilemedi');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const MediaUploadField = ({
    label, fieldName, previewUrl, inputRef, accept, hint,
  }: {
    label: string; fieldName: string; previewUrl: string; inputRef: any; accept: 'image' | 'video'; hint?: string;
  }) => (
    <div>
      <label className="form-label">{label}</label>
      {hint && <p className="text-xs text-muted mb-2">{hint}</p>}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          name={fieldName}
          value={form[fieldName as keyof HeroSettings]}
          onChange={handleChange}
          placeholder="/uploads/hero.jpg ya da https://..."
          className="form-input flex-1"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploadingField === fieldName}
          className="btn-secondary px-4 py-2.5 whitespace-nowrap text-sm shrink-0"
        >
          {uploadingField === fieldName ? (
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 border border-primary/30 border-t-primary rounded-full animate-spin" />
              Yükleniyor...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
              </svg>
              Dosya Seç
            </span>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept === 'video' ? 'video/*' : 'image/*'}
          className="hidden"
          onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0], fieldName, accept); }}
        />
      </div>
      {previewUrl && (
        <div className="mt-3">
          {accept === 'video' ? (
            <div className="flex items-center gap-2 text-sm text-primary">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              <a href={getMediaUrl(previewUrl)} target="_blank" rel="noreferrer" className="underline truncate">
                {previewUrl}
              </a>
            </div>
          ) : (
            <img
              src={getMediaUrl(previewUrl)}
              alt="Önizleme"
              className="h-24 w-auto rounded-xl object-cover border border-sage/40"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48 rounded-xl" />
        {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Hero / Ana Sayfa</h1>
          <p className="text-muted text-sm mt-1">Ana sayfa hero bölümünü düzenleyin.</p>
        </div>
        <div className="flex gap-3">
          <a href="/" target="_blank" rel="noreferrer" className="btn-secondary text-sm py-2 px-4">
            Siteyi Gör →
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary text-sm py-2.5 px-6"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Kaydediliyor...
              </span>
            ) : saved ? (
              <span className="flex items-center gap-2">✅ Kaydedildi</span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                </svg>
                Kaydet
              </span>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-danger/10 border border-danger/30 text-danger text-sm">{error}</div>
      )}

      {/* Text Content */}
      <div className="bg-white rounded-3xl p-6 shadow-card space-y-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-sage/30 pb-4">
            <h2 className="font-bold text-text-dark">📝 Metin İçeriği</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm font-medium">Yazıları Göster</span>
              <input
                type="checkbox"
                name="hero_text_active"
                checked={form.hero_text_active === '1'}
                onChange={handleChange}
                className="toggle-checkbox"
              />
            </label>
          </div>

          <div className="flex items-center justify-between border-b border-sage/30 pb-4">
            <h2 className="font-bold text-text-dark">🖱️ Butonları Göster</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm font-medium">Butonları Göster</span>
              <input
                type="checkbox"
                name="hero_buttons_active"
                checked={form.hero_buttons_active === '1'}
                onChange={handleChange}
                className="toggle-checkbox"
              />
            </label>
          </div>
        </div>

        <div>
          <label className="form-label">Üst Etiket (Badge) <span className="text-xs text-muted font-normal">(Boş bırakılırsa gizlenir)</span></label>
          <input
            type="text"
            name="hero_badge_text"
            value={form.hero_badge_text}
            onChange={handleChange}
            className="form-input"
            placeholder="Tuzla Premium Wellness Studio"
          />
        </div>

        <div>
          <label className="form-label">Hero Başlık</label>
          <textarea
            name="hero_title"
            value={form.hero_title}
            onChange={handleChange}
            rows={2}
            placeholder="Bedenini Güçlendir,\nHayatını Dönüştür"
            className="form-textarea font-medium text-lg"
          />
          <p className="text-xs text-muted mt-1">Satır kesmek için \\n kullanabilirsiniz.</p>
        </div>

        <div>
          <label className="form-label">Hero Alt Metin</label>
          <textarea
            name="hero_description"
            value={form.hero_description}
            onChange={handleChange}
            rows={3}
            className="form-textarea"
          />
        </div>

        <div>
          <label className="form-label">Servis Etiketleri</label>
          <input
            type="text"
            name="hero_tags"
            value={form.hero_tags}
            onChange={handleChange}
            className="form-input"
            placeholder="Pilates, EMS, Yoga"
          />
          <p className="text-xs text-muted mt-1">Ana sayfada butonların üzerinde çıkan etiketler. Virgülle ayırarak yazın. Gizlemek için tamamen silebilirsiniz.</p>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="bg-white rounded-3xl p-6 shadow-card space-y-5">
        <h2 className="font-bold text-text-dark border-b border-sage/30 pb-4">🔘 CTA Butonları</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-4">
            <div className="flex items-center">
              <input type="checkbox" id="cta1_active" checked={form.cta1_active === '1'} onChange={e => setForm(prev => ({...prev, cta1_active: e.target.checked ? '1' : '0'}))} className="w-5 h-5 text-primary rounded focus:ring-primary border-gray-300" />
              <label htmlFor="cta1_active" className="ml-3 font-semibold text-text-dark cursor-pointer">Buton 1 Aktif</label>
            </div>
            <div>
              <label className="form-label">Buton 1 Metni</label>
              <input name="cta1_text" value={form.cta1_text} onChange={handleChange} className="form-input" placeholder="Ücretsiz Danışma Al" />
            </div>
            <div>
              <label className="form-label">Buton 1 Linki</label>
              <input name="cta1_link" value={form.cta1_link} onChange={handleChange} className="form-input" placeholder="/iletisim ya da https://wa.me/..." />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input type="checkbox" id="cta2_active" checked={form.cta2_active === '1'} onChange={e => setForm(prev => ({...prev, cta2_active: e.target.checked ? '1' : '0'}))} className="w-5 h-5 text-primary rounded focus:ring-primary border-gray-300" />
              <label htmlFor="cta2_active" className="ml-3 font-semibold text-text-dark cursor-pointer">Buton 2 Aktif</label>
            </div>
            <div>
              <label className="form-label">Buton 2 Metni</label>
              <input name="cta2_text" value={form.cta2_text} onChange={handleChange} className="form-input" placeholder="Hizmetleri Keşfet" />
            </div>
            <div>
              <label className="form-label">Buton 2 Linki</label>
              <input name="cta2_link" value={form.cta2_link} onChange={handleChange} className="form-input" placeholder="/hizmetler" />
            </div>
          </div>
        </div>
      </div>

      {/* Background Media - Desktop */}
      <div className="bg-white rounded-3xl p-6 shadow-card space-y-5">
        <h2 className="font-bold text-text-dark border-b border-sage/30 pb-4">🖥️ Masaüstü Arkaplan</h2>

        <MediaUploadField
          label="Hero Görsel"
          fieldName="hero_image_url"
          previewUrl={form.hero_image_url}
          inputRef={imageRef}
          accept="image"
          hint="Önerilen boyut: 1920×1080px. JPG/PNG/WebP"
        />

        <div className="border-t border-sage/30 pt-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <label className="form-label !mb-0">Video Arkaplan</label>
              <p className="text-xs text-muted">Video aktifse, görselin önüne geçer.</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  name="hero_video_active"
                  checked={form.hero_video_active === '1'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`w-10 h-6 rounded-full transition-colors ${form.hero_video_active === '1' ? 'bg-primary' : 'bg-sage'}`} />
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.hero_video_active === '1' ? 'translate-x-5 left-0' : 'left-1'}`} />
              </div>
              <span className="text-sm font-medium">{form.hero_video_active === '1' ? 'Aktif' : 'Pasif'}</span>
            </label>
          </div>

          <MediaUploadField
            label="Video Dosyası"
            fieldName="hero_video_url"
            previewUrl={form.hero_video_url}
            inputRef={videoRef}
            accept="video"
            hint="MP4 formatı önerilir. Maks 50MB."
          />
        </div>

        <div>
          <label className="form-label">Overlay Opaklığı: {parseFloat(form.hero_overlay_opacity) * 100}%</label>
          <input
            type="range"
            name="hero_overlay_opacity"
            value={form.hero_overlay_opacity}
            onChange={handleChange}
            min="0" max="0.9" step="0.05"
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted mt-1">
            <span>Şeffaf (0%)</span>
            <span>Koyu (90%)</span>
          </div>
        </div>
      </div>

      {/* Background Media - Mobile */}
      <div className="bg-white rounded-3xl p-6 shadow-card space-y-5">
        <h2 className="font-bold text-text-dark border-b border-sage/30 pb-4">📱 Mobil Arkaplan (Opsiyonel)</h2>
        <p className="text-sm text-muted">Mobil için ayrı video/poster kullanmak istemiyorsanız bu alanları boş bırakın.</p>

        <div className="flex items-center justify-between">
          <label className="form-label !mb-0">Mobil Video Aktif</label>
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                name="hero_mobile_video_active"
                checked={form.hero_mobile_video_active === '1'}
                onChange={handleChange}
                className="sr-only"
              />
              <div className={`w-10 h-6 rounded-full transition-colors ${form.hero_mobile_video_active === '1' ? 'bg-primary' : 'bg-sage'}`} />
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.hero_mobile_video_active === '1' ? 'translate-x-5 left-0' : 'left-1'}`} />
            </div>
            <span className="text-sm font-medium">{form.hero_mobile_video_active === '1' ? 'Aktif' : 'Pasif'}</span>
          </label>
        </div>

        <MediaUploadField
          label="Mobil Video"
          fieldName="hero_mobile_video_url"
          previewUrl={form.hero_mobile_video_url}
          inputRef={mobileVideoRef}
          accept="video"
          hint="Dikey formatlı kısa video önerilir (portrait 9:16)."
        />

        <MediaUploadField
          label="Mobil Poster (Önizleme)"
          fieldName="hero_mobile_poster_url"
          previewUrl={form.hero_mobile_poster_url}
          inputRef={mobilePosterRef}
          accept="image"
          hint="Video yüklenmeden önce gösterilecek görsel."
        />
      </div>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end pb-4">
        <button onClick={handleSave} disabled={saving} className="btn-gradient px-8 py-3.5">
          {saving ? 'Kaydediliyor...' : saved ? '✅ Kaydedildi' : 'Değişiklikleri Kaydet'}
        </button>
      </div>
    </div>
  );
};

export default HeroAdminPage;
