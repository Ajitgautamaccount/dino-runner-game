const CACHE = 'dino-runner-v4';
const ASSETS = [
  '/dino-runner-game/',
  '/dino-runner-game/index.html',
  '/dino-runner-game/manifest.json',
  '/dino-runner-game/icon-192.svg',
  '/dino-runner-game/icon-512.svg',
  '/dino-runner-game/icon-maskable-192.svg',
  '/dino-runner-game/icon-maskable-512.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200) return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match('/dino-runner-game/index.html'));
    })
  );
});
