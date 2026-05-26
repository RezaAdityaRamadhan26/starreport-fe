'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createReport } from '@/services/reportService';
import { getCategories } from '@/services/categoryService';
import type { Category } from '@/lib/types';
import { ArrowLeft, ArrowRight, Upload, X, Check, FileText, Image as ImageIcon, Eye, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('@/components/MapPicker'), { ssr: false });

const steps = [
  { id: 1, label: 'Informasi', icon: FileText },
  { id: 2, label: 'Lokasi', icon: MapPin },
  { id: 3, label: 'Lampiran', icon: ImageIcon },
  { id: 4, label: 'Tinjauan', icon: Eye },
];

export default function CreateReportPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [header, setHeader] = useState('');
  const [body, setBody] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getCategories().then((res) => {
      if (res.success && res.data) setCategories(res.data);
    });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => { setImage(null); setImagePreview(null); };

  const canNext = () => {
    if (step === 1) return header.trim() && body.trim() && categoryId;
    if (step === 2) return location !== null;
    return true;
  };

  const handleSubmit = async () => {
    if (!header.trim() || !body.trim() || !categoryId || !location) {
      toast.error('Lengkapi semua field terlebih dahulu');
      return;
    }
    setIsLoading(true);
    try {
      const res = await createReport({
        header, body, category_id: Number(categoryId), image: image || undefined,
        latitude: location.latitude, longitude: location.longitude,
      });
      if (res.success) {
        toast.success('Laporan berhasil dikirim!');
        router.push('/dashboard/my-reports');
      } else {
        toast.error(res.message || 'Gagal membuat laporan');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategory = categories.find((c) => String(c.id) === categoryId);

  return (
    <div style={{ maxWidth: '42rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <button onClick={() => router.back()} className="ds-back-btn">
        <ArrowLeft className="h-3.5 w-3.5" /> Kembali
      </button>

      <div className="ds-page-header">
        <h1 className="ds-page-title">Buat Laporan</h1>
        <p className="ds-page-subtitle">Sampaikan keluhan atau saran Anda.</p>
      </div>

      {/* Step indicator */}
      <div className="ds-steps">
        {steps.map((s, i) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => { if (s.id < step || canNext()) setStep(s.id); }}
              className={`ds-step ${
                step === s.id ? 'ds-step-current' : step > s.id ? 'ds-step-done' : 'ds-step-upcoming'
              }`}
            >
              {step > s.id ? <Check className="h-3 w-3" /> : <s.icon className="h-3 w-3" />}
              {s.label}
            </button>
            {i < steps.length - 1 && <div className="ds-step-divider" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="ds-card" style={{ padding: '2rem' }}>
        {/* Step 1: Info */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="auth-field">
              <label htmlFor="report-header" className="auth-label">Judul Laporan</label>
              <input id="report-header" type="text" value={header} onChange={(e) => setHeader(e.target.value)}
                placeholder="Contoh: Jalan rusak di daerah X" className="auth-input" />
            </div>
            <div className="auth-field">
              <label htmlFor="report-category" className="auth-label">Kategori</label>
              <select id="report-category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="ds-select" style={{ width: '100%' }}>
                <option value="">Pilih kategori</option>
                {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.category_name}</option>))}
              </select>
            </div>
            <div className="auth-field">
              <label htmlFor="report-body" className="auth-label">Isi Laporan</label>
              <textarea id="report-body" value={body} onChange={(e) => setBody(e.target.value)}
                placeholder="Jelaskan laporan Anda secara detail..." rows={5} className="auth-input" style={{ resize: 'none', minHeight: '120px' }} />
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--muted)' }}>Tentukan lokasi kejadian</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>Geser peta untuk menentukan titik lokasi yang tepat.</p>
            </div>
            <MapPicker position={location} onPositionChange={setLocation} height="300px" />
          </div>
        )}

        {/* Step 3: Upload */}
        {step === 3 && (
          <div>
            <p className="auth-label" style={{ marginBottom: '0.5rem' }}>Lampiran Gambar (opsional)</p>
            {imagePreview ? (
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                <img src={imagePreview} alt="Preview" style={{ maxHeight: '14rem', width: '100%', objectFit: 'cover' }} />
                <button type="button" onClick={removeImage}
                  style={{ position: 'absolute', right: '0.5rem', top: '0.5rem', borderRadius: '50%', background: 'var(--card)', border: 'none', padding: '0.375rem', cursor: 'pointer', color: 'var(--muted)', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className="ds-dropzone">
                <div className="ds-dropzone-icon">
                  <Upload className="h-5 w-5" />
                </div>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--muted)' }}>Drag & drop atau klik untuk upload</p>
                <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--muted)' }}>JPG, PNG, atau GIF (maks 5MB)</p>
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} id="report-image" />
              </label>
            )}
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Periksa kembali laporan Anda sebelum mengirim.</p>
            <div className="ds-review">
              <div><p className="ds-review-label">Judul</p><p className="ds-review-value">{header}</p></div>
              <div><p className="ds-review-label">Kategori</p><p className="ds-review-value ds-review-value-muted">{selectedCategory?.category_name || '-'}</p></div>
              <div><p className="ds-review-label">Isi Laporan</p><p className="ds-review-value ds-review-value-muted" style={{ whiteSpace: 'pre-wrap' }}>{body}</p></div>
              <div><p className="ds-review-label">Lokasi</p><p className="ds-review-value ds-review-value-muted">{location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : '-'}</p></div>
              {imagePreview && (
                <div><p className="ds-review-label">Lampiran</p><img src={imagePreview} alt="Preview" style={{ marginTop: '0.25rem', maxHeight: '8rem', borderRadius: '0.5rem', objectFit: 'cover' }} /></div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="ds-back-btn">
              <ArrowLeft className="h-3.5 w-3.5" /> Sebelumnya
            </button>
          ) : <div />}

          {step < 4 ? (
            <button onClick={() => setStep(step + 1)} disabled={!canNext()} className="auth-submit" style={{ width: 'auto', padding: '0.5rem 1.25rem', fontSize: '0.8125rem', borderRadius: '0.625rem', opacity: canNext() ? 1 : 0.4 }}>
              Lanjut <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={isLoading} className="auth-submit" style={{ width: 'auto', padding: '0.5rem 1.25rem', fontSize: '0.8125rem', borderRadius: '0.625rem' }} id="submit-report">
              {isLoading ? <div className="auth-spinner" /> : 'Kirim Laporan'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
