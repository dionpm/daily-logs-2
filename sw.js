// Service worker (v3) to bust cache after updates
const CACHE_NAME = 'dtl-cache-v3';
const APP_SHELL = ['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install', (event) => { event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))); self.skipWaiting(); });
self.addEventListener('activate', (event) => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', (event) => {
  const req = event.request; const url = new URL(req.url);
  if (req.destination === 'document' || url.pathname.endsWith('/')) {
    event.respondWith(fetch(req).then(res => { caches.open(CACHE_NAME).then(c=>c.put(req,res.clone())); return res; }).catch(()=>caches.match(req)));
  } else {
    event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => { caches.open(CACHE_NAME).then(c=>c.put(req,res.clone())); return res; })));
  }
});
