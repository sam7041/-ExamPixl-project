import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Layout from './components/Layout';

import { FileProvider } from './context/FileContext';

const Home = lazy(() => import('./pages/Home'));
const ImageProcessor = lazy(() => import('./components/tools/ImageProcessor'));
const SmartResize = lazy(() => import('./components/tools/image/SmartResize'));
const PDFProcessor = lazy(() => import('./components/tools/PDFProcessor'));
const Contact = lazy(() => import('./pages/Contact'));
const ExamPhotoValidator = lazy(() => import('./components/tools/ExamPhotoValidator'));
const SignatureCanvas = lazy(() => import('./components/tools/SignatureCanvas'));

const Loading = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="h-8 w-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
  </div>
);

// Tracks visited tool routes to localStorage for "Recently Used" on homepage
function RouteTracker() {
  const location = useLocation();
  
  useEffect(() => {
    const toolMap: Record<string, { name: string; category: 'pdf' | 'image' | 'exam' }> = {
      '/pdf/compress': { name: 'Compress PDF', category: 'pdf' },
      '/pdf/merge': { name: 'Merge PDF', category: 'pdf' },
      '/pdf/split': { name: 'Split PDF', category: 'pdf' },
      '/pdf/to-word': { name: 'PDF to Word', category: 'pdf' },
      '/pdf/to-jpg': { name: 'PDF to JPG', category: 'pdf' },
      '/pdf/protect': { name: 'Protect PDF', category: 'pdf' },
      '/pdf/unlock': { name: 'Unlock PDF', category: 'pdf' },
      '/pdf/sign': { name: 'Sign PDF', category: 'pdf' },
      '/pdf/watermark': { name: 'Watermark PDF', category: 'pdf' },
      '/pdf/from-jpg': { name: 'JPG to PDF', category: 'pdf' },
      '/pdf/rotate': { name: 'Rotate PDF', category: 'pdf' },
      '/pdf/organize': { name: 'Organize PDF', category: 'pdf' },
      '/pdf/ai-summary': { name: 'AI Summarizer', category: 'pdf' },
      '/image/compress': { name: 'Compress Image', category: 'image' },
      '/image/resize': { name: 'Smart Resize', category: 'image' },
      '/image/convert': { name: 'Format Converter', category: 'image' },
      '/image/remove-bg': { name: 'Remove Background', category: 'image' },
      '/image/crop': { name: 'Crop Image', category: 'image' },
      '/image/to-pdf': { name: 'Image to PDF', category: 'image' },
      '/image/exam-photo': { name: 'Exam Photo Validator', category: 'exam' },
      '/image/signature-canvas': { name: 'Signature Canvas', category: 'exam' },
    };
    const match = toolMap[location.pathname];
    if (match) {
      try {
        const raw = localStorage.getItem('exampixl_recent');
        const prev = raw ? JSON.parse(raw) : [];
        const filtered = prev.filter((t: any) => t.href !== location.pathname);
        const updated = [{ ...match, href: location.pathname, visitedAt: Date.now() }, ...filtered].slice(0, 6);
        localStorage.setItem('exampixl_recent', JSON.stringify(updated));
      } catch { /* ignore */ }
    }
  }, [location.pathname]);
  
  return null;
}

export default function App() {
  return (
    <FileProvider>
      <Router>
        <RouteTracker />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              
              {/* PDF Routes */}
              <Route path="pdf">
              <Route index element={<Home />} />
              <Route path="compress" element={<PDFProcessor title="Compress PDF" description="Reduce PDF file size while optimizing for visual quality." initialMode="compress" />} />
              <Route path="merge" element={<PDFProcessor title="Merge PDF" description="Combine multiple PDF files into a single document." initialMode="merge" />} />
              <Route path="rotate" element={<PDFProcessor title="Rotate PDF" description="Rotate PDF pages to your desired orientation." initialMode="rotate" />} />
              <Route path="split" element={<PDFProcessor title="Split PDF" description="Extract pages from your PDF or save each page as a separate PDF." initialMode="split" />} />
              <Route path="to-jpg" element={<PDFProcessor title="PDF to JPG" description="Convert PDF pages into high-quality JPG images." initialMode="pdf-to-jpg" />} />
              <Route path="from-jpg" element={<PDFProcessor title="JPG to PDF" description="Convert and merge your images into a single PDF document." initialMode="jpg-to-pdf" />} />
              <Route path="organize" element={<PDFProcessor title="Organize PDF" description="Reorder, rotate, or delete pages from your PDF." initialMode="organize" />} />
              <Route path="page-numbers" element={<PDFProcessor title="Page Numbers" description="Add page numbers to your PDF document." initialMode="page-numbers" />} />
              <Route path="to-text" element={<PDFProcessor title="PDF to Text" description="Extract text from PDF pages using OCR." initialMode="pdf-to-text" />} />
              <Route path="to-word" element={<PDFProcessor title="PDF to Word" description="Convert PDF to editable Word document." initialMode="pdf-to-word" />} />
              <Route path="scan" element={<PDFProcessor title="Scan to PDF" description="Scan documents using your camera and save as PDF." initialMode="scan" />} />
              <Route path="unlock" element={<PDFProcessor title="Unlock PDF" description="Remove password protection from your PDF." initialMode="unlock" />} />
              <Route path="protect" element={<PDFProcessor title="Protect PDF" description="Encrypt your PDF with a strong password." initialMode="protect" />} />
              <Route path="watermark" element={<PDFProcessor title="Watermark PDF" description="Add text or image watermark to your PDF." initialMode="watermark" />} />
              <Route path="sign" element={<PDFProcessor title="Sign PDF" description="Sign your PDF documents electronically." initialMode="sign" />} />
              
              {/* New PDF Routes */}
              <Route path="from-word" element={<PDFProcessor title="Word to PDF" description="Convert Word documents to PDF format." initialMode="from-word" />} />
              <Route path="from-ppt" element={<PDFProcessor title="PowerPoint to PDF" description="Convert PowerPoint presentations to PDF format." initialMode="from-ppt" />} />
              <Route path="from-excel" element={<PDFProcessor title="Excel to PDF" description="Convert Excel spreadsheets to PDF format." initialMode="from-excel" />} />
              <Route path="from-html" element={<PDFProcessor title="HTML to PDF" description="Convert web pages to PDF format." initialMode="html-to-pdf" />} />
              <Route path="to-ppt" element={<PDFProcessor title="PDF to PowerPoint" description="Convert PDF files to PowerPoint presentations." initialMode="to-ppt" />} />
              <Route path="to-excel" element={<PDFProcessor title="PDF to Excel" description="Convert PDF files to Excel spreadsheets." initialMode="to-excel" />} />
              <Route path="to-pdfa" element={<PDFProcessor title="PDF to PDF/A" description="Convert PDF documents to PDF/A for archiving." initialMode="to-pdfa" />} />
              <Route path="remove-pages" element={<PDFProcessor title="Remove Pages" description="Delete unwanted pages from your PDF document." initialMode="remove-pages" />} />
              <Route path="extract-pages" element={<PDFProcessor title="Extract Pages" description="Extract specific pages from your PDF file." initialMode="extract-pages" />} />
              <Route path="repair" element={<PDFProcessor title="Repair PDF" description="Fix damaged or corrupted PDF files." initialMode="repair" />} />
              <Route path="crop" element={<PDFProcessor title="Crop PDF" description="Trim the margins of your PDF pages." initialMode="crop" />} />
              <Route path="edit" element={<PDFProcessor title="Edit PDF" description="Add annotations and edit your PDF content." initialMode="edit" />} />
              <Route path="redact" element={<PDFProcessor title="Redact PDF" description="Remove sensitive information from your PDF." initialMode="redact" />} />
              <Route path="compare" element={<PDFProcessor title="Compare PDF" description="Find differences between two PDF versions." initialMode="compare" />} />
              <Route path="ai-summary" element={<PDFProcessor title="AI Summarizer" description="Get an AI-powered summary of your PDF." initialMode="ai-summary" />} />
              <Route path="translate" element={<PDFProcessor title="Translate PDF" description="Translate your PDF into other languages." initialMode="translate" />} />
            </Route>
  
            <Route path="contact" element={<Contact />} />
            <Route path="write-to-us" element={<Contact />} />

            {/* Image Routes */}
            <Route path="image">
              <Route index element={<Home />} />
              <Route path="compress" element={<ImageProcessor title="Compress Image" description="Optimize JPG and PNG images for web and submission." />} />
              <Route path="resize" element={<SmartResize />} />
              <Route path="convert" element={<ImageProcessor title="Format Converter" description="Convert images between JPG, PNG, and WebP formats." />} />
              <Route path="webp" element={<ImageProcessor title="WebP Optimizer" description="Convert and optimize images for the web using WebP format." />} />
              <Route path="strip-exif" element={<ImageProcessor title="Strip Metadata" description="Remove EXIF and other metadata from your images for privacy." />} />
              <Route path="progressive" element={<ImageProcessor title="Progressive JPEG" description="Create progressive JPEGs for faster perceived loading." />} />
              <Route path="crop" element={<ImageProcessor title="Crop Image" description="Crop your images with custom ratios or free-hand selection." />} />
              <Route path="transform" element={<ImageProcessor title="Rotate & Flip" description="Rotate or flip your images to the correct orientation." />} />
              <Route path="round" element={<ImageProcessor title="Round Corners" description="Add rounded corners to your images with custom radius." />} />
              <Route path="border" element={<ImageProcessor title="Borders & Padding" description="Add custom borders and padding to your images." />} />
              <Route path="remove-bg" element={<ImageProcessor title="Remove Background" description="AI-powered background removal for your images." />} />
              <Route path="bg-color" element={<ImageProcessor title="Change Background" description="Change the background color of your images." />} />
              <Route path="filters" element={<ImageProcessor title="Filters & Effects" description="Apply professional filters and effects to your photos." />} />
              <Route path="adjust" element={<ImageProcessor title="Adjustments" description="Fine-tune brightness, contrast, and saturation." />} />
              <Route path="watermark" element={<ImageProcessor title="Watermark" description="Protect your images with text or logo watermarks." />} />
              <Route path="bulk" element={<ImageProcessor title="Batch Process" description="Apply changes to multiple images at once." />} />
              <Route path="to-pdf" element={<ImageProcessor title="Image to PDF" description="Convert one or more images into a PDF document." />} />
              <Route path="collage" element={<ImageProcessor title="Collage Maker" description="Create beautiful collages and grids from your photos." />} />
              <Route path="merge" element={<ImageProcessor title="Merge Images" description="Combine multiple images into a single file." />} />
              <Route path="responsive" element={<ImageProcessor title="Responsive Gen" description="Generate multiple sizes for responsive web design." />} />
              
              {/* Legacy/Specific Image Routes */}
              <Route path="white-background" element={<ImageProcessor title="White Background" description="Remove background and replace with pure white." />} />
              <Route path="triple-signature" element={<ImageProcessor title="Triple Signature" description="Generate 3 stacked signatures for UPSC requirements." />} />
              <Route path="declaration" element={<ImageProcessor title="Declaration Generator" description="Generate signed declarations for banking exams." />} />
              <Route path="signature-extractor" element={<ImageProcessor title="Signature Extractor" description="Remove background from signature images." />} />
              <Route path="ocr" element={<ImageProcessor title="OCR Scanner" description="Extract text from images and documents." />} />
              <Route path="exam-photo" element={<ExamPhotoValidator />} />
              <Route path="signature-canvas" element={<SignatureCanvas />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
      <Analytics />
    </Router>
  </FileProvider>
  );
}
