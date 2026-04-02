<div align="center">

# ExamPixl

**Free PDF & Image Tools — Built for Indian Students**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)

50+ free PDF and image tools that run entirely in your browser.  
No uploads. No account. No server. Just open and use.

[Live Demo](https://exampixl.com) · [Report a Bug](https://github.com/sam7041/exampixl/issues) · [Request a Feature](https://github.com/sam7041/exampixl/issues)

![ExamPixl Tools Preview](Image%201.png)

</div>

---

## What is ExamPixl?

ExamPixl is a browser-based document utility built specifically for Indian exam students — JEE, NEET, UPSC, SSC, IBPS, CUET, CAT, GATE and more. Every tool runs using the Web Canvas API and WebAssembly directly in the browser. Your files never leave your device.

---

## Features

### 🎯 Exam-Specific Tools
| Tool | What it does |
|---|---|
| **Exam Photo Validator** | Auto-resizes your passport photo to exact pixel dimensions, file size, and background specs for 8+ exams |
| **Signature Canvas** | Draw your signature and export it as a white-background PNG at the exact size each exam requires |
| **Triple Signature** | Generate 3 stacked signatures for UPSC form requirements |
| **White Background** | Remove background and replace with pure white for exam submissions |
| **Declaration Generator** | Generate signed declarations for banking exams |
| **Signature Extractor** | Remove background from signature images |

### 📄 PDF Tools (31+)
Compress · Merge · Split · Rotate · Watermark · Sign · Protect · Unlock · Organize · Page Numbers · Remove Pages · Extract Pages · OCR to Text · JPG to PDF · PDF to JPG · Word to PDF · PowerPoint to PDF · Excel to PDF · HTML to PDF · PDF to Word · PDF to PowerPoint · PDF to Excel · PDF to PDF/A · Scan to PDF · Edit · Redact · Compare · Repair · Crop · AI Summarizer · Translate

### 🖼️ Image Tools (25+)
Compress · Smart Resize · Format Converter · Crop · Remove Background · Change Background · Rotate & Flip · Filters & Effects · Adjustments · Borders & Padding · Round Corners · Watermark · WebP Optimizer · Strip Metadata · Progressive JPEG · Image to PDF · Batch Process · Collage Maker · Merge Images · Responsive Generator · OCR Scanner

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript 5.8 |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| PDF processing | pdf-lib, pdfjs-dist v5, jspdf |
| Image processing | Canvas API, browser-image-compression, @imgly/background-removal |
| OCR | Tesseract.js |
| HEIC support | heic2any |
| Animation | Motion (Framer Motion) |
| AI features | Google Gemini 2.0 Flash (optional) |
| Icons | Lucide React |
| Deployment | Vercel / Netlify / Cloudflare Pages |

---

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sam7041/exampixl.git
cd exampixl

# 2. Install dependencies
npm install

# 3. Set up environment variables (optional — only needed for AI tools)
cp .env.example .env.local
# Edit .env.local and add your Gemini API key if you want AI Summarizer / Translate

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
npm run dev       # Start development server on port 3000
npm run build     # Build for production (outputs to /dist)
npm run preview   # Preview the production build locally
npm run lint      # TypeScript type check (zero errors expected)
npm run clean     # Remove the dist folder
```

---

## Project Structure

```
exampixl/
├── public/
│   ├── sw.js              # Service worker (offline support + caching)
│   ├── manifest.json      # PWA manifest
│   ├── robots.txt         # Search engine directives
│   ├── sitemap.xml        # All tool URLs for Google indexing
│   └── logo.png           # Favicon and branding assets
├── src/
│   ├── App.tsx            # Router + all route definitions + RouteTracker
│   ├── main.tsx           # Entry point, SW registration, loader logic
│   ├── index.css          # Global styles, Tailwind theme, utility classes
│   ├── components/
│   │   ├── Navbar.tsx         # Sticky nav with mega-menu dropdowns
│   │   ├── Layout.tsx         # Page shell with Navbar + Footer
│   │   ├── ToolSubNav.tsx     # Tool-page horizontal sub-navigation
│   │   ├── WhatsAppShare.tsx  # Reusable WhatsApp share button
│   │   ├── CloudPicker.tsx    # Google Drive / Dropbox file picker
│   │   └── tools/
│   │       ├── ImageProcessor.tsx      # All image tools (25+ modes)
│   │       ├── PDFProcessor.tsx        # All PDF tools (31+ modes)
│   │       ├── ExamPhotoValidator.tsx  # Exam photo checker + auto-fix
│   │       ├── SignatureCanvas.tsx     # Signature drawing + export
│   │       ├── SubNav.tsx              # Tool navigation component
│   │       ├── image/
│   │       │   └── SmartResize.tsx     # Smart image resizing tool
│   │       └── pdf/
│   │           ├── PDFPreviewArea.tsx  # PDF preview component
│   │           └── PDFToolControls.tsx # PDF tool controls
│   ├── context/
│   │   └── FileContext.tsx    # Global file drop / paste context
│   ├── hooks/
│   │   ├── useSEO.ts          # Per-page title + meta description
│   │   ├── useRecentTools.ts  # "Recently used" tools in localStorage
│   │   └── useProcessor.ts    # Processing state management
│   ├── pages/
│   │   ├── Home.tsx           # Landing page with tool grid + recent tools
│   │   └── Contact.tsx        # Contact/Contact us page
│   └── lib/
│       └── utils.ts           # cn() helper (clsx + tailwind-merge)
├── index.html         # Critical CSS inline, SEO meta, JSON-LD
├── vite.config.ts     # Build config, manual chunks, optimizeDeps
├── tsconfig.json      # TypeScript configuration
├── package.json       # Project dependencies and scripts
├── vercel.json        # Deployment config + cache headers + security headers
├── netlify.toml       # Netlify deployment config
├── Image 1.png        # Preview/demo images
├── Image 2.png
├── Image 3.png
├── Image 4.png
├── Image 5.png
└── DEPLOY.md          # Step-by-step deployment guide for all platforms
```

---

## Deployment

The project is ready to deploy to Vercel, Netlify, or Cloudflare Pages — all free. See **[DEPLOY.md](DEPLOY.md)** for step-by-step instructions.

**Quickest path — Vercel:**

```bash
# Push to GitHub first
git add . && git commit -m "Initial commit" && git push

# Then go to vercel.com → Import repo → Deploy
# No configuration needed. Vite is auto-detected.
```

Your site will be live at `https://exampixl.vercel.app` within 60 seconds.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ❌ Optional | Enables AI Summarizer and Translate PDF. All other 50+ tools work without it. |

---

## Performance

ExamPixl is optimized for fast loads on Indian mobile networks:

- **Critical CSS inlined** in `index.html` — page has styles before any JS loads
- **Code splitting** — PDF libraries (~3MB) only load on `/pdf/*` pages, never on image pages
- **Service worker** — assets cached on first visit, subsequent loads are instant
- **1-year cache headers** on all hashed assets via `vercel.json`
- **Google Fonts** with `display=swap` — text renders immediately in system font
- **No per-card animations** on the homepage — 44 IntersectionObservers removed

---

## SEO

Each tool page sets its own `<title>`, `<meta description>`, `og:title`, `og:description`, and `<link rel=canonical>` via the `useSEO` hook. The sitemap covers all available tool URLs. After deploying, submit the sitemap to [Google Search Console](https://search.google.com/search-console).

---

## Contributing

Pull requests are welcome. For major changes please open an issue first.

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
# Make changes
npm run lint  # Must pass with zero errors
git commit -m "feat: describe your change"
git push origin feature/your-feature-name
# Open a pull request
```

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ for students by **Sameer Shukla**

[Portfolio](https://sameershuklapages.netlify.app) · [GitHub](https://github.com/sam7041) · [Medium](https://medium.com/@sameershukla590)

</div>
