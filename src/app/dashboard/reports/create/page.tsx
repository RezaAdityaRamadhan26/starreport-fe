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
    <div className="animate-fade-in mx-auto max-w-2xl space-y-6">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Kembali
      </button>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Buat Laporan</h1>
        <p className="mt-1 text-sm text-muted">Sampaikan keluhan atau saran Anda.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <button
              onClick={() => { if (s.id < step || canNext()) setStep(s.id); }}
              className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                step === s.id
                  ? 'bg-emerald-50 text-emerald-700'
                  : step > s.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-input-bg text-muted/80'
              }`}
            >
              {step > s.id ? <Check className="h-3 w-3" /> : <s.icon className="h-3 w-3" />}
              {s.label}
            </button>
            {i < steps.length - 1 && <div className="h-px w-8 bg-slate-200" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="card-base rounded-2xl p-8">
        {/* Step 1: Info */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label htmlFor="report-header" className="mb-1.5 block text-[13px] font-medium text-muted">Judul Laporan</label>
              <input id="report-header" type="text" value={header} onChange={(e) => setHeader(e.target.value)}
                placeholder="Contoh: Jalan rusak di daerah X" className="input-base" />
            </div>
            <div>
              <label htmlFor="report-category" className="mb-1.5 block text-[13px] font-medium text-muted">Kategori</label>
              <select id="report-category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input-base">
                <option value="">Pilih kategori</option>
                {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.category_name}</option>))}
              </select>
            </div>
            <div>
              <label htmlFor="report-body" className="mb-1.5 block text-[13px] font-medium text-muted">Isi Laporan</label>
              <textarea id="report-body" value={body} onChange={(e) => setBody(e.target.value)}
                placeholder="Jelaskan laporan Anda secara detail..." rows={5} className="input-base resize-none" />
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-[13px] font-medium text-muted">Tentukan lokasi kejadian</p>
            <p className="text-xs text-muted mb-2">Geser peta untuk menentukan titik lokasi yang tepat.</p>
            <MapPicker position={location} onPositionChange={setLocation} height="300px" />
          </div>
        )}

        {/* Step 3: Upload */}
        {step === 3 && (
          <div>
            <label className="mb-2 block text-[13px] font-medium text-muted">Lampiran Gambar (opsional)</label>
            {imagePreview ? (
              <div className="relative overflow-hidden rounded-xl border border-border">
                <img src={imagePreview} alt="Preview" className="max-h-56 w-full object-cover" />
                <button type="button" onClick={removeImage}
                  className="absolute right-2 top-2 rounded-full bg-card p-1.5 text-muted shadow-sm transition-colors hover:text-red-500">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-background px-6 py-12 transition-colors hover:border-emerald-300 hover:bg-emerald-50/30"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                  <Upload className="h-5 w-5 text-emerald-500" />
                </div>
                <p className="mt-3 text-sm font-medium text-muted">Drag & drop atau klik untuk upload</p>
                <p className="mt-1 text-[12px] text-muted/80">JPG, PNG, atau GIF (maks 5MB)</p>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="report-image" />
              </label>
            )}
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-4">
            <p className="text-sm text-muted">Periksa kembali laporan Anda sebelum mengirim.</p>
            <div className="space-y-3 rounded-xl bg-background p-5">
              <div><p className="text-[11px] font-medium uppercase tracking-wider text-muted/80">Judul</p><p className="mt-0.5 text-sm font-medium text-foreground">{header}</p></div>
              <div><p className="text-[11px] font-medium uppercase tracking-wider text-muted/80">Kategori</p><p className="mt-0.5 text-sm text-muted">{selectedCategory?.category_name || '-'}</p></div>
              <div><p className="text-[11px] font-medium uppercase tracking-wider text-muted/80">Isi Laporan</p><p className="mt-0.5 whitespace-pre-wrap text-sm text-muted">{body}</p></div>
              <div><p className="text-[11px] font-medium uppercase tracking-wider text-muted/80">Lokasi</p><p className="mt-0.5 text-sm text-muted">{location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : '-'}</p></div>
              {imagePreview && (
                <div><p className="text-[11px] font-medium uppercase tracking-wider text-muted/80">Lampiran</p><img src={imagePreview} alt="Preview" className="mt-1 max-h-32 rounded-lg object-cover" /></div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="btn-ghost rounded-lg text-[13px]">
              <ArrowLeft className="h-3.5 w-3.5" /> Sebelumnya
            </button>
          ) : <div />}

          {step < 4 ? (
            <button onClick={() => setStep(step + 1)} disabled={!canNext()} className="btn-primary rounded-lg text-[13px] disabled:opacity-40">
              Lanjut <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={isLoading} className="btn-primary rounded-lg text-[13px]" id="submit-report">
              {isLoading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : 'Kirim Laporan'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
