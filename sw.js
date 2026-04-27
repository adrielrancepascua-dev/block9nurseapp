const CACHE_NAME = 'nursepath-dean-demo-v1.3';
const OFFLINE_URL = '/index.html';
const OFFLINE_FALLBACK_HTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NursePath Offline</title>
<style>body{margin:0;background:#020617;color:#e2e8f0;font-family:Segoe UI,Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px}main{max-width:520px;border:1px solid #334155;background:#0f172a;border-radius:14px;padding:20px}h1{font-size:20px;margin:0 0 10px;color:#67e8f9}p{line-height:1.5;color:#cbd5e1}small{color:#94a3b8}</style></head>
<body><main><h1>NursePath is Offline</h1><p>The core app shell is not available yet on this device. Open NursePath once while online so it can cache required files for reliable offline use.</p><small>Simulation study tool only. Not for patient care decisions.</small></main></body></html>`;

// Files to cache for offline use, including the login/auth UI in index.html
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/sw.js'
];

// Install: cache all static assets
self.addEventListener('install', (event) => {
  console.log('🚀 NursePath Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Caching app for offline use...');
      return cache.addAll(STATIC_ASSETS)
        .catch((err) => {
          console.warn('⚠️ Some assets failed to cache:', err);
        });
    }).then(() => {
      console.log('✅ Service Worker installed - app available offline!');
      self.skipWaiting();
    })
  );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
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

// Fetch: CACHE-FIRST strategy for offline academic use
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Serve from cache (works offline!)
        console.log('📦 Serving from cache:', request.url);
        
        // Background update for next time
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, networkResponse.clone());
            });
          }
        }).catch(() => {});
        
        return cachedResponse;
      }

      // Not in cache - try network
      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.ok) {
          // Cache for future offline use
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Network failed - return offline page for navigation
        if (request.mode === 'navigate') {
          return caches.match(OFFLINE_URL).then((offlinePage) => {
            if (offlinePage) {
              return offlinePage;
            }
            return new Response(OFFLINE_FALLBACK_HTML, {
              headers: { 'Content-Type': 'text/html; charset=utf-8' },
              status: 200
            });
          });
        }
      });
    })
  );
});

console.log('🏥 NursePath Service Worker loaded - Ready for offline academic reinforcement!');
