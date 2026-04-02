import React from 'react';
import { Upload, FileText, X, Download, CheckCircle2, RefreshCw, Layers, Trash2, HardDrive } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import CloudPicker from '../../CloudPicker';
import WhatsAppShare from '../../WhatsAppShare';

interface PDFPreviewAreaProps {
  files: File[];
  preview: string | null;
  processedFile: { blob: Blob; name: string } | null;
  mode: string;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (files: File[]) => void;
  onRemoveFile: (idx: number) => void;
  onClearAll: () => void;
  onDownload: () => void;
  formatSize: (bytes: number) => string;
  thumbnails: string[];
  pagesToRemove: number[];
  onTogglePage: (idx: number) => void;
  ocrText: string;
}

export default function PDFPreviewArea({
  files,
  processedFile,
  mode,
  onDrop,
  onFileSelect,
  onRemoveFile,
  onClearAll,
  onDownload,
  formatSize,
  thumbnails,
  pagesToRemove,
  onTogglePage,
  ocrText
}: PDFPreviewAreaProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (files.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-red-700 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex flex-col items-center justify-center min-h-[450px] rounded-3xl border-2 border-dashed border-slate-200 bg-white hover:bg-slate-50 transition-all p-12 text-center overflow-hidden">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple={mode === 'merge' || mode === 'jpg-to-pdf'}
            accept={mode === 'jpg-to-pdf' ? 'image/*' : 'application/pdf'}
            onChange={(e) => e.target.files && onFileSelect(Array.from(e.target.files))}
          />
          
          <div className="relative z-10 flex flex-col items-center">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="h-24 w-24 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mb-8 group-hover:scale-110 transition-transform cursor-pointer shadow-lg shadow-red-500/10"
            >
              <Upload size={40} />
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
              Upload your {mode === 'jpg-to-pdf' ? 'images' : 'PDFs'}
            </h3>
            <p className="text-slate-500 mb-10 max-w-sm text-sm leading-relaxed mx-auto">
              {mode === 'jpg-to-pdf' 
                ? 'Drag & drop your images here, or use the cloud options below. Supports JPG, PNG, WebP.' 
                : 'Your files are processed locally in your browser. Secure and private.'}
            </p>

            <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-slate-200 hover:border-red-500 hover:bg-red-50/50 transition-all shadow-sm group/btn"
              >
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/btn:bg-red-100 group-hover/btn:text-red-600 transition-colors">
                  <HardDrive size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover/btn:text-red-600">Local</span>
              </button>
              
              <CloudPicker 
                onFileSelect={(f) => onFileSelect([f])} 
                onLocalClick={() => fileInputRef.current?.click()}
                allowedTypes={mode === 'jpg-to-pdf' ? ['.jpg', '.jpeg', '.png', '.webp'] : ['.pdf']} 
              />
            </div>
          </div>

          {/* Background Decoration */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]">
            <div className="absolute top-10 left-10"><FileText size={120} /></div>
            <div className="absolute bottom-10 right-10 rotate-12"><Upload size={120} /></div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
              <FileText size={18} />
            </div>
            <h3 className="font-bold text-slate-900">
              {files.length} {files.length === 1 ? 'File' : 'Files'} Selected
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-all"
              >
                <Upload size={14} />
                Local
              </button>
              <CloudPicker 
                onFileSelect={(f) => onFileSelect([f])} 
                onLocalClick={() => fileInputRef.current?.click()}
                allowedTypes={mode === 'jpg-to-pdf' ? ['.jpg', '.jpeg', '.png', '.webp'] : ['.pdf']} 
              />
            </div>
            <button 
              onClick={onClearAll}
              className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <Trash2 size={14} />
              Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {files.map((file, idx) => (
              <motion.div
                key={`${file.name}-${idx}`}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-red-500 shadow-sm">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{formatSize(file.size)}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onRemoveFile(idx)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <X size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {processedFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 text-center"
        >
          <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-emerald-500 mx-auto mb-4 shadow-sm">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-xl font-bold text-emerald-900 mb-2">Processing Complete!</h3>
          <p className="text-emerald-700/70 text-sm mb-6">Your file is ready for download.</p>
          <button
            onClick={onDownload}
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Download size={20} />
            Download {processedFile.name}
          </button>
          <WhatsAppShare className="mt-3" />
        </motion.div>
      )}

      {mode === 'organize' && thumbnails.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Layers size={20} className="text-red-500" />
            Page Organization
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {thumbnails.map((thumb, idx) => (
              <div 
                key={idx}
                onClick={() => onTogglePage(idx)}
                className={cn(
                  "relative aspect-[3/4] rounded-xl border-2 transition-all cursor-pointer overflow-hidden group",
                  pagesToRemove.includes(idx) 
                    ? "border-red-500 opacity-50 grayscale" 
                    : "border-slate-100 hover:border-red-200"
                )}
              >
                <img src={thumb} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                  <span className="text-[10px] font-bold text-white">Page {idx + 1}</span>
                </div>
                {pagesToRemove.includes(idx) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500/20">
                    <X size={24} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {ocrText && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Extracted Text</h3>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 max-h-[400px] overflow-y-auto">
            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono">{ocrText}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
