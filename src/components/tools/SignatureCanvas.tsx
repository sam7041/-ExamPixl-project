import React from 'react';
import { useSEO } from '@/src/hooks/useSEO';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Trash2, Download, Pen, CheckCircle2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import WhatsAppShare from '../WhatsAppShare';

interface ExamPreset {
  label: string;
  width: number;
  height: number;
  maxKB: number;
}

const PRESETS: ExamPreset[] = [
  { label: 'JEE Main', width: 354, height: 177 },
  { label: 'NEET UG', width: 354, height: 177 },
  { label: 'UPSC CSE', width: 354, height: 118 },
  { label: 'SSC CGL', width: 800, height: 200 },
  { label: 'IBPS PO', width: 800, height: 300 },
  { label: 'Custom', width: 400, height: 200 },
].map(p => ({ ...p, maxKB: 50 }));

export default function SignatureCanvas() {
  useSEO({
    title: 'Signature Canvas - Create Exam Signature Online',
    description: 'Draw and download a clean exam signature online with exact dimensions for JEE, NEET, UPSC, SSC, IBPS, and other forms.',
    canonical: 'https://exampixl.vercel.app/image/signature-canvas',
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [hasStroke, setHasStroke] = useState(false);
  const [preset, setPreset] = useState<ExamPreset>(PRESETS[0]);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2.5);
  const [customW, setCustomW] = useState(400);
  const [customH, setCustomH] = useState(200);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadSize, setDownloadSize] = useState(0);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const isCustom = preset.label === 'Custom';
  const canvasW = isCustom ? customW : preset.width;
  const canvasH = isCustom ? customH : preset.height;

  // Scale factor: canvas display is capped at ~500px wide
  const DISPLAY_MAX = 500;
  const scale = Math.min(1, DISPLAY_MAX / canvasW);

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasStroke(false);
    setDownloadUrl(null);
  }

  useEffect(() => { clearCanvas(); }, [canvasW, canvasH]); // eslint-disable-line

  function getPos(e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const t = e.touches[0];
      return {
        x: (t.clientX - rect.left) / scale,
        y: (t.clientY - rect.top) / scale,
      };
    }
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale,
    };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    const pos = getPos(e);
    if (!pos) return;
    setDrawing(true);
    lastPos.current = pos;
    const ctx = canvasRef.current!.getContext('2d')!;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, lineWidth / 2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    setHasStroke(true);
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    if (!drawing) return;
    const pos = getPos(e);
    if (!pos || !lastPos.current) return;
    const ctx = canvasRef.current!.getContext('2d')!;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
    setHasStroke(true);
  }

  function endDraw() {
    setDrawing(false);
    lastPos.current = null;
  }

  const exportSignature = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const blob = await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/png'));
    if (!blob) return;
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
    setDownloadSize(blob.size);
  }, [downloadUrl]);

  function downloadNow() {
    if (!downloadUrl) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `${preset.label.replace(/\s+/g, '_')}_signature.png`;
    a.click();
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Pen size={13} aria-hidden="true" />
            Exam Signature
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-3">Signature Canvas</h1>
          <p className="text-slate-500 max-w-md mx-auto">
            Draw your signature and export it as a white-background PNG at the exact size required by your exam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Controls */}
          <div className="space-y-5">
            <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Exam Preset</label>
              <div className="space-y-2">
                {PRESETS.map(p => (
                  <button
                    key={p.label}
                    onClick={() => { setPreset(p); setDownloadUrl(null); }}
                    className={cn(
                      'w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all',
                      preset.label === p.label
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    )}
                  >
                    {p.label}
                    {p.label !== 'Custom' && (
                      <span className={cn('text-xs font-normal ml-2', preset.label === p.label ? 'text-white/70' : 'text-slate-400')}>
                        {p.width}×{p.height}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {isCustom && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Width px</label>
                    <input
                      type="number" value={customW} min={100} max={1200}
                      onChange={e => setCustomW(+e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Height px</label>
                    <input
                      type="number" value={customH} min={50} max={600}
                      onChange={e => setCustomH(+e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Pen Settings</label>
              <div>
                <label className="text-[10px] text-slate-400 font-semibold">Ink color</label>
                <div className="flex items-center gap-3 mt-1">
                  <input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-9 w-12 cursor-pointer rounded-lg border border-slate-200" />
                  {['#000000', '#1e3a8a', '#7f1d1d'].map(c => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={cn('h-7 w-7 rounded-full border-2 transition-transform hover:scale-110', color === c ? 'border-brand-500 scale-110' : 'border-transparent')}
                      style={{ background: c }}
                      aria-label={`Use color ${c}`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-semibold">Line width: {lineWidth}px</label>
                <input
                  type="range" min={1} max={6} step={0.5} value={lineWidth}
                  onChange={e => setLineWidth(+e.target.value)}
                  className="w-full mt-1"
                />
              </div>
            </div>
          </div>

          {/* Canvas + result */}
          <div className="md:col-span-2 space-y-5">
            <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
                  {canvasW} × {canvasH} px
                </p>
                <button
                  onClick={clearCanvas}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={13} /> Clear
                </button>
              </div>

              {/* Canvas with checkerboard bg to show white correctly */}
              <div
                className="overflow-hidden rounded-2xl border-2 border-dashed border-slate-200"
                style={{ width: canvasW * scale, height: canvasH * scale, cursor: 'crosshair' }}
              >
                <canvas
                  ref={canvasRef}
                  width={canvasW}
                  height={canvasH}
                  style={{ width: canvasW * scale, height: canvasH * scale, display: 'block', background: '#fff', touchAction: 'none' }}
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={endDraw}
                  onMouseLeave={endDraw}
                  onTouchStart={startDraw}
                  onTouchMove={draw}
                  onTouchEnd={endDraw}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center">
                {hasStroke ? 'Looking good — click Export when done' : 'Start drawing your signature above'}
              </p>
            </div>

            {hasStroke && !downloadUrl && (
              <button
                onClick={exportSignature}
                className="w-full py-3 bg-brand-600 text-white rounded-2xl text-sm font-bold hover:bg-brand-700 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} /> Export Signature PNG
              </button>
            )}

            {downloadUrl && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <p className="text-sm font-black text-emerald-900">Signature ready</p>
                  <span className="text-xs text-emerald-600 ml-auto">{(downloadSize / 1024).toFixed(1)} KB · PNG</span>
                </div>
                <img src={downloadUrl} alt="Exported signature" className="w-full rounded-xl border border-emerald-100 bg-white" />
                <button
                  onClick={downloadNow}
                  className="w-full py-3 bg-emerald-500 text-white rounded-2xl text-sm font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={16} /> Download PNG
                </button>
                <WhatsAppShare
                  className="w-full justify-center"
                  message={`✍️ Made my ${preset.label} signature with ExamPixl — free exam tools!\nhttps://exampixl.vercel.app/image/signature-canvas`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
