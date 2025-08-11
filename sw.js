// Offline cache
const CACHE_NAME = 'dtl-cache-v1';
const APP_SHELL = ['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install', e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL))); self.skipWaiting();});
self.addEventListener('activate', e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))); self.clients.claim();});
self.addEventListener('fetch', e=>{
  const req=e.request, url=new URL(req.url);
  if(req.destination==='document'||url.pathname.endsWith('/')){
    e.respondWith(fetch(req).then(res=>{caches.open(CACHE_NAME).then(c=>c.put(req,res.clone())); return res;}).catch(()=>caches.match(req)));
  }else{
    e.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{caches.open(CACHE_NAME).then(c=>c.put(req,res.clone())); return res;})));
  }
});