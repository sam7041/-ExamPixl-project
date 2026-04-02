import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const root = document.getElementById('root')!;
createRoot(root).render(<App />);

// Hide the initial loader once React has painted
const loader = document.getElementById('initial-loader');
if (loader) {
  // requestAnimationFrame ensures first real paint has happened
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      loader.classList.add('hidden');
      // Remove from DOM after fade transition finishes
      setTimeout(() => loader.remove(), 350);
    });
  });
}

// Register service worker after page is fully interactive
// Using 'load' event ensures SW registration never competes with page resources
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch(() => { /* fail silently in dev */ });
  });
}
