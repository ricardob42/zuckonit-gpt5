// sw.js — Service Worker para cache básico PWA

const CACHE_NAME = 'zuckonit-cache-v1';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './manifest.json',
  './assets/default-avatar.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
  'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js'
];

// Instalación: cachear archivos estáticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activación: limpieza de caches viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if(key !== CACHE_NAME){
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: responder con cache o con fetch normal
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResp => {
      if(cachedResp) return cachedResp;
      return fetch(event.request);
    })
  );
});
