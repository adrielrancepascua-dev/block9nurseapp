const CACHE_NAME = 'nursepath-dean-demo-v1.1';
const OFFLINE_URL = '/index.html';

// Files to cache for offline use
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/image-192.png',
  '/image-512.png'
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

// Fetch: CACHE-FIRST strategy for offline hospital use
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
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});

console.log('🏥 NursePath Service Worker loaded - Ready for offline hospital use!');
