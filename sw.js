// Block 9 Nurse - Service Worker (navigation fallback)
const CACHE_NAME = 'block9-nurse-v4';

self.addEventListener('install', (event) => {
  console.log('SW: installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('SW: cache opened');
        return cache.add('/nurse_app.html').catch(() => {
          console.log('SW: could not cache nurse_app.html during install');
        });
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  console.log('SW: activating...');
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) {
            console.log('SW: deleting old cache', k);
            return caches.delete(k);
          }
        })
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Navigation requests (HTML) — serve app shell from cache, fallback to network
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match('/nurse_app.html').then((cached) => {
        return cached || fetch(req).then((netResp) => {
          if (netResp && netResp.ok) {
            caches.open(CACHE_NAME).then((c) => c.put('/nurse_app.html', netResp.clone()));
          }
          return netResp;
        }).catch(() => {
          return new Response('<!doctype html><title>Offline</title><h1 style="color:#06b6d4;background:#0f172a;padding:1rem">Block 9 Nurse</h1><p style="color:#94a3b8;padding:1rem">Unable to load offline. Ensure the app was fully cached before going offline.</p>', { headers: { 'Content-Type': 'text/html' } });
        });
      })
    );
    return;
  }

  // Same-origin requests — cache first
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then((net) => {
        if (net && net.ok) caches.open(CACHE_NAME).then((c) => c.put(req, net.clone()));
        return net;
      }))
    );
    return;
  }

  // Cross-origin (CDN) — network first, fall back to cache
  event.respondWith(
    fetch(req)
      .then((net) => {
        if (net && net.ok) caches.open(CACHE_NAME).then((c) => c.put(req, net.clone()));
        return net;
      })
      .catch(() => caches.match(req))
  );
});

console.log('✅ Block 9 Nurse Service Worker loaded');
