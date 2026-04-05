import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const isProd = mode === 'production';

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],

    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      // Removes React dev warnings in prod
      ...(isProd && { 'process.env.NODE_ENV': '"production"' }),
    },

    resolve: {
      alias: { '@': path.resolve(__dirname, '.') },
    },

    build: {
      target: 'es2020',
      reportCompressedSize: true,
      // Inline assets under 4KB to save HTTP requests
      assetsInlineLimit: 4096,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          // Hash filenames for long-term caching
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          manualChunks(id) {
            // React core — tiny, cached forever
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
              return 'vendor-react';
            }
            // PDF processing — large, only loaded on /pdf/* pages
            if (id.includes('pdfjs-dist') || id.includes('pdf-lib') || id.includes('jspdf')) {
              return 'vendor-pdf';
            }
            // Image processing — loaded on /image/* pages
            if (id.includes('browser-image-compression') || id.includes('react-image-crop') || id.includes('@imgly')) {
              return 'vendor-image';
            }
            // Gemini AI — optional path
            if (id.includes('@google/genai')) {
              return 'vendor-ai';
            }
            // Motion — animation lib
            if (id.includes('motion')) {
              return 'vendor-motion';
            }
            // Lucide icons — split from app code
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
          },
        },
        // Warn if any single chunk exceeds 500KB gzipped
        onwarn(warning, warn) {
          if (warning.code === 'CIRCULAR_DEPENDENCY') return;
          warn(warning);
        },
      },
    },

    // Optimise dev server
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      warmup: {
        // Pre-bundle these on dev server start so first page load is instant
        clientFiles: ['./src/pages/Home.tsx', './src/components/Navbar.tsx'],
      },
    },

    // Pre-bundle deps to avoid waterfall requests in dev
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'lucide-react', 'motion/react'],
    },
  };
});
