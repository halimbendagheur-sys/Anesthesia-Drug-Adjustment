'use strict';
const CACHE_NAME = 'anesthesia-pwa-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png',
               './icons/icon-512.png', './icons/maskable-512.png'];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(req);
      // Cache successful same-origin and opaque cross-origin GET assets (Tailwind/fonts)
      // so they can be reused on later offline launches.
      if (response && (response.ok || response.type === 'opaque')) {
        try { await cache.put(req, response.clone()); } catch (_) {}
      }
      return response;
    } catch (err) {
      const cached = await cache.match(req, {ignoreVary: true});
      if (cached) return cached;
      if (new URL(req.url).origin === self.location.origin) {
        const fallback = await cache.match('./index.html');
        if (fallback) return fallback;
      }
      return new Response('This resource is not cached yet. Connect once to the internet, reopen the app, then try offline.', {
        status: 503, headers: {'Content-Type': 'text/plain; charset=utf-8'}
      });
    }
  })());
});
