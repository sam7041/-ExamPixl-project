import React from 'react';
import { Settings2, RefreshCw, AlertCircle, Loader2, Lock, Unlock, Type, RotateCw, Layers, Trash2, Download, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface PDFToolControlsProps {
  mode: string;
  files: File[];
  isProcessing: boolean;
  processingStatus: string;
  progress: number;
  onProcess: () => void;
  error: string | null;
  compressionLevel: 'standard' | 'deep';
  setCompressionLevel: (level: 'standard' | 'deep') => void;
  quality: number;
  setQuality: (quality: number) => void;
  isGrayscale: boolean;
  setIsGrayscale: (isGrayscale: boolean) => void;
  targetMinKB: number;
  setTargetMinKB: (kb: number) => void;
  targetMaxKB: number;
  setTargetMaxKB: (kb: number) => void;
  password: string;
  setPassword: (password: string) => void;
  watermarkText: string;
  setWatermarkText: (text: string) => void;
  rotation: number;
  setRotation: (rotation: number) => void;
  pageNumberPosition: 'bottom-center' | 'bottom-right' | 'top-right';
  setPageNumberPosition: (pos: 'bottom-center' | 'bottom-right' | 'top-right') => void;
  pagesToRemove: number[];
}

export default function PDFToolControls({
  mode,
  files,
  isProcessing,
  processingStatus,
  progress,
  onProcess,
  error,
  compressionLevel,
  setCompressionLevel,
  quality,
  setQuality,
  isGrayscale,
  setIsGrayscale,
  targetMinKB,
  setTargetMinKB,
  targetMaxKB,
  setTargetMaxKB,
  password,
  setPassword,
  watermarkText,
  setWatermarkText,
  rotation,
  setRotation,
  pageNumberPosition,
  setPageNumberPosition,
  pagesToRemove
}: PDFToolControlsProps) {
  return (
    <div className="sticky top-24 space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl shadow-slate-200/50">
        <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
          <Settings2 size={20} className="text-red-500" />
          Tool Settings
        </h3>

        <div className="space-y-8">
          {mode === 'compress' && (
            <div className="space-y-6">
              <div className="flex p-1 bg-slate-100 rounded-2xl">
                {(['standard', 'deep'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setCompressionLevel(level)}
                    className={cn(
                      "flex-1 py-2.5 text-xs font-bold rounded-xl capitalize transition-all",
                      compressionLevel === level 
                        ? "bg-white text-red-600 shadow-sm" 
                        : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    {level} Compression
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700">Quality</label>
                  <span className="text-sm font-bold text-red-600">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
              </div>

              <label className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer group transition-all hover:bg-white hover:border-red-200">
                <input
                  type="checkbox"
                  checked={isGrayscale}
                  onChange={(e) => setIsGrayscale(e.target.checked)}
                  className="h-5 w-5 rounded-lg border-slate-300 text-red-600 focus:ring-red-500"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900">Grayscale</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Convert all pages to B&W</span>
                </div>
              </label>
            </div>
          )}

          {mode === 'protect' && (
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Lock size={16} className="text-red-500" />
                Set Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter strong password"
                className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-red-500 outline-none text-sm font-bold"
              />
            </div>
          )}

          {mode === 'unlock' && (
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Unlock size={16} className="text-red-500" />
                Current Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter PDF password"
                className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-red-500 outline-none text-sm font-bold"
              />
            </div>
          )}

          {mode === 'watermark' && (
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Type size={16} className="text-red-500" />
                Watermark Text
              </label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="e.g. CONFIDENTIAL"
                className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-red-500 outline-none text-sm font-bold"
              />
            </div>
          )}

          {mode === 'rotate' && (
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <RotateCw size={16} className="text-red-500" />
                Rotation Angle
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[90, 180, 270].map((angle) => (
                  <button
                    key={angle}
                    onClick={() => setRotation(angle)}
                    className={cn(
                      "py-3 rounded-xl text-xs font-bold transition-all border",
                      rotation === angle 
                        ? "bg-red-50 border-red-200 text-red-600" 
                        : "bg-white border-slate-100 text-slate-400"
                    )}
                  >
                    {angle}°
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === 'page-numbers' && (
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Layers size={16} className="text-red-500" />
                Position
              </label>
              <div className="grid grid-cols-1 gap-2">
                {(['bottom-center', 'bottom-right', 'top-right'] as const).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setPageNumberPosition(pos)}
                    className={cn(
                      "py-3 px-4 rounded-xl text-xs font-bold transition-all border text-left flex items-center justify-between",
                      pageNumberPosition === pos 
                        ? "bg-red-50 border-red-200 text-red-600" 
                        : "bg-white border-slate-100 text-slate-400"
                    )}
                  >
                    {pos.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    {pageNumberPosition === pos && <CheckCircle2 size={14} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-8 border-t border-slate-100">
            <button
              disabled={files.length === 0 || isProcessing}
              onClick={onProcess}
              className={cn(
                "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg",
                files.length > 0 && !isProcessing
                  ? "bg-red-600 text-white hover:bg-red-700 shadow-red-600/20"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              )}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  {processingStatus || 'Processing...'}
                </>
              ) : (
                <>
                  <RefreshCw size={20} />
                  Process {files.length > 1 ? `${files.length} Files` : 'File'}
                </>
              )}
            </button>

            {isProcessing && progress > 0 && (
              <div className="mt-4 space-y-2">
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-red-500"
                  />
                </div>
                <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">{progress}% Complete</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3"
          >
            <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs font-bold text-red-900 leading-relaxed">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
