// ================================================================
//  Service Worker — Bella Brasil Market Plus
//  Cache-first for assets, network-first for API calls
// ================================================================

const CACHE_NAME = 'bellabrasil-v2030';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/shop.html',
  '/cart.html',
  '/checkout.html',
  '/about.html',
  '/contact.html',
  '/conta.html',
  '/css/style.css',
  '/js/cart.js',
  '/js/main.js',
  '/js/products.js',
  '/js/square-integration.js',
  '/images/logo.svg',
];

// Install: cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first for assets, network-first for API/dynamic
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET, chrome-extension, and backend API calls
  if (event.request.method !== 'GET') return;
  if (url.port === '3333') return; // backend
  if (url.protocol === 'chrome-extension:') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      const networkFetch = fetch(event.request)
        .then(response => {
          if (response.ok && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      // Return cached immediately if available, update in background
      return cached || networkFetch;
    })
  );
});
