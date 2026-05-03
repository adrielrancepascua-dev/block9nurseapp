const CACHE_NAME = 'nursepath-dean-demo-v1.4';

// Paths relative to this script so the app works when hosted in a subdirectory (e.g. university pages).
const BASE = new URL('./', self.location);
const OFFLINE_URL = new URL('index.html', BASE).href;
const OFFLINE_FALLBACK_HTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NursePath Offline</title>
<style>body{margin:0;background:#020617;color:#e2e8f0;font-family:Segoe UI,Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px}main{max-width:520px;border:1px solid #334155;background:#0f172a;border-radius:14px;padding:20px}h1{font-size:20px;margin:0 0 10px;color:#67e8f9}p{line-height:1.5;color:#cbd5e1}small{color:#94a3b8}</style></head>
<body><main><h1>NursePath is Offline</h1><p>The core app shell is not available yet on this device. Open NursePath once while online so it can cache required files for reliable offline use.</p><small>Simulation study tool only. Not for patient care decisions.</small></main></body></html>`;

const STATIC_ASSETS = [
  BASE.href,
  new URL('index.html', BASE).href,
  new URL('manifest.json', BASE).href,
  new URL('browserconfig.xml', BASE).href,
  self.location.href
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    }).then(() => {
      self.skipWaiting();
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, networkResponse.clone());
            });
          }
        }).catch(() => {});

        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.ok) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
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
