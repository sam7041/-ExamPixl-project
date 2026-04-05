// ExamPixl Service Worker
// Strategy: Cache-First for static assets, Network-First for HTML

const CACHE_NAME = 'exampixl-v1';
const STATIC_CACHE = 'exampixl-static-v1';

const PRECACHE_URLS = ['/', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME && k !== STATIC_CACHE).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin !== location.origin) return;

  // HTML: Network-First so users always get fresh content
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(res => {
          caches.open(CACHE_NAME).then(c => c.put(request, res.clone()));
          return res;
        })
        .catch(() => caches.match('/'))
    );
    return;
  }

  // Static assets: Cache-First (Vite hashes filenames so they're immutable)
  if (url.pathname.startsWith('/assets/') || url.pathname.match(/\.(js|css|png|svg|woff2|ico)$/)) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(res => {
          caches.open(STATIC_CACHE).then(c => c.put(request, res.clone()));
          return res;
        });
      })
    );
  }
});
