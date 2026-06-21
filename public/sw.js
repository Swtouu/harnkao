const CACHE    = 'harnkao-v2';
const FONTS    = 'harnkao-fonts-v1';
const SHELL    = ['/HarnKao.html', '/manifest.json', '/Harnkao.png'];

// External hostnames that must always go to the network
const NETWORK_ONLY = new Set([
  'api.jsonbin.io',
  'api.exchangerate-api.com',
  'cdnjs.cloudflare.com'
]);

// ── Install: pre-cache the app shell ─────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL))
  );
  self.skipWaiting();
});

// ── Activate: delete old cache versions ──────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE && k !== FONTS).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Dynamic APIs: let the browser handle them (the app has its own fallbacks)
  if (NETWORK_ONLY.has(url.hostname)) return;

  // Google Fonts: stale-while-revalidate so the app works offline after first load
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(FONTS).then(cache =>
        cache.match(event.request).then(cached => {
          const fresh = fetch(event.request).then(res => {
            if (res.ok) cache.put(event.request, res.clone());
            return res;
          }).catch(() => cached); // offline: fall back to what we have
          return cached || fresh;
        })
      )
    );
    return;
  }

  // App shell: cache-first, update in background
  event.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(event.request).then(cached => {
        const fresh = fetch(event.request).then(res => {
          if (res.ok) cache.put(event.request, res.clone());
          return res;
        }).catch(() => cached || Response.error());
        return cached || fresh;
      })
    )
  );
});
