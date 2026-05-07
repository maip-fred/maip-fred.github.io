/* Service Worker — cache-first para assets estáticos */
var CACHE = 'aiv-v11';
var ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/skills.html',
  '/projects.html',
  '/contact.html',
  '/pkgxray.html',
  '/build.html',
  '/planck.html',
  '/universo.html',
  '/404.html',
  '/css/animations.css',
  '/css/tokens.css',
  '/css/base.css',
  '/css/components.css',
  '/css/effects.css',
  '/css/hero.css',
  '/css/about.css',
  '/css/skills.css',
  '/css/projects.css',
  '/css/contact.css',
  '/css/journey.css',
  '/css/theme.css',
  '/css/chatbot.css',
  '/css/galaxy.css',
  '/js/core.js',
  '/js/galaxy.js',
  '/js/dock.js',
  '/js/chatbot.js',
  '/js/sound.js',
  '/js/cmdk.js',
  '/js/cursor.js',
  '/js/easter-egg.js',
  '/js/loader.js',
  '/js/particles.js',
  '/js/terminal.js',
  '/js/pkgxray-demo.js',
  '/js/radar.js',
  '/js/contact.js',
  '/js/pypi-metrics.js',
  '/assets/favicon.svg',
  '/assets/manifest.json',
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE; })
            .map(function (k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  if (!e.request.url.startsWith(self.location.origin)) return;
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function (cached) {
      return cached || fetch(e.request).then(function (resp) {
        var clone = resp.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, clone); });
        return resp;
      });
    })
  );
});
