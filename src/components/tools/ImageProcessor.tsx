import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, FileMinus, Maximize, Minimize2, Download, RefreshCw, CheckCircle2, AlertCircle, X, Image as ImageIcon, Wand2, Type, Crop, Cloud, HardDrive, Box, RotateCw, FlipHorizontal, Square, Circle, Palette, Sparkles, Settings, Plus, Trash2, FileText, Shield, Sliders, Settings2, Zap, Info, ImagePlus, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { removeBackground } from '@imgly/background-removal';
import ReactCrop, { Crop as ReactCropType, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { cn } from '@/src/lib/utils';
import CloudPicker from '../CloudPicker';
import WhatsAppShare from '../WhatsAppShare';
import { useProcessor } from '@/src/hooks/useProcessor';
import { useSEO } from '@/src/hooks/useSEO';
import { useFileContext } from '@/src/context/FileContext';

interface ImageProcessorProps {
  title: string;
  description: string;
}

import JSZip from 'jszip';
import heic2any from 'heic2any';
import jsPDF from 'jspdf';

interface ProcessedFile {
  id: string;
  original: File;
  processed: Blob;
  url: string;
  name: string;
}

import SubNav from './SubNav';

const imageNavItems = [
  { name: 'Resize', href: '/image/resize', icon: Maximize },
  { name: 'Crop', href: '/image/crop', icon: Crop },
  { name: 'Compress', href: '/image/compress', icon: Minimize2 },
  { name: 'Remove BG', href: '/image/remove-bg', icon: Trash2 },
  { name: 'Convert', href: '/image/convert', icon: RefreshCw },
  { name: 'Watermark', href: '/image/watermark', icon: Type },
  { name: 'Filters', href: '/image/filters', icon: Sparkles },
  { name: 'Merge', href: '/image/merge', icon: ImagePlus },
  { name: 'Responsive', href: '/image/responsive', icon: Monitor },
];

const IMAGE_SEO: Record<string, { title: string; description: string }> = {
  'Compress Image':     { title: 'Compress Image Free Online — JPG & PNG Compressor', description: 'Compress JPG and PNG images online for free. Reduce file size without losing quality. Perfect for exam photo upload portals.' },
  'Smart Resize':       { title: 'Resize Image Online Free — Pixels, %, Presets', description: 'Resize images by pixel dimensions, percentage, or presets. Free online image resizer — no account needed.' },
  'Format Converter':   { title: 'Convert Image Format Free — JPG PNG WebP HEIC', description: 'Convert images between JPG, PNG, WebP, SVG and HEIC formats online for free. Instant browser-based conversion.' },
  'Remove Background':  { title: 'Remove Image Background Free — AI Powered', description: 'Remove background from any image online using AI. Get a transparent PNG in seconds — free, no sign-up.' },
  'Crop Image':         { title: 'Crop Image Online Free — Custom Ratios', description: 'Crop images with custom aspect ratios or free selection online. Free image cropper — works in browser.' },
  'Image to PDF':       { title: 'Convert Image to PDF Free Online', description: 'Convert one or multiple images (JPG, PNG) to a PDF document online for free. Fast and easy — no sign-up.' },
  'Rotate & Flip':      { title: 'Rotate and Flip Image Online Free', description: 'Rotate images 90°, 180°, 270° or flip horizontally/vertically. Free online image rotator.' },
  'Filters & Effects':  { title: 'Add Filters to Image Free Online', description: 'Apply grayscale, sepia, blur, sharpen and other filters to your images online for free.' },
  'Adjustments':        { title: 'Adjust Image Brightness Contrast Saturation Free', description: 'Fine-tune brightness, contrast, saturation and other image settings online. Free image editor.' },
  'Watermark':          { title: 'Add Watermark to Image Free Online', description: 'Add text or logo watermarks to your images online. Free image watermarking tool.' },
  'Batch Process':      { title: 'Batch Image Processor Free Online', description: 'Process multiple images at once online for free. Bulk compress, resize, or convert images in one click.' },
};


export default function ImageProcessor({ title, description }: ImageProcessorProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const { process, isProcessing, progress, error: workerError } = useProcessor();
  const { droppedFiles, setDroppedFiles } = useFileContext();
  const [error, setError] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>('');

  // Cropping State
  const [isCropping, setIsCropping] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState<ReactCropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const imgRef = useRef<HTMLImageElement>(null);

  // Settings
  const [quality, setQuality] = useState(() => {
    const saved = localStorage.getItem('exampixl_quality');
    return saved ? parseFloat(saved) : 0.8;
  });
  const [resizeMode, setResizeMode] = useState<'pixels' | 'cm'>(() => {
    const saved = localStorage.getItem('exampixl_resizeMode');
    return (saved as any) || 'pixels';
  });
  const [selectedExam, setSelectedExam] = useState(() => {
    return localStorage.getItem('exampixl_selectedExam') || 'custom';
  });
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalRatio, setOriginalRatio] = useState(1);
  const [outputFormat, setOutputFormat] = useState<string>(() => {
    const saved = localStorage.getItem('exampixl_outputFormat');
    return saved || 'image/jpeg';
  });
  const [ocrText, setOcrText] = useState('');

  // New Transformation States
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [borderRadius, setBorderRadius] = useState(0);
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderColor, setBorderColor] = useState('#000000');
  const [padding, setPadding] = useState(0);
  const [filter, setFilter] = useState('none');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [watermarkText, setWatermarkText] = useState('');

  const [smartCompression, setSmartCompression] = useState(true);
  const [removeMetadata, setRemoveMetadata] = useState(true);
  const [resizeType, setResizeType] = useState<'pixels' | 'percentage' | 'preset'>('pixels');
  const [resizePercentage, setResizePercentage] = useState(100);
  const [bgType, setBgType] = useState<'color' | 'image' | 'transparent'>('transparent');
  const [bgImage, setBgImage] = useState<string | null>(null);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop(
        { unit: '%', width: 90 },
        aspect || 1,
        width,
        height
      ),
      width,
      height
    );
    setCrop(initialCrop);
  };

  const applyCrop = async () => {
    if (!imgRef.current || !completedCrop) return;

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const croppedFile = new File([blob], files[0]?.name || 'cropped.jpg', { type: 'image/jpeg' });
        
        // Replace the first file with the cropped version
        setFiles(prev => {
          const newFiles = [...prev];
          newFiles[0] = croppedFile;
          return newFiles;
        });
        
        setPreviews(prev => {
          const newPreviews = [...prev];
          URL.revokeObjectURL(newPreviews[0]);
          newPreviews[0] = URL.createObjectURL(croppedFile);
          return newPreviews;
        });

        setIsCropping(false);
      }
    }, 'image/jpeg', 0.95);
  };

  const handleFiles = useCallback((selectedFiles: File[]) => {
    const imageFiles = selectedFiles.filter(f => f.type.startsWith('image/') || f.name.toLowerCase().endsWith('.heic'));
    if (imageFiles.length === 0) {
      setError('Please upload image files (JPG, PNG, WebP, HEIC).');
      return;
    }
    setFiles(prev => [...prev, ...imageFiles]);
    const newPreviews = imageFiles.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...newPreviews]);
    setProcessedFiles([]);
    setError(null);
    setOcrText('');
    setIsCropping(false);

    // If first file, set initial dimensions
    if (files.length === 0 && imageFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setOriginalRatio(img.width / img.height);
          if (selectedExam === 'custom') {
            setWidth(img.width);
            setHeight(img.height);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(imageFiles[0]);
    }
  }, [files, selectedExam]);

  // Handle globally dropped or pasted files
  useEffect(() => {
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles);
      setDroppedFiles([]); // Clear it after handling
    }
  }, [droppedFiles, handleFiles, setDroppedFiles]);

  // Special Tool Settings
  const [studentName, setStudentName] = useState(() => localStorage.getItem('exampixl_studentName') || '');
  const [bgColor, setBgColor] = useState(() => localStorage.getItem('exampixl_bgColor') || 'white');

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('exampixl_quality', quality.toString());
    localStorage.setItem('exampixl_resizeMode', resizeMode);
    localStorage.setItem('exampixl_outputFormat', outputFormat);
    localStorage.setItem('exampixl_studentName', studentName);
    localStorage.setItem('exampixl_bgColor', bgColor);
    localStorage.setItem('exampixl_selectedExam', selectedExam);
  }, [quality, resizeMode, outputFormat, studentName, bgColor, selectedExam]);

  const EXAM_PRESETS = {
    'upsc': { name: 'UPSC (Photo/Sig)', width: 350, height: 350, mode: 'pixels' },
    'ssc-photo': { name: 'SSC Photo', width: 3.5, height: 4.5, mode: 'cm' },
    'ssc-sig': { name: 'SSC Signature', width: 4.0, height: 2.0, mode: 'cm' },
    'ibps-photo': { name: 'IBPS/SBI Photo', width: 4.5, height: 3.5, mode: 'cm' },
    'ibps-sig': { name: 'IBPS/SBI Signature', width: 140, height: 60, mode: 'pixels' },
    'passport': { name: 'Passport Size', width: 3.5, height: 4.5, mode: 'cm' },
    'custom': { name: 'Custom Size', width: 0, height: 0, mode: 'pixels' }
  };

  useEffect(() => {
    if (selectedExam !== 'custom' && (EXAM_PRESETS as any)[selectedExam]) {
      const preset = (EXAM_PRESETS as any)[selectedExam];
      setResizeMode(preset.mode);
      setWidth(preset.width);
      setHeight(preset.height);
      setMaintainAspectRatio(false);
    }
  }, [selectedExam]);

  const isTripleSig = title.includes('Triple Signature');
  const isDeclaration = title.includes('Declaration');
  const isWhiteBg = title.includes('White Background');
  const isAiRemoveBg = title.includes('Remove Background');
  const isChangeBg = title.includes('Change Background');
  const isSignatureExtractor = title.includes('Signature Extractor');
  const isOCR = title.includes('OCR') || title.includes('Extract Text');
  const isRotate = title.includes('Rotate');
  const isRound = title.includes('Round');
  const isBorder = title.includes('Border');
  const isFilters = title.includes('Filters');
  const isAdjust = title.includes('Adjust');
  const isWatermark = title.includes('Watermark');
  const isCrop = title.includes('Crop');
  const isImageToPDF = title.includes('Image to PDF');
  const isWebP = title.includes('WebP');
  const isStripExif = title.includes('Strip Metadata');
  const isProgressive = title.includes('Progressive');
  const isMergeImages = title.includes('Merge Images') || title.includes('Collage');
  const isResponsive = title.includes('Responsive');
  const [pdfOrientation, setPdfOrientation] = useState<'p' | 'l'>('p');
  const [pdfPageSize, setPdfPageSize] = useState<'a4' | 'letter' | 'legal'>('a4');
  const [pdfMargin, setPdfMargin] = useState(10);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isTripleSig) {
      setWidth(350);
      setHeight(500);
      setMaintainAspectRatio(false);
    } else if (isDeclaration) {
      setWidth(800);
      setHeight(400);
      setMaintainAspectRatio(false);
    } else if (isAiRemoveBg) {
      setBgType('transparent');
      setOutputFormat('image/png');
    } else if (isChangeBg || isWhiteBg) {
      setBgType('color');
      if (isWhiteBg) setBgColor('#FFFFFF');
    } else if (isWebP) {
      setOutputFormat('image/webp');
    } else if (isStripExif) {
      setRemoveMetadata(true);
    }
  }, [isTripleSig, isDeclaration, isAiRemoveBg, isChangeBg, isWhiteBg, isWebP, isStripExif]);

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      processedFiles.forEach(pf => URL.revokeObjectURL(pf.url));
      previews.forEach(p => URL.revokeObjectURL(p));
    };
  }, [processedFiles, previews]);

  // Global Paste Listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) handleFiles([blob]);
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleFiles]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    if (dropped.length > 0) handleFiles(dropped);
  }, [handleFiles]);

  const handleWidthChange = useCallback((val: number) => {
    setWidth(val);
    if (maintainAspectRatio) {
      setHeight(Math.round(val / originalRatio));
    }
  }, [maintainAspectRatio, originalRatio]);

  const handleHeightChange = useCallback((val: number) => {
    setHeight(val);
    if (maintainAspectRatio) {
      setWidth(Math.round(val * originalRatio));
    }
  }, [maintainAspectRatio, originalRatio]);

  const processSingleImage = async (file: File): Promise<Blob> => {
    let currentBlob: Blob = file;

    // 0. Handle HEIC
    if (file.name.toLowerCase().endsWith('.heic')) {
      setProcessingStatus(`Converting HEIC: ${file.name}...`);
      const converted = await heic2any({ blob: file, toType: 'image/jpeg' });
      currentBlob = Array.isArray(converted) ? converted[0] : converted;
    }

    // 1. Background Removal
    if (isWhiteBg || isAiRemoveBg || isChangeBg) {
      setProcessingStatus(`AI is removing background: ${file.name}...`);
      currentBlob = await removeBackground(currentBlob);
    }

    // 2. Triple Signature
    if (isTripleSig) {
      setProcessingStatus(`Generating triple signature: ${file.name}...`);
      currentBlob = await new Promise<Blob>((resolve) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(currentBlob);
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          canvas.width = 350;
          canvas.height = 500;
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          const rowH = canvas.height / 3;
          for (let i = 0; i < 3; i++) {
            const scale = Math.min((canvas.width - 20) / img.width, (rowH - 20) / img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            ctx.drawImage(img, (canvas.width - w) / 2, i * rowH + (rowH - h) / 2, w, h);
            if (i > 0) {
              ctx.strokeStyle = '#eee';
              ctx.beginPath(); ctx.moveTo(0, i * rowH); ctx.lineTo(canvas.width, i * rowH); ctx.stroke();
            }
          }
          canvas.toBlob((b) => {
            URL.revokeObjectURL(objectUrl);
            resolve(b!);
          }, 'image/jpeg', 0.95);
        };
        img.src = objectUrl;
      });
    }

    // 3. Declaration
    if (isDeclaration) {
      setProcessingStatus(`Generating declaration: ${file.name}...`);
      currentBlob = await new Promise<Blob>((resolve) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(currentBlob);
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          canvas.width = 800;
          canvas.height = 400;
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = 'black';
          ctx.font = '16px Arial';
          const text = `I, ${studentName || '_______'}, hereby declare that all the information submitted by me in the application form is correct, true and valid. I will present the supporting documents as and when required.`;
          const words = text.split(' ');
          let line = ''; let y = 60;
          for (let n = 0; n < words.length; n++) {
            const test = line + words[n] + ' ';
            if (ctx.measureText(test).width > 700 && n > 0) {
              ctx.fillText(line, 50, y); line = words[n] + ' '; y += 25;
            } else line = test;
          }
          ctx.fillText(line, 50, y);
          ctx.drawImage(img, canvas.width - 250, canvas.height - 150, 200, 100);
          ctx.font = 'italic 12px Arial';
          ctx.fillText("(Candidate's Signature)", canvas.width - 250, canvas.height - 30);
          canvas.toBlob((b) => {
            URL.revokeObjectURL(objectUrl);
            resolve(b!);
          }, 'image/jpeg', 0.9);
        };
        img.src = objectUrl;
      });
    }

    // 5. Signature Extractor (Remove White Background)
    if (isSignatureExtractor) {
      setProcessingStatus(`Extracting signature: ${file.name}...`);
      currentBlob = await new Promise<Blob>((resolve) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(currentBlob);
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i]; const g = data[i + 1]; const b = data[i + 2];
            if (r > 200 && g > 200 && b > 200) data[i + 3] = 0;
          }
          ctx.putImageData(imageData, 0, 0);
          canvas.toBlob((b) => {
            URL.revokeObjectURL(objectUrl);
            resolve(b!);
          }, 'image/png');
        };
        img.src = objectUrl;
      });
    }

    // 6. OCR (Extract Text)
    if (isOCR) {
      setProcessingStatus(`AI is reading text (OCR): ${file.name}...`);
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('eng');
      const ret = await worker.recognize(currentBlob);
      setOcrText(prev => prev + `\n--- ${file.name} ---\n` + ret.data.text);
      await worker.terminate();
    }

    // 7. Generic Transformations
    setProcessingStatus(`Applying transformations: ${file.name}...`);
    currentBlob = await new Promise<Blob>((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(currentBlob);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        // Calculate dimensions after rotation
        const is90 = rotation % 180 !== 0;
        let drawWidth = is90 ? img.height : img.width;
        let drawHeight = is90 ? img.width : img.height;

        // Apply Resizing
        if (resizeType === 'percentage') {
          drawWidth = (drawWidth * resizePercentage) / 100;
          drawHeight = (drawHeight * resizePercentage) / 100;
        } else if (resizeType === 'pixels' && width > 0 && height > 0) {
          drawWidth = width;
          drawHeight = height;
        }

        canvas.width = drawWidth + (padding * 2) + (borderWidth * 2);
        canvas.height = drawHeight + (padding * 2) + (borderWidth * 2);

        // Background
        if (bgType === 'color') {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (bgType === 'image' && bgImage) {
          // Draw background image (simplified: stretch to fit)
          const bgImg = new Image();
          bgImg.src = bgImage;
          ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        }

        // Border & Padding
        if (padding > 0 || borderWidth > 0) {
          ctx.fillStyle = borderColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = bgType === 'transparent' ? 'rgba(0,0,0,0)' : (bgType === 'color' ? bgColor : '#FFFFFF');
          if (bgType === 'transparent') ctx.clearRect(borderWidth, borderWidth, canvas.width - (borderWidth * 2), canvas.height - (borderWidth * 2));
          else ctx.fillRect(borderWidth, borderWidth, canvas.width - (borderWidth * 2), canvas.height - (borderWidth * 2));
        }

        if (borderRadius > 0) {
          ctx.beginPath();
          const r = (borderRadius / 100) * Math.min(canvas.width, canvas.height);
          ctx.moveTo(r, 0); ctx.lineTo(canvas.width - r, 0); ctx.quadraticCurveTo(canvas.width, 0, canvas.width, r);
          ctx.lineTo(canvas.width, canvas.height - r); ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - r, canvas.height);
          ctx.lineTo(r, canvas.height); ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - r);
          ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0); ctx.closePath(); ctx.clip();
        }

        let filterStr = '';
        if (filter === 'grayscale') filterStr += 'grayscale(100%) ';
        if (filter === 'sepia') filterStr += 'sepia(100%) ';
        if (filter === 'blur') filterStr += 'blur(5px) ';
        if (filter === 'sharpen') filterStr += 'contrast(150%) brightness(110%) ';
        if (filter === 'invert') filterStr += 'invert(100%) ';
        if (filter === 'hue-rotate') filterStr += 'hue-rotate(90deg) ';
        
        filterStr += `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
        ctx.filter = filterStr;

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        ctx.restore();

        if (watermarkText) {
          ctx.filter = 'none'; 
          ctx.font = 'bold 48px Arial'; 
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; 
          ctx.textAlign = 'center';
          ctx.fillText(watermarkText, canvas.width / 2, canvas.height / 2);
        }

        canvas.toBlob((b) => {
          URL.revokeObjectURL(objectUrl);
          resolve(b!);
        }, outputFormat, quality);
      };
      img.src = objectUrl;
    });

    // 8. Final Compression & Resizing
    setProcessingStatus(`Optimizing: ${file.name}...`);
    const options = {
      maxSizeMB: smartCompression ? 1 : 10,
      maxWidthOrHeight: width > 0 ? width : 4000,
      useWebWorker: true,
      fileType: outputFormat as any,
      initialQuality: quality,
      preserveExif: !removeMetadata
    };
    const imageCompression = (await import('browser-image-compression')).default;
    return await imageCompression(currentBlob as File, options);
  };

  const processAllImages = async () => {
    if (files.length === 0) return;
    setProcessingStatus('Starting...');
    setError(null);
    setProcessedFiles([]);

    try {
      if (isImageToPDF || outputFormat === 'application/pdf') {
        setProcessingStatus('Generating PDF...');
        const pdf = new jsPDF({
          orientation: pdfOrientation,
          unit: 'mm',
          format: pdfPageSize
        });
        
        for (let i = 0; i < files.length; i++) {
          const processedBlob = await processSingleImage(files[i]);
          const url = URL.createObjectURL(processedBlob);
          const img = new Image();
          await new Promise(resolve => { img.onload = resolve; img.src = url; });
          
          if (i > 0) pdf.addPage(pdfPageSize, pdfOrientation);
          
          const pdfW = pdf.internal.pageSize.getWidth();
          const pdfH = pdf.internal.pageSize.getHeight();
          const margin = pdfMargin;
          const availableW = pdfW - (margin * 2);
          const availableH = pdfH - (margin * 2);
          
          const ratio = Math.min(availableW / img.width, availableH / img.height);
          const finalW = img.width * ratio;
          const finalH = img.height * ratio;
          
          pdf.addImage(
            url, 
            'JPEG', 
            (pdfW - finalW) / 2, 
            (pdfH - finalH) / 2, 
            finalW, 
            finalH
          );
          URL.revokeObjectURL(url);
        }
        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setProcessedFiles([{
          id: 'pdf-output',
          original: files[0],
          processed: pdfBlob,
          url: pdfUrl,
          name: `ExamPixl_${new Date().getTime()}.pdf`
        }]);
      } else if (isMergeImages) {
        setProcessingStatus('Merging images...');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        const processedImages: HTMLImageElement[] = [];
        let totalHeight = 0;
        let maxWidth = 0;

        for (const file of files) {
          const blob = await processSingleImage(file);
          const url = URL.createObjectURL(blob);
          const img = new Image();
          await new Promise(resolve => { img.onload = resolve; img.src = url; });
          processedImages.push(img);
          totalHeight += img.height;
          maxWidth = Math.max(maxWidth, img.width);
          URL.revokeObjectURL(url);
        }

        canvas.width = maxWidth;
        canvas.height = totalHeight;
        let currentY = 0;
        for (const img of processedImages) {
          ctx.drawImage(img, (maxWidth - img.width) / 2, currentY);
          currentY += img.height;
        }

        const mergedBlob = await new Promise<Blob>(resolve => canvas.toBlob(b => resolve(b!), outputFormat, quality));
        const mergedUrl = URL.createObjectURL(mergedBlob);
        setProcessedFiles([{
          id: 'merged-output',
          original: files[0],
          processed: mergedBlob,
          url: mergedUrl,
          name: `ExamPixl_Merged_${new Date().getTime()}.${outputFormat.split('/')[1]}`
        }]);
      } else {
        const results: ProcessedFile[] = [];
        for (const file of files) {
          if (isResponsive) {
            const sizes = [
              { label: '_large', w: 1920 },
              { label: '_medium', w: 1024 },
              { label: '_small', w: 640 }
            ];
            for (const s of sizes) {
              setProcessingStatus(`Generating ${s.label.slice(1)}: ${file.name}...`);
              const h = Math.round(s.w / originalRatio);
              const img = new Image();
              const objectUrl = URL.createObjectURL(file);
              const processedBlob = await new Promise<Blob>((resolve) => {
                img.onload = () => {
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d')!;
                  canvas.width = s.w;
                  canvas.height = h;
                  ctx.drawImage(img, 0, 0, s.w, h);
                  canvas.toBlob((b) => {
                    URL.revokeObjectURL(objectUrl);
                    resolve(b!);
                  }, outputFormat, quality);
                };
                img.src = objectUrl;
              });

              results.push({
                id: Math.random().toString(36).substr(2, 9),
                original: file,
                processed: processedBlob,
                url: URL.createObjectURL(processedBlob),
                name: `${file.name.split('.')[0]}${s.label}.${outputFormat.split('/')[1]}`
              });
            }
          } else {
            const processedBlob = await processSingleImage(file);
            const url = URL.createObjectURL(processedBlob);
            results.push({
              id: Math.random().toString(36).substr(2, 9),
              original: file,
              processed: processedBlob,
              url,
              name: `ExamPixl_${file.name.split('.')[0]}.${outputFormat.split('/')[1]}`
            });
          }
        }
        setProcessedFiles(results);
      }

      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#2563eb', '#3b82f6', '#60a5fa'] });
    } catch (err: any) {
      setError(err.message || 'Failed to process images');
    } finally {
      setProcessingStatus('');
    }
  };

  const downloadZip = async () => {
    const zip = new JSZip();
    processedFiles.forEach(pf => {
      zip.file(pf.name, pf.processed);
    });
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ExamPixl_Batch.zip';
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SubNav items={imageNavItems} title="Image Tools" />
      
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-4"
        >
          <Sparkles size={14} />
          Image Power Tool
        </motion.div>
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">{title}</h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">{description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left: Upload & Previews (3/4 width) */}
        <div className="lg:col-span-3 space-y-6">
          {files.length === 0 ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              className="glass-card p-16 border-dashed border-2 border-slate-300 bg-slate-50/50 flex flex-col items-center justify-center text-center hover:border-brand-400 hover:bg-brand-50/30 transition-all min-h-[500px] relative overflow-hidden group"
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,.heic"
                multiple
                onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
              />
              
              <div className="relative z-10 flex flex-col items-center">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="h-28 w-28 bg-white rounded-[2rem] shadow-2xl shadow-brand-500/10 flex items-center justify-center text-brand-600 mb-8 border border-slate-100 cursor-pointer hover:scale-110 transition-transform duration-500"
                >
                  <Upload size={48} strokeWidth={1.5} />
                </div>
                
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
                  Drop your images here
                </h3>
                <p className="text-slate-500 mb-12 max-w-md text-lg leading-relaxed">
                  Select multiple images to process them in batch. 
                  Supports <span className="font-bold text-slate-700">JPG, PNG, WebP, HEIC</span>.
                </p>

                <div className="grid grid-cols-3 gap-6 w-full max-w-lg">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-white border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 transition-all shadow-sm group/btn"
                  >
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/btn:bg-brand-100 group-hover/btn:text-brand-600 transition-colors">
                      <HardDrive size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover/btn:text-brand-600">Local</span>
                  </button>
                  
                  <CloudPicker 
                    onFileSelect={(f) => handleFiles([f])} 
                    onLocalClick={() => fileInputRef.current?.click()}
                    allowedTypes={['.jpg', '.jpeg', '.png', '.webp', '.heic']} 
                  />
                </div>
              </div>

              <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]">
                <div className="absolute top-10 left-10 rotate-12"><ImageIcon size={160} /></div>
                <div className="absolute bottom-10 right-10 -rotate-12"><Wand2 size={160} /></div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Selected Files Grid */}
              <div className="glass-card p-8 bg-white">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <ImageIcon size={24} className="text-brand-600" />
                    Selected Images ({files.length})
                  </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 transition-all"
                    >
                      <Plus size={18} />
                      Local
                    </button>
                    <CloudPicker 
                      onFileSelect={(f) => handleFiles([f])} 
                      onLocalClick={() => fileInputRef.current?.click()}
                      allowedTypes={['.jpg', '.jpeg', '.png', '.webp', '.heic']} 
                    />
                  </div>
                  <button 
                    onClick={() => { setFiles([]); setPreviews([]); setProcessedFiles([]); }}
                    className="text-slate-400 hover:text-red-500 p-2 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {previews.map((src, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
                      <img src={src} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => {
                            setFiles(prev => prev.filter((_, i) => i !== idx));
                            setPreviews(prev => prev.filter((_, i) => i !== idx));
                          }}
                          className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                        <p className="text-[10px] text-white truncate font-medium">{files[idx]?.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Processed Results */}
              {processedFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                      <CheckCircle2 size={28} className="text-green-500" />
                      Processed Results
                    </h3>
                    {processedFiles.length > 1 && !isImageToPDF && (
                      <button 
                        onClick={downloadZip}
                        className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-slate-800 shadow-xl transition-all"
                      >
                        <Download size={18} />
                        Download All (ZIP)
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {processedFiles.map((pf) => (
                      <div key={pf.id} className="glass-card p-6 bg-white border-slate-100 hover:border-brand-200 transition-all group">
                        <div className="flex gap-6 items-center">
                          <div className="h-24 w-24 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                            {isImageToPDF ? (
                              <div className="w-full h-full flex items-center justify-center bg-red-50 text-red-500">
                                <FileText size={32} />
                              </div>
                            ) : (
                              <img src={pf.url} alt="Processed" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 truncate mb-1">{pf.name}</h4>
                            <p className="text-xs text-slate-500 font-medium mb-4">
                              {formatSize(pf.processed.size)}
                              {!isImageToPDF && (
                                <span className="ml-2 text-brand-600">
                                  ({Math.round((pf.processed.size / pf.original.size) * 100)}% of original)
                                </span>
                              )}
                            </p>
                            <a 
                              href={pf.url} 
                              download={pf.name}
                              className="inline-flex items-center gap-2 text-brand-600 text-sm font-bold hover:text-brand-700"
                            >
                              <Download size={16} />
                              Download
                            </a>
                            <WhatsAppShare className="mt-2 text-[11px] !px-3 !py-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Right: Controls (1/4 width) */}
        <div className="space-y-6">
          <div className="glass-card p-8 bg-white sticky top-24 shadow-xl shadow-slate-200/50">
            <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3">
              <Settings2 size={20} className="text-brand-600" />
              Tool Settings
            </h3>

            <div className="space-y-8">
              {/* PDF Options (Only for Image to PDF or PDF output) */}
              {(isImageToPDF || outputFormat === 'application/pdf') && (
                <div className="space-y-6 p-6 bg-brand-50/50 rounded-[2rem] border border-brand-100">
                  <label className="text-xs font-black text-brand-600 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={14} />
                    PDF Configuration
                  </label>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Orientation</label>
                      <div className="flex gap-2 p-1 bg-white border border-slate-100 rounded-xl">
                        {(['p', 'l'] as const).map((o) => (
                          <button
                            key={o}
                            onClick={() => setPdfOrientation(o)}
                            className={cn(
                              "flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                              pdfOrientation === o ? "bg-brand-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"
                            )}
                          >
                            {o === 'p' ? 'Portrait' : 'Landscape'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Page Size</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['a4', 'letter', 'legal'] as const).map((s) => (
                          <button
                            key={s}
                            onClick={() => setPdfPageSize(s)}
                            className={cn(
                              "py-2 rounded-xl text-[10px] font-black uppercase transition-all border",
                              pdfPageSize === s ? "bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-200" : "bg-white border-slate-100 text-slate-500 hover:bg-slate-100"
                            )}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase"><span>Margin</span><span>{pdfMargin}mm</span></div>
                      <input type="range" min="0" max="50" value={pdfMargin} onChange={(e) => setPdfMargin(parseInt(e.target.value))} className="w-full accent-brand-600" />
                    </div>
                  </div>
                </div>
              )}

              {/* Format Conversion & Optimization */}
              <div className="space-y-6 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <RefreshCw size={14} />
                    Output Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff', 'image/svg+xml', 'image/heic', 'image/x-icon', 'application/pdf'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setOutputFormat(f as any)}
                        className={cn(
                          "py-2.5 rounded-xl text-[10px] font-black transition-all border",
                          outputFormat === f ? "bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-200" : "bg-white border-slate-100 text-slate-500 hover:bg-slate-100"
                        )}
                      >
                        {f === 'image/svg+xml' ? 'SVG' : f === 'image/x-icon' ? 'ICO' : f === 'application/pdf' ? 'PDF' : f.split('/')[1].toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Shield size={14} />
                      Optimization
                    </label>
                    <span className="text-[10px] font-bold text-brand-600">{Math.round(quality * 100)}% Quality</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full accent-brand-600"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 p-2 bg-white rounded-xl cursor-pointer border border-slate-100 hover:bg-slate-50 transition-colors">
                      <input type="checkbox" checked={smartCompression} onChange={(e) => setSmartCompression(e.target.checked)} className="w-3.5 h-3.5 accent-brand-600" />
                      <span className="text-[10px] font-bold text-slate-600">Smart Comp</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 bg-white rounded-xl cursor-pointer border border-slate-100 hover:bg-slate-50 transition-colors">
                      <input type="checkbox" checked={removeMetadata} onChange={(e) => setRemoveMetadata(e.target.checked)} className="w-3.5 h-3.5 accent-brand-600" />
                      <span className="text-[10px] font-bold text-slate-600">No Metadata</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Size & Transform */}
              <div className="space-y-6 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Maximize size={14} />
                    Resize & Crop
                  </label>
                  <div className="flex gap-2 p-1 bg-white border border-slate-100 rounded-xl">
                    {(['pixels', 'percentage', 'preset'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setResizeType(mode)}
                        className={cn(
                          "flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                          resizeType === mode ? "bg-brand-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"
                        )}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                  
                  {resizeType === 'percentage' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase"><span>Scale</span><span>{resizePercentage}%</span></div>
                      <input type="range" min="1" max="200" value={resizePercentage} onChange={(e) => setResizePercentage(parseInt(e.target.value))} className="w-full accent-brand-600" />
                    </div>
                  )}

                  {resizeType === 'pixels' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Width</label>
                        <input type="number" value={width} onChange={(e) => handleWidthChange(parseInt(e.target.value))} className="w-full p-2 bg-white border border-slate-100 rounded-lg text-sm font-bold" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Height</label>
                        <input type="number" value={height} onChange={(e) => handleHeightChange(parseInt(e.target.value))} className="w-full p-2 bg-white border border-slate-100 rounded-lg text-sm font-bold" />
                      </div>
                    </div>
                  )}

                  {isCrop && (
                    <button 
                      onClick={() => setShowCropModal(true)}
                      className="w-full py-3 bg-brand-50 text-brand-600 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-100 transition-all border border-brand-100"
                    >
                      <Crop size={16} />
                      Open Crop Tool
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <RotateCw size={14} />
                    Transform
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setRotation((rotation + 90) % 360)} className="p-3 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-slate-50">
                      <RotateCw size={14} /> Rotate 90°
                    </button>
                    <button onClick={() => setFlipH(!flipH)} className={cn("p-3 border rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all", flipH ? "bg-brand-600 border-brand-600 text-white" : "bg-white border-slate-100 text-slate-500")}>
                      Flip H
                    </button>
                    <button onClick={() => setFlipV(!flipV)} className={cn("p-3 border rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all", flipV ? "bg-brand-600 border-brand-600 text-white" : "bg-white border-slate-100 text-slate-500")}>
                      Flip V
                    </button>
                    <div className="flex items-center gap-2 p-2 bg-white border border-slate-100 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Angle</span>
                      <input type="number" value={rotation} onChange={(e) => setRotation(parseInt(e.target.value) || 0)} className="w-full bg-transparent text-[10px] font-bold outline-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Background & Effects */}
              <div className="space-y-6 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Palette size={14} />
                      Background
                    </label>
                    {(isAiRemoveBg || isChangeBg || isWhiteBg) && (
                      <span className="text-[10px] font-black text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full uppercase tracking-wider">AI Active</span>
                    )}
                  </div>
                  
                  {(isAiRemoveBg || isChangeBg || isWhiteBg) && (
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                      AI will automatically detect and remove the background. Choose your replacement style:
                    </p>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    {(['transparent', 'color', 'image'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setBgType(type);
                          if (type === 'transparent') setOutputFormat('image/png');
                        }}
                        className={cn(
                          "py-2 rounded-xl text-[10px] font-black uppercase transition-all border",
                          bgType === type ? "bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-200" : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  {bgType === 'color' && (
                    <div className="space-y-3">
                      <div className="flex gap-2 flex-wrap">
                        {['#FFFFFF', '#000000', '#ADD8E6', '#F0F0F0', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'].map(c => (
                          <button
                            key={c}
                            onClick={() => setBgColor(c)}
                            className={cn(
                              "w-6 h-6 rounded-full border-2 transition-all",
                              bgColor === c ? "border-brand-600 scale-110 shadow-sm" : "border-transparent hover:scale-105"
                            )}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                      <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer border-none p-0 overflow-hidden" />
                    </div>
                  )}
                  {bgType === 'image' && (
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setBgImage(URL.createObjectURL(file));
                      }}
                      className="text-[10px] text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                    />
                  )}
                </div>

                {isFilters && (
                  <div className="space-y-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Sparkles size={14} />
                      Filters
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['none', 'grayscale', 'sepia', 'blur', 'sharpen', 'invert', 'hue-rotate'].map(f => (
                        <button 
                          key={f} 
                          onClick={() => setFilter(f)} 
                          className={cn(
                            "p-2 border rounded-xl text-[10px] font-bold capitalize transition-all", 
                            filter === f ? "bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-200" : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Borders & Watermark */}
              {(isRound || isBorder || isWatermark) && (
                <div className="space-y-6 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                  {isRound && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Circle size={14} />
                          Round Corners
                        </label>
                        <span className="text-xs font-bold text-brand-600">{borderRadius}%</span>
                      </div>
                      <input type="range" min="0" max="50" value={borderRadius} onChange={(e) => setBorderRadius(parseInt(e.target.value))} className="w-full accent-brand-600" />
                    </div>
                  )}

                  {isBorder && (
                    <div className="space-y-4">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Square size={14} />
                        Border & Padding
                      </label>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase"><span>Border Width</span><span>{borderWidth}px</span></div>
                          <input type="range" min="0" max="50" value={borderWidth} onChange={(e) => setBorderWidth(parseInt(e.target.value))} className="w-full accent-brand-600" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase"><span>Padding</span><span>{padding}px</span></div>
                          <input type="range" min="0" max="50" value={padding} onChange={(e) => setPadding(parseInt(e.target.value))} className="w-full accent-brand-600" />
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Color</span>
                          <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="h-10 w-full rounded-xl cursor-pointer border-none p-0 overflow-hidden" />
                        </div>
                      </div>
                    </div>
                  )}

                  {isWatermark && (
                    <div className="space-y-4">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Type size={14} />
                        Watermark Text
                      </label>
                      <input 
                        type="text"
                        placeholder="Enter text..."
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-100 bg-white focus:ring-2 focus:ring-brand-500 outline-none text-xs font-bold"
                      />
                    </div>
                  )}
                </div>
              )}


              <div className="pt-8 space-y-4">
                <button
                  disabled={files.length === 0 || isProcessing}
                  onClick={processAllImages}
                  className={cn(
                    "w-full py-5 rounded-[2rem] font-black text-lg flex flex-col items-center justify-center gap-1 transition-all shadow-2xl relative overflow-hidden",
                    files.length > 0 && !isProcessing
                      ? "bg-brand-600 text-white hover:bg-brand-700 shadow-brand-200"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {isProcessing ? (
                      <>
                        <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="text-sm">{processingStatus || 'Processing...'}</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw size={22} strokeWidth={2.5} />
                        {(isImageToPDF || outputFormat === 'application/pdf') ? 'Convert to PDF' : 
                         isAiRemoveBg ? 'Remove Background' : 
                         isChangeBg ? 'Change Background' : 'Process All Images'}
                      </>
                    )}
                  </div>
                </button>
                
                {isProcessing && (
                  <p className="text-center text-[10px] font-black text-brand-600 uppercase tracking-[0.2em] animate-pulse">
                    Batch Processing Active
                  </p>
                )}
              </div>

              {(error || workerError) && (
                <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-xs font-medium flex items-start gap-3 border border-red-100">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{error || workerError}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Crop Modal */}
      <AnimatePresence>
        {showCropModal && files.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Crop Image</h3>
                  <p className="text-xs font-bold text-slate-500">Adjust the area you want to keep</p>
                </div>
                <button 
                  onClick={() => setShowCropModal(false)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-8 flex flex-col items-center justify-center bg-slate-100/50">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspect}
                  className="max-h-[60vh]"
                >
                  <img
                    ref={imgRef}
                    src={previews[0]}
                    onLoad={onImageLoad}
                    alt="Crop preview"
                    className="max-w-full h-auto"
                  />
                </ReactCrop>
              </div>

              <div className="p-8 border-t border-slate-100 bg-white space-y-6">
                <div className="flex flex-wrap gap-3 justify-center">
                  {[
                    { label: 'Free', value: undefined },
                    { label: '1:1', value: 1 },
                    { label: '4:3', value: 4/3 },
                    { label: '16:9', value: 16/9 },
                    { label: '3:2', value: 3/2 },
                    { label: '2:3', value: 2/3 }
                  ].map((ratio) => (
                    <button
                      key={ratio.label}
                      onClick={() => setAspect(ratio.value)}
                      className={cn(
                        "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                        aspect === ratio.value ? "bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-200" : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"
                      )}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowCropModal(false)}
                    className="flex-1 py-4 rounded-2xl font-black text-slate-500 hover:bg-slate-50 transition-all border border-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      await applyCrop();
                      setShowCropModal(false);
                    }}
                    className="flex-1 py-4 rounded-2xl font-black bg-brand-600 text-white hover:bg-brand-700 transition-all shadow-xl shadow-brand-200"
                  >
                    Apply Crop
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
  );
}
