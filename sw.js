const CACHE_NAME = 'block9-nurse-v1.1';
const CDN_CACHE = 'block9-nurse-cdn-v1.1';
const OFFLINE_URL = '/index.html';

// Files to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/image-192.png',
  '/image-512.png',
  '/screenshot-narrow.png',
  '/screenshot-wide.png',
  '/sw.js'
];

// CDN resources to cache on first request
const CDN_RESOURCES = [
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install: cache static assets + CDN on first load
self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Caching app shell...');
      return cache.addAll(STATIC_ASSETS)
        .catch((err) => {
          console.warn('⚠️ Some assets failed to cache (may be offline):', err);
        });
    }).then(() => {
      // Also cache CDN resources on install
      return caches.open(CDN_CACHE).then((cdnCache) => {
        console.log('📦 Pre-caching CDN resources...');
        return Promise.all(
          CDN_RESOURCES.map((url) =>
            fetch(url)
              .then((response) => cdnCache.put(url, response))
              .catch((err) => console.warn(`⚠️ Failed to pre-cache ${url}:`, err))
          )
        );
      });
    }).then(() => {
      console.log('✅ Service Worker installed & ready');
      self.skipWaiting();
    })
  );
});

// Activate: clean old cache versions
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== CDN_CACHE)
          .map((name) => {
            console.log(`🗑️ Deleting old cache: ${name}`);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('✅ Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch: serve from cache first, network fallback, offline fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // For navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          console.log(`✅ Served from cache: ${url.pathname}`);
          return response;
        }
        return fetch(request).then((response) => {
          // Cache successful responses
          if (response && response.status === 200) {
            const cache = caches.open(CACHE_NAME);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        }).catch(() => {
          console.warn(`❌ Offline: ${url.pathname}`);
          return caches.match(OFFLINE_URL).catch(() => {
            return new Response(
              '<h1>Offline</h1><p>App is loading. Please ensure you have Wi-Fi enabled on first launch.</p>',
              { headers: { 'Content-Type': 'text/html' } }
            );
          });
        });
      })
    );
    return;
  }

  // For CDN resources (Tailwind, Font Awesome)
  if (url.hostname.includes('cdn.') || url.hostname.includes('cdnjs')) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          console.log(`✅ Served CDN from cache: ${url.hostname}`);
          return response;
        }
        return fetch(request).then((response) => {
          if (response && response.status === 200) {
            caches.open(CDN_CACHE).then((cache) => {
              cache.put(request, response.clone());
            });
          }
          return response;
        }).catch(() => {
          console.warn(`⚠️ CDN offline, serving cache: ${url.hostname}`);
          return caches.match(request);
        });
      })
    );
    return;
  }

  // For local assets (images, manifest, etc.)
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          console.log(`✅ Served asset from cache: ${url.pathname}`);
          return response;
        }
        return fetch(request).then((response) => {
          if (response && response.status === 200 && request.method === 'GET') {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, response.clone());
            });
          }
          return response;
        }).catch(() => {
          console.warn(`⚠️ Local asset offline: ${url.pathname}`);
          return caches.match(request);
        });
      })
    );
    return;
  }

  // Default: try network, fall back to cache
  event.respondWith(
    fetch(request).then((response) => {
      if (response && response.status === 200) {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, response.clone());
        });
      }
      return response;
    }).catch(() => {
      console.warn(`⚠️ Network error: ${url.href}`);
      return caches.match(request);
    })
  );
});

console.log('🔧 Service Worker loaded');
