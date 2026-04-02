import React, { useState, useCallback, useEffect } from 'react';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import {
  FileText, Files, Scissors, RotateCw, Lock, Unlock, Type, Hash,
  Trash2, Layout, Sparkles, FileImage, FileDown, FileUp, FileSearch,
} from 'lucide-react';
import SubNav from './SubNav';
import { useProcessor } from '@/src/hooks/useProcessor';
import { useFileContext } from '@/src/context/FileContext';
import PDFPreviewArea from './pdf/PDFPreviewArea';
import PDFToolControls from './pdf/PDFToolControls';
import { useSEO } from '@/src/hooks/useSEO';

// Match the installed pdfjs-dist version exactly
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url,
).toString();

const pdfNavItems = [
  { name: 'Compress', href: '/pdf/compress', icon: FileDown },
  { name: 'Merge', href: '/pdf/merge', icon: Files },
  { name: 'Split', href: '/pdf/split', icon: Scissors },
  { name: 'JPG → PDF', href: '/pdf/from-jpg', icon: FileImage },
  { name: 'Rotate', href: '/pdf/rotate', icon: RotateCw },
  { name: 'Watermark', href: '/pdf/watermark', icon: Type },
  { name: 'Page Numbers', href: '/pdf/page-numbers', icon: Hash },
  { name: 'Remove Pages', href: '/pdf/remove-pages', icon: Trash2 },
  { name: 'Organize', href: '/pdf/organize', icon: Layout },
  { name: 'Protect', href: '/pdf/protect', icon: Lock },
  { name: 'Unlock', href: '/pdf/unlock', icon: Unlock },
  { name: 'AI Summary', href: '/pdf/ai-summary', icon: Sparkles },
  { name: 'PDF → Text', href: '/pdf/to-text', icon: FileText },
];

type ToolMode =
  | 'compress' | 'pdf-to-jpg' | 'jpg-to-pdf' | 'split' | 'merge'
  | 'rotate' | 'protect' | 'unlock' | 'watermark' | 'organize'
  | 'page-numbers' | 'pdf-to-text' | 'scan' | 'pdf-to-word' | 'sign'
  | 'edit' | 'html-to-pdf' | 'repair' | 'to-ppt' | 'to-excel'
  | 'to-pdfa' | 'remove-pages' | 'extract-pages' | 'crop' | 'redact'
  | 'compare' | 'ai-summary' | 'translate' | 'from-word' | 'from-ppt'
  | 'from-excel' | 'range-compress';

interface PDFProcessorProps {
  title: string;
  description: string;
  initialMode?: ToolMode;
}

const PDF_SEO: Record<string, { title: string; description: string }> = {
  compress:     { title: 'Compress PDF Free Online', description: 'Reduce PDF file size online for free. No uploads to server — all processing in your browser. Perfect for email, WhatsApp, and exam portals.' },
  merge:        { title: 'Merge PDF Files Free Online', description: 'Combine multiple PDF files into one document instantly. Free, browser-based, no sign-up required.' },
  split:        { title: 'Split PDF Free Online', description: 'Split a PDF into individual pages or extract specific pages. Free online tool, works in your browser.' },
  'pdf-to-jpg': { title: 'PDF to JPG Converter Free', description: 'Convert every page of your PDF to high-quality JPG images online. Free and instant — no account needed.' },
  'jpg-to-pdf': { title: 'JPG to PDF Converter Free', description: 'Convert JPG images to PDF online for free. Combine multiple photos into one PDF document instantly.' },
  rotate:       { title: 'Rotate PDF Pages Free Online', description: 'Rotate PDF pages 90°, 180° or 270° instantly. Free online PDF rotator — no software needed.' },
  watermark:    { title: 'Add Watermark to PDF Free', description: 'Stamp text or image watermarks on your PDF pages online. Free, fast, and secure — files stay on your device.' },
  protect:      { title: 'Password Protect PDF Free', description: 'Add password protection to your PDF online. Keep your documents secure with AES encryption.' },
  unlock:       { title: 'Unlock PDF — Remove Password Free', description: 'Remove password protection from your PDF online for free. Works in your browser, no uploads.' },
  organize:     { title: 'Organize PDF Pages Online Free', description: 'Reorder, rotate, or delete pages from your PDF. Drag-and-drop PDF organizer — free, no sign-up.' },
  sign:         { title: 'Sign PDF Online Free', description: 'Add your electronic signature to any PDF document online. Free e-signature tool, no account needed.' },
  'to-text':    { title: 'PDF to Text — Extract Text from PDF Free', description: 'Extract text from any PDF online for free. Works on scanned PDFs too. Browser-based OCR tool.' },
  'ai-summary': { title: 'AI PDF Summarizer — Summarize PDF with AI', description: 'Get an instant AI-generated summary of any PDF document. Free AI summarizer powered by Gemini.' },
  'page-numbers': { title: 'Add Page Numbers to PDF Free', description: 'Add page numbers to your PDF at custom positions — bottom center, bottom right, or top right. Free online tool.' },
  'remove-pages': { title: 'Remove Pages from PDF Free Online', description: 'Delete unwanted pages from your PDF document online. Free page remover, no software needed.' },
};


export default function PDFProcessor({ title, description, initialMode = 'compress' }: PDFProcessorProps) {
  const [mode] = useState<ToolMode>(initialMode);
  const seo = PDF_SEO[mode] ?? { title, description };
  useSEO({ title: seo.title, description: seo.description, canonical: `https://exampixl.com/pdf/${mode}` });
  const [files, setFiles] = useState<File[]>([]);
  const [processedFile, setProcessedFile] = useState<{ blob: Blob; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState('');
  const [localProgress, setProgress] = useState(0);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [ocrText, setOcrText] = useState('');

  // Settings
  const [compressionLevel, setCompressionLevel] = useState<'standard' | 'deep'>('standard');
  const [quality, setQuality] = useState(0.6);
  const [isGrayscale, setIsGrayscale] = useState(false);
  const [targetMinKB, setTargetMinKB] = useState(20);
  const [targetMaxKB, setTargetMaxKB] = useState(100);
  const [password, setPassword] = useState('');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [rotation, setRotation] = useState(90);
  const [pageNumberPosition, setPageNumberPosition] = useState<'bottom-center' | 'bottom-right' | 'top-right'>('bottom-center');
  const [pagesToRemove, setPagesToRemove] = useState<number[]>([]);

  const { isProcessing } = useProcessor();
  const { droppedFile, setDroppedFile } = useFileContext();

  useEffect(() => {
    if (droppedFile?.type === 'application/pdf') {
      handleFiles([droppedFile]);
      setDroppedFile(null);
    }
  }, [droppedFile]); // eslint-disable-line

  const handleFiles = useCallback((selected: File[]) => {
    const valid = selected.filter(f =>
      mode === 'jpg-to-pdf'
        ? f.type.startsWith('image/')
        : f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );
    if (!valid.length) {
      setError(mode === 'jpg-to-pdf' ? 'Please upload image files.' : 'Please upload valid PDF files.');
      return;
    }
    setFiles(prev => (mode === 'merge' || mode === 'jpg-to-pdf') ? [...prev, ...valid] : valid);
    setProcessedFile(null);
    setError(null);
    if (mode === 'organize' && valid[0]) generateThumbnails(valid[0]);
  }, [mode]);

  const generateThumbnails = useCallback(async (file: File) => {
    try {
      const buf = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: buf }).promise;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const thumbs: string[] = [];

      for (let i = 1; i <= Math.min(pdf.numPages, 20); i++) {
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale: 0.3 });
        canvas.width = vp.width;
        canvas.height = vp.height;
        await page.render({ canvasContext: ctx, viewport: vp, canvas }).promise;
        thumbs.push(canvas.toDataURL());
      }
      setThumbnails(thumbs);
    } catch (e) {
      // Thumbnail generation failed, continue without thumbnails
    }
  }, []);

  const extractText = async (file: File): Promise<string> => {
    const buf = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: buf }).promise;
    const parts: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const tc = await page.getTextContent();
      parts.push(tc.items.map((it: any) => it.str).join(' '));
    }
    return parts.join('\n\n');
  };

  const processPDF = async () => {
    if (!files.length) return;
    setError(null);
    setProcessingStatus('Preparing…');
    setProcessedFile(null);
    setProgress(0);

    try {
      let resultBlob: Blob | null = null;
      let outputName = `Processed_${files[0].name}`;

      switch (mode) {
        case 'compress': {
          setProcessingStatus('Compressing…');
          const buf = await files[0].arrayBuffer();
          const doc = await PDFDocument.load(buf);
          const bytes = await doc.save({ useObjectStreams: true });
          resultBlob = new Blob([bytes], { type: 'application/pdf' });
          outputName = `Compressed_${files[0].name}`;
          break;
        }

        case 'merge': {
          setProcessingStatus('Merging PDFs…');
          const merged = await PDFDocument.create();
          for (let i = 0; i < files.length; i++) {
            setProgress(Math.round(((i + 1) / files.length) * 100));
            const buf = await files[i].arrayBuffer();
            const src = await PDFDocument.load(buf);
            const pages = await merged.copyPages(src, src.getPageIndices());
            pages.forEach(p => merged.addPage(p));
          }
          resultBlob = new Blob([await merged.save()], { type: 'application/pdf' });
          outputName = 'Merged_Document.pdf';
          break;
        }

        case 'split': {
          setProcessingStatus('Splitting…');
          const buf = await files[0].arrayBuffer();
          const src = await PDFDocument.load(buf);
          const count = src.getPageCount();
          const { default: JSZip } = await import('jszip');
          const zip = new JSZip();
          for (let i = 0; i < count; i++) {
            setProgress(Math.round(((i + 1) / count) * 100));
            const out = await PDFDocument.create();
            const [pg] = await out.copyPages(src, [i]);
            out.addPage(pg);
            zip.file(`page_${i + 1}.pdf`, await out.save());
          }
          resultBlob = await zip.generateAsync({ type: 'blob' });
          outputName = `Split_${files[0].name.replace('.pdf', '')}.zip`;
          break;
        }

        case 'pdf-to-jpg': {
          setProcessingStatus('Rendering pages…');
          const buf = await files[0].arrayBuffer();
          const pdf = await pdfjs.getDocument({ data: buf }).promise;
          const { default: JSZip } = await import('jszip');
          const zip = new JSZip();
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;

          for (let i = 1; i <= pdf.numPages; i++) {
            setProgress(Math.round((i / pdf.numPages) * 100));
            const page = await pdf.getPage(i);
            const vp = page.getViewport({ scale: 2 });
            canvas.width = vp.width;
            canvas.height = vp.height;
            await page.render({ canvasContext: ctx, viewport: vp, canvas }).promise;
            const blob = await new Promise<Blob>(r => canvas.toBlob(b => r(b!), 'image/jpeg', 0.92));
            zip.file(`page_${i}.jpg`, blob);
          }
          resultBlob = await zip.generateAsync({ type: 'blob' });
          outputName = `Images_${files[0].name}.zip`;
          break;
        }

        case 'jpg-to-pdf': {
          setProcessingStatus('Building PDF…');
          const doc = await PDFDocument.create();
          for (let i = 0; i < files.length; i++) {
            setProgress(Math.round(((i + 1) / files.length) * 100));
            const buf = await files[i].arrayBuffer();
            const img = files[i].type === 'image/png'
              ? await doc.embedPng(buf)
              : await doc.embedJpg(buf);
            const page = doc.addPage([img.width, img.height]);
            page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
          }
          resultBlob = new Blob([await doc.save()], { type: 'application/pdf' });
          outputName = 'Converted_Images.pdf';
          break;
        }

        case 'rotate': {
          setProcessingStatus('Rotating…');
          const buf = await files[0].arrayBuffer();
          const doc = await PDFDocument.load(buf);
          doc.getPages().forEach(pg => pg.setRotation(degrees(pg.getRotation().angle + rotation)));
          resultBlob = new Blob([await doc.save()], { type: 'application/pdf' });
          outputName = `Rotated_${files[0].name}`;
          break;
        }

        case 'watermark': {
          setProcessingStatus('Adding watermark…');
          const buf = await files[0].arrayBuffer();
          const doc = await PDFDocument.load(buf);
          const font = await doc.embedFont(StandardFonts.HelveticaBold);
          doc.getPages().forEach(pg => {
            const { width, height } = pg.getSize();
            pg.drawText(watermarkText || 'WATERMARK', {
              x: width / 4, y: height / 2,
              size: 50, font,
              color: rgb(0.7, 0.7, 0.7),
              rotate: degrees(45), opacity: 0.3,
            });
          });
          resultBlob = new Blob([await doc.save()], { type: 'application/pdf' });
          outputName = `Watermarked_${files[0].name}`;
          break;
        }

        case 'page-numbers': {
          setProcessingStatus('Adding page numbers…');
          const buf = await files[0].arrayBuffer();
          const doc = await PDFDocument.load(buf);
          const font = await doc.embedFont(StandardFonts.Helvetica);
          const pages = doc.getPages();
          pages.forEach((pg, i) => {
            const { width, height } = pg.getSize();
            const text = `${i + 1} / ${pages.length}`;
            const fs = 10;
            const tw = font.widthOfTextAtSize(text, fs);
            let x = width / 2 - tw / 2, y = 20;
            if (pageNumberPosition === 'bottom-right') x = width - tw - 20;
            if (pageNumberPosition === 'top-right') { x = width - tw - 20; y = height - 30; }
            pg.drawText(text, { x, y, size: fs, font, color: rgb(0, 0, 0) });
          });
          resultBlob = new Blob([await doc.save()], { type: 'application/pdf' });
          outputName = `Numbered_${files[0].name}`;
          break;
        }

        case 'remove-pages':
        case 'organize': {
          setProcessingStatus('Removing pages…');
          const buf = await files[0].arrayBuffer();
          const doc = await PDFDocument.load(buf);
          [...pagesToRemove].sort((a, b) => b - a).forEach(idx => doc.removePage(idx));
          resultBlob = new Blob([await doc.save()], { type: 'application/pdf' });
          outputName = `Organized_${files[0].name}`;
          break;
        }

        case 'protect':
          throw new Error('Password protection requires our Pro plan (server-side). Coming soon!');

        case 'unlock':
          throw new Error('PDF unlocking requires our Pro plan (server-side). Coming soon!');

        case 'pdf-to-text': {
          setProcessingStatus('Extracting text…');
          const text = await extractText(files[0]);
          setOcrText(text);
          setProgress(100);
          setProcessingStatus('Done!');
          return;
        }

        case 'ai-summary': {
          setProcessingStatus('Reading PDF…');
          const text = await extractText(files[0]);
          setProcessingStatus('Summarizing with AI…');
          // Gemini @google/genai v1.x API
          const { GoogleGenAI } = await import('@google/genai');
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
          const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: `Summarize this PDF content clearly and concisely in bullet points:\n\n${text.slice(0, 30000)}`,
          });
          setOcrText(response.text ?? 'No summary returned.');
          setProgress(100);
          setProcessingStatus('Done!');
          return;
        }

        default:
          throw new Error(`The "${mode}" tool is coming soon!`);
      }

      if (resultBlob) {
        setProcessedFile({ blob: resultBlob, name: outputName });
        setProgress(100);
        confetti({ particleCount: 120, spread: 65, origin: { y: 0.6 }, colors: ['#4f46e5', '#818cf8', '#c7d2fe'] });
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setProcessingStatus('');
    }
  };

  const downloadProcessed = () => {
    if (!processedFile) return;
    const url = URL.createObjectURL(processedFile.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = processedFile.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${['B', 'KB', 'MB', 'GB'][i]}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SubNav items={pdfNavItems} title="PDF Tools" />

      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-4"
          >
            <FileText size={14} aria-hidden="true" />
            PDF Tool
          </motion.div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{title}</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">{description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <PDFPreviewArea
              files={files}
              preview={null}
              processedFile={processedFile}
              mode={mode}
              onDrop={e => { e.preventDefault(); handleFiles(Array.from(e.dataTransfer.files)); }}
              onFileSelect={handleFiles}
              onRemoveFile={idx => setFiles(prev => prev.filter((_, i) => i !== idx))}
              onClearAll={() => { setFiles([]); setProcessedFile(null); }}
              onDownload={downloadProcessed}
              formatSize={formatSize}
              thumbnails={thumbnails}
              pagesToRemove={pagesToRemove}
              onTogglePage={idx => setPagesToRemove(prev =>
                prev.includes(idx) ? prev.filter(p => p !== idx) : [...prev, idx]
              )}
              ocrText={ocrText}
            />
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <PDFToolControls
                mode={mode}
                files={files}
                isProcessing={isProcessing}
                processingStatus={processingStatus}
                progress={localProgress}
                onProcess={processPDF}
                error={error}
                compressionLevel={compressionLevel}
                setCompressionLevel={setCompressionLevel}
                quality={quality}
                setQuality={setQuality}
                isGrayscale={isGrayscale}
                setIsGrayscale={setIsGrayscale}
                targetMinKB={targetMinKB}
                setTargetMinKB={setTargetMinKB}
                targetMaxKB={targetMaxKB}
                setTargetMaxKB={setTargetMaxKB}
                password={password}
                setPassword={setPassword}
                watermarkText={watermarkText}
                setWatermarkText={setWatermarkText}
                rotation={rotation}
                setRotation={setRotation}
                pageNumberPosition={pageNumberPosition}
                setPageNumberPosition={setPageNumberPosition}
                pagesToRemove={pagesToRemove}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
