// Keeps the app working on the course with no signal: the app's own files are cached,
// and rounds are saved on the phone until they can sync.
const CACHE = 'sg-v10';
const SHELL = ['./', 'index.html', 'style.css', 'engine.js', 'app.js', 'config.js', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/apple-touch-icon.png',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.hostname.endsWith('supabase.co')) return; // data always goes to the network
  const own = u.origin === self.location.origin;
  // Own files: network first (skipping the browser's 10-minute cache) so updates arrive, cache when offline. Libraries and fonts: cache first.
  e.respondWith(own
    ? fetch(new Request(e.request.url, { cache: 'no-cache', credentials: 'same-origin' })).then((r) => { const c = r.clone(); caches.open(CACHE).then((x) => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request).then((r) => r || caches.match('index.html')))
    : caches.match(e.request).then((r) => r || fetch(e.request).then((res) => { const c = res.clone(); caches.open(CACHE).then((x) => x.put(e.request, c)); return res; })));
});
// Practice-day reminders
self.addEventListener('push', (e) => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (x) { d = { body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Practice day', { body: d.body || 'Your session is ready.', icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', data: { url: d.url || './?view=improve' } }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './?view=improve', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cs) => {
    for (const c of cs) { if (c.url.startsWith(self.registration.scope) && 'focus' in c) { c.navigate(url); return c.focus(); } }
    return self.clients.openWindow(url);
  }));
});
