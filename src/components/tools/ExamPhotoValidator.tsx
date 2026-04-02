import React from 'react';
import { useSEO } from '@/src/hooks/useSEO';
import { useState, useRef, useCallback } from 'react';
import { Upload, CheckCircle2, XCircle, AlertCircle, Download, RefreshCw, Sparkles } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import WhatsAppShare from '../WhatsAppShare';

interface ExamPreset {
  name: string;
  widthPx: number;
  heightPx: number;
  minKB: number;
  maxKB: number;
  background: string;
  notes: string;
}

const EXAMS: Record<string, ExamPreset> = {
  'JEE Main': {
    name: 'JEE Main',
    widthPx: 276, heightPx: 354,
    minKB: 10, maxKB: 200,
    background: 'White / Off-white',
    notes: 'Face should cover 50–80% of the frame. No caps or goggles.',
  },
  'NEET UG': {
    name: 'NEET UG',
    widthPx: 276, heightPx: 354,
    minKB: 10, maxKB: 200,
    background: 'White',
    notes: 'Light-coloured background. No spectacles allowed.',
  },
  'UPSC CSE': {
    name: 'UPSC CSE',
    widthPx: 276, heightPx: 354,
    minKB: 20, maxKB: 300,
    background: 'Light-coloured',
    notes: 'Passport-size photo. Recent photograph required.',
  },
  'SSC CGL / CHSL': {
    name: 'SSC CGL / CHSL',
    widthPx: 276, heightPx: 354,
    minKB: 4, maxKB: 100,
    background: 'White',
    notes: 'JPEG only. Recent photograph, no filters.',
  },
  'IBPS PO / Clerk': {
    name: 'IBPS PO / Clerk',
    widthPx: 354, heightPx: 472,
    minKB: 20, maxKB: 50,
    background: 'White',
    notes: 'File size is strict. Compress carefully.',
  },
  'CUET UG': {
    name: 'CUET UG',
    widthPx: 276, heightPx: 354,
    minKB: 10, maxKB: 200,
    background: 'White / Off-white',
    notes: 'JPEG format. Clear frontal face photo.',
  },
  'CAT': {
    name: 'CAT',
    widthPx: 276, heightPx: 354,
    minKB: 10, maxKB: 80,
    background: 'White',
    notes: 'Recent photograph. Face clearly visible.',
  },
  'GATE': {
    name: 'GATE',
    widthPx: 240, heightPx: 320,
    minKB: 5, maxKB: 200,
    background: 'White / Light',
    notes: 'JPEG only. Recent photo with clear face.',
  },
};

interface Check {
  label: string;
  pass: boolean;
  detail: string;
}

export default function ExamPhotoValidator() {
  useSEO({
    title: 'Exam Photo Validator – Auto-resize for JEE, NEET, UPSC, SSC',
    description: 'Free online tool to check and auto-fix your passport photo for JEE Main, NEET UG, UPSC CSE, SSC, IBPS and 8+ exams. Resize, set white background, meet file size limits instantly.',
    canonical: 'https://exampixl.com/image/exam-photo',
  });
  const [exam, setExam] = useState<string>('JEE Main');
  const [original, setOriginal] = useState<{ file: File; url: string; w: number; h: number } | null>(null);
  const [fixedUrl, setFixedUrl] = useState<string | null>(null);
  const [fixedSize, setFixedSize] = useState<number>(0);
  const [checks, setChecks] = useState<Check[]>([]);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const preset = EXAMS[exam];

  const runChecks = useCallback((file: File, w: number, h: number): Check[] => {
    const sizeKB = file.size / 1024;
    return [
      {
        label: 'File format',
        pass: file.type === 'image/jpeg' || file.type === 'image/jpg',
        detail: file.type === 'image/jpeg' ? 'JPEG ✓' : `${file.type} — must be JPEG`,
      },
      {
        label: 'File size',
        pass: sizeKB >= preset.minKB && sizeKB <= preset.maxKB,
        detail: `${sizeKB.toFixed(1)} KB (allowed ${preset.minKB}–${preset.maxKB} KB)`,
      },
      {
        label: 'Width',
        pass: Math.abs(w - preset.widthPx) <= 10,
        detail: `${w}px (target ${preset.widthPx}px)`,
      },
      {
        label: 'Height',
        pass: Math.abs(h - preset.heightPx) <= 10,
        detail: `${h}px (target ${preset.heightPx}px)`,
      },
    ];
  }, [preset]);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setOriginal({ file, url, w: img.naturalWidth, h: img.naturalHeight });
      setChecks(runChecks(file, img.naturalWidth, img.naturalHeight));
      setFixedUrl(null);
    };
    img.src = url;
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const synth = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
    onFileChange(synth);
  }

  async function autoFix() {
    if (!original) return;
    setProcessing(true);

    await new Promise(r => setTimeout(r, 50)); // let UI update

    const canvas = document.createElement('canvas');
    canvas.width = preset.widthPx;
    canvas.height = preset.heightPx;
    const ctx = canvas.getContext('2d')!;

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw image scaled to cover (center crop)
    const img = new Image();
    img.src = original.url;
    await new Promise(r => { img.onload = r; });

    const scale = Math.max(preset.widthPx / img.naturalWidth, preset.heightPx / img.naturalHeight);
    const sw = img.naturalWidth * scale;
    const sh = img.naturalHeight * scale;
    const sx = (preset.widthPx - sw) / 2;
    const sy = (preset.heightPx - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh);

    // Export as JPEG, try to hit target size range
    let quality = 0.92;
    let blob: Blob | null = null;

    for (let q = quality; q >= 0.4; q -= 0.05) {
      blob = await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/jpeg', q));
      if (!blob) break;
      const kb = blob.size / 1024;
      if (kb >= preset.minKB && kb <= preset.maxKB) break;
      if (kb < preset.minKB) break; // can't go lower
    }

    if (!blob) { setProcessing(false); return; }

    const url = URL.createObjectURL(blob);
    setFixedUrl(url);
    setFixedSize(blob.size);
    setProcessing(false);
  }

  function downloadFixed() {
    if (!fixedUrl) return;
    const a = document.createElement('a');
    a.href = fixedUrl;
    a.download = `${exam.replace(/\s+/g, '_')}_photo.jpg`;
    a.click();
  }

  const passed = checks.filter(c => c.pass).length;
  const allPass = passed === checks.length && checks.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={13} aria-hidden="true" />
            India Exam Ready
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-3">Exam Photo Validator</h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Upload your photo, select your exam — we'll check every requirement and auto-fix it to the exact specs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left: upload + exam select */}
          <div className="lg:col-span-3 space-y-6">

            {/* Exam selector */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
                Select Exam
              </label>
              <select
                value={exam}
                onChange={e => { setExam(e.target.value); setFixedUrl(null); if (original) setChecks(runChecks(original.file, original.w, original.h)); }}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {Object.keys(EXAMS).map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>

              {/* Spec table */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                {[
                  ['Dimensions', `${preset.widthPx} × ${preset.heightPx} px`],
                  ['File size', `${preset.minKB}–${preset.maxKB} KB`],
                  ['Format', 'JPEG'],
                  ['Background', preset.background],
                ].map(([k, v]) => (
                  <div key={k} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-slate-400 font-semibold mb-0.5">{k}</p>
                    <p className="text-slate-800 font-black">{v}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-400 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                💡 {preset.notes}
              </p>
            </div>

            {/* Upload area */}
            <div
              onDrop={onDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="bg-white rounded-3xl border-2 border-dashed border-slate-200 hover:border-brand-400 transition-colors p-10 text-center cursor-pointer"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={onFileChange}
              />
              {original ? (
                <div className="flex items-center gap-6">
                  <img
                    src={original.url}
                    alt="Uploaded photo"
                    className="w-24 h-28 object-cover rounded-xl border border-slate-100 shadow"
                  />
                  <div className="text-left">
                    <p className="font-bold text-slate-900 text-sm mb-1">{original.file.name}</p>
                    <p className="text-xs text-slate-400">{original.w} × {original.h}px · {(original.file.size / 1024).toFixed(1)} KB</p>
                    <button className="mt-3 text-xs text-brand-600 font-bold flex items-center gap-1 hover:text-brand-700">
                      <RefreshCw size={12} /> Change photo
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Upload size={32} className="mx-auto text-slate-300 mb-3" aria-hidden="true" />
                  <p className="font-bold text-slate-700 mb-1">Drop your photo here</p>
                  <p className="text-xs text-slate-400">JPG, PNG, WebP supported</p>
                </>
              )}
            </div>
          </div>

          {/* Right: checklist + result */}
          <div className="lg:col-span-2 space-y-6">

            {/* Checklist */}
            {checks.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Validation</h2>
                  <span className={cn(
                    'text-xs font-black px-2.5 py-1 rounded-full',
                    allPass ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  )}>
                    {passed}/{checks.length} passed
                  </span>
                </div>
                <div className="space-y-3">
                  {checks.map(c => (
                    <div key={c.label} className={cn(
                      'flex items-start gap-3 p-3 rounded-xl',
                      c.pass ? 'bg-green-50' : 'bg-red-50'
                    )}>
                      {c.pass
                        ? <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                        : <XCircle size={16} className="text-red-500 mt-0.5 shrink-0" />}
                      <div>
                        <p className="text-xs font-black text-slate-800">{c.label}</p>
                        <p className="text-[11px] text-slate-500">{c.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {!allPass && (
                  <button
                    onClick={autoFix}
                    disabled={processing}
                    className="mt-5 w-full py-3 bg-brand-600 text-white rounded-2xl text-sm font-bold hover:bg-brand-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Fixing...</>
                    ) : (
                      <><Sparkles size={16} /> Auto-Fix for {exam}</>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Fixed result */}
            {fixedUrl && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 size={20} className="text-emerald-500" />
                  <h2 className="text-sm font-black text-emerald-900">Photo Ready!</h2>
                </div>
                <img
                  src={fixedUrl}
                  alt="Fixed exam photo"
                  className="w-full rounded-xl border border-emerald-100 mb-4 shadow"
                />
                <p className="text-xs text-emerald-700 mb-4">
                  {preset.widthPx} × {preset.heightPx}px · {(fixedSize / 1024).toFixed(1)} KB · JPEG
                </p>
                <button
                  onClick={downloadFixed}
                  className="w-full py-3 bg-emerald-500 text-white rounded-2xl text-sm font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 mb-3"
                >
                  <Download size={16} />
                  Download Photo
                </button>
                <WhatsAppShare
                  className="w-full justify-center"
                  message={`✅ Just fixed my ${exam} photo in seconds using ExamPixl — free exam photo tool!\nhttps://exampixl.com/image/exam-photo`}
                />
              </div>
            )}

            {!original && (
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-brand-500 mt-0.5 shrink-0" />
                  <div className="text-xs text-slate-500 space-y-1">
                    <p className="font-bold text-slate-700">How it works</p>
                    <p>1. Select your exam from the dropdown</p>
                    <p>2. Upload your passport photo</p>
                    <p>3. We check size, dimensions, and format</p>
                    <p>4. Hit Auto-Fix to resize + set white background</p>
                    <p>5. Download the exam-ready JPEG</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
