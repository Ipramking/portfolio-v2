/* ── Portfolio Service Worker ──────────────────────────────────
   Strategy:
   - Static assets (JS, CSS, fonts, icons) → Cache First
   - HTML pages                            → Network First (fresh content)
   - content.json                          → Network First (always latest)
   - External APIs (GitHub, thum.io, etc.) → Network Only
   ─────────────────────────────────────────────────────────── */

const CACHE_VERSION = 'portfolio-v1';
const STATIC_CACHE  = `${CACHE_VERSION}-static`;
const PAGES_CACHE   = `${CACHE_VERSION}-pages`;
const ALL_CACHES    = [STATIC_CACHE, PAGES_CACHE];

// Assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/icon-maskable.svg',
];

// ── Install ──────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate — clean up old caches ───────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => !ALL_CACHES.includes(k))
          .map(k  => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch ────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Skip external API calls entirely
  const externalHosts = [
    'api.github.com',
    'image.thum.io',
    'github-readme-stats.vercel.app',
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'cdn.jsdelivr.net',
  ];
  if (externalHosts.some(h => url.hostname.includes(h))) return;

  // content.json → Network First (always get latest published content)
  if (url.pathname === '/content.json') {
    event.respondWith(networkFirst(request, PAGES_CACHE));
    return;
  }

  // HTML navigation → Network First
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, PAGES_CACHE));
    return;
  }

  // JS / CSS / fonts / images → Cache First
  if (
    url.pathname.match(/\.(js|css|woff2?|ttf|otf|svg|png|jpg|ico|webp)$/)
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Everything else → Network First
  event.respondWith(networkFirst(request, PAGES_CACHE));
});

// ── Strategies ───────────────────────────────────────────────
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Fallback to root for navigation
    if (request.mode === 'navigate') {
      const root = await caches.match('/');
      if (root) return root;
    }
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}
