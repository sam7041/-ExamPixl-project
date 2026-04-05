import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Upload, 
  Maximize, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Image as ImageIcon, 
  Settings,
  ArrowRight,
  Info,
  Lock,
  Unlock,
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { cn } from '@/src/lib/utils';
import { useProcessor } from '@/src/hooks/useProcessor';
import { useSEO } from '@/src/hooks/useSEO';
import imageCompression from 'browser-image-compression';

const PRESETS = [
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Instagram Story', width: 1080, height: 1920 },
  { name: 'Facebook Cover', width: 820, height: 312 },
  { name: 'Twitter Header', width: 1500, height: 500 },
  { name: 'LinkedIn Banner', width: 1584, height: 396 },
  { name: 'YouTube Thumbnail', width: 1280, height: 720 },
  { name: 'Passport Size (India)', width: 413, height: 531 }, // 3.5x4.5cm at 300dpi
];

export default function SmartResize() {
  useSEO({
    title: 'Resize Image Online Free â€” Pixels, %, Presets',
    description: 'Resize images by pixel dimensions, percentage, or presets. Free online image resizer for social media, exam forms, and general use.',
    canonical: 'https://exampixl.vercel.app/image/resize',
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processedPreview, setProcessedPreview] = useState<string | null>(null);
  const [processedFile, setProcessedFile] = useState<File | null>(null);
  const { process, isProcessing, progress, error: workerError } = useProcessor();
  const [error, setError] = useState<string | null>(null);

  // Resize Settings
  const [resizeMode, setResizeMode] = useState<'pixels' | 'percentage' | 'preset'>('pixels');
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(50);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [quality, setQuality] = useState(0.9);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, WebP).');
      return;
    }
    setFile(selectedFile);
    setError(null);
    setProcessedPreview(null);
    setProcessedFile(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setWidth(img.width);
        setHeight(img.height);
        setPreview(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(selectedFile);
  }, []);

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (maintainAspectRatio && originalDimensions.width > 0) {
      setHeight(Math.round(val * (originalDimensions.height / originalDimensions.width)));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (maintainAspectRatio && originalDimensions.height > 0) {
      setWidth(Math.round(val * (originalDimensions.width / originalDimensions.height)));
    }
  };

  const applyPreset = (preset: { width: number, height: number }) => {
    setResizeMode('pixels');
    setWidth(preset.width);
    setHeight(preset.height);
    setMaintainAspectRatio(false);
  };

  const handleResize = async () => {
    if (!file) return;
    setError(null);

    try {
      let targetWidth = width;
      let targetHeight = height;

      if (resizeMode === 'percentage') {
        targetWidth = Math.round(originalDimensions.width * (percentage / 100));
        targetHeight = Math.round(originalDimensions.height * (percentage / 100));
      }

      const options = {
        maxWidthOrHeight: Math.max(targetWidth, targetHeight),
        useWebWorker: true,
        initialQuality: quality,
        fileType: outputFormat,
      };

      const compressed = await imageCompression(file, options);
      
      setProcessedFile(compressed);
      setProcessedPreview(URL.createObjectURL(compressed));

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0d9488', '#38bdf8', '#ffffff']
      });
    } catch (err) {
      setError('Failed to resize image. Please try again.');
    }
  };

  const downloadProcessed = () => {
    if (!processedFile) return;
    const url = URL.createObjectURL(processedFile);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Resized_${file?.name || 'image'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-4"
        >
          <Maximize size={14} />
          Image Utility
        </motion.div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Smart Resize</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Professional image resizing with pixel-perfect precision. Maintain quality while optimizing for any platform.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Main Workspace */}
        <div className="lg:col-span-8 space-y-6">
          {!file ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const dropped = e.dataTransfer.files[0];
                if (dropped) handleFile(dropped);
              }}
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-brand-700 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex flex-col items-center justify-center min-h-[380px] sm:min-h-[450px] rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all p-6 sm:p-10 lg:p-12 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                <div className="h-20 w-20 sm:h-24 sm:w-24 bg-brand-50 dark:bg-brand-900/20 rounded-2xl flex items-center justify-center text-brand-600 dark:text-brand-400 mb-6 sm:mb-8 group-hover:scale-110 transition-transform">
                  <Upload size={40} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">Drop your image here</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 sm:mb-10 max-w-sm mx-auto text-sm sm:text-base">
                  Supports JPG, PNG, and WebP. Your files are processed locally in your browser for maximum security.
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/20 transition-all hover:bg-brand-700"
                >
                  <Upload size={18} />
                  Choose Image
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Preview Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Original */}
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <ImageIcon size={18} className="text-slate-400" />
                      Original
                    </h3>
                    <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="aspect-square rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-800">
                    <img src={preview!} alt="Original" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Dimensions</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{originalDimensions.width} × {originalDimensions.height}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">File Size</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{formatSize(file.size)}</p>
                    </div>
                  </div>
                </div>

                {/* Processed */}
                <div className="rounded-3xl border border-brand-200 dark:border-brand-900/30 bg-brand-50/10 dark:bg-brand-900/5 p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-brand-600 dark:text-brand-400 flex items-center gap-2">
                      <CheckCircle2 size={18} />
                      Resized
                    </h3>
                    {processedFile && (
                      <button onClick={downloadProcessed} className="text-brand-600 dark:text-brand-400 hover:scale-110 transition-transform">
                        <Download size={20} />
                      </button>
                    )}
                  </div>
                  <div className="aspect-square rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden border border-brand-100 dark:border-brand-900/20 shadow-inner">
                    {processedPreview ? (
                      <motion.img 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        src={processedPreview} 
                        alt="Processed" 
                        className="max-w-full max-h-full object-contain" 
                      />
                    ) : (
                      <div className="text-slate-300 dark:text-slate-700 flex flex-col items-center gap-2">
                        <RefreshCw size={32} className={cn(isProcessing && "animate-spin")} />
                        <p className="text-xs font-medium">Preview will appear here</p>
                      </div>
                    )}
                  </div>
                  {processedFile && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
                        <p className="text-[10px] font-bold text-brand-400 uppercase mb-1">New Dimensions</p>
                        <p className="text-sm font-bold text-brand-600 dark:text-brand-400">
                          {resizeMode === 'percentage' 
                            ? `${Math.round(originalDimensions.width * (percentage/100))} × ${Math.round(originalDimensions.height * (percentage/100))}`
                            : `${width} × ${height}`
                          }
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
                        <p className="text-[10px] font-bold text-brand-400 uppercase mb-1">New Size</p>
                        <p className="text-sm font-bold text-brand-600 dark:text-brand-400">{formatSize(processedFile.size)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Presets Grid */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 lg:p-8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <LayoutGrid size={20} className="text-brand-600" />
                  Social Media & Document Presets
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      className="flex flex-col items-start p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-all text-left group"
                    >
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400">{preset.name}</span>
                      <span className="text-[10px] text-slate-400">{preset.width} × {preset.height} px</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-4">
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 lg:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                <Settings size={20} className="text-brand-600" />
                Resize Settings
              </h3>

              {/* Mode Selection */}
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-8">
                {(['pixels', 'percentage'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setResizeMode(mode)}
                    className={cn(
                      "flex-1 py-2.5 text-xs font-bold rounded-xl capitalize transition-all",
                      resizeMode === mode 
                        ? "bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm" 
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Dimension Inputs */}
              <div className="space-y-6">
                {resizeMode === 'pixels' ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Dimensions</label>
                      <button 
                        onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                        className={cn(
                          "flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold transition-all",
                          maintainAspectRatio 
                            ? "bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400" 
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                        )}
                      >
                        {maintainAspectRatio ? <Lock size={12} /> : <Unlock size={12} />}
                        Aspect Ratio
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Width (px)</span>
                        <input
                          type="number"
                          value={width}
                          onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-brand-500 outline-none text-sm font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Height (px)</span>
                        <input
                          type="number"
                          value={height}
                          onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-brand-500 outline-none text-sm font-bold"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Scale Percentage</label>
                      <span className="text-sm font-bold text-brand-600 dark:text-brand-400">{percentage}%</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="200"
                      value={percentage}
                      onChange={(e) => setPercentage(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                      <span>1%</span>
                      <span>100%</span>
                      <span>200%</span>
                    </div>
                  </div>
                )}

                {/* Quality & Format */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Quality</label>
                      <span className="text-sm font-bold text-brand-600 dark:text-brand-400">{Math.round(quality * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={quality}
                      onChange={(e) => setQuality(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Output Format</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['image/jpeg', 'image/png', 'image/webp'].map((format) => (
                        <button
                          key={format}
                          onClick={() => setOutputFormat(format as any)}
                          className={cn(
                            "py-2 rounded-xl text-[10px] font-bold transition-all border",
                            outputFormat === format 
                              ? "bg-brand-50 dark:bg-brand-900/30 border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400" 
                              : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400"
                          )}
                        >
                          {format.split('/')[1].toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  disabled={!file || isProcessing}
                  onClick={handleResize}
                  className={cn(
                    "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg",
                    file && !isProcessing
                      ? "bg-brand-600 text-white hover:bg-brand-700 shadow-brand-600/20"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  )}
                >
                  {isProcessing ? (
                    <RefreshCw size={20} className="animate-spin" />
                  ) : (
                    <>
                      <RefreshCw size={20} />
                      Resize Image
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Info Card */}
            <div className="rounded-3xl bg-slate-900 dark:bg-brand-900/20 p-6 text-white">
              <div className="flex items-center gap-2 mb-4 text-brand-400">
                <Info size={18} />
                <h4 className="font-bold text-sm">Pro Tip</h4>
              </div>
              <p className="text-xs text-slate-400 dark:text-brand-200/70 leading-relaxed">
                Use the <span className="text-white font-bold">Percentage</span> mode to quickly scale images for web use without calculating exact pixels. 75% is usually a sweet spot for quality and size.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Toast */}
      <AnimatePresence>
        {(error || workerError) && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-red-600 text-white shadow-2xl flex items-center gap-3"
          >
            <AlertCircle size={20} />
            <span className="text-sm font-bold">{error || workerError}</span>
            <button onClick={() => setError(null)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
