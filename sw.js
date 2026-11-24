// Network-first service worker: new deployments are always picked up when online,
// cached copies are used only when offline. Bump VERSION to invalidate old caches.
const VERSION = "2026-11-23-v3";
const CACHE = "treasure-quiz-" + VERSION;
const CORE = ["./", "./index.html", "./styles.css", "./src/main.js", "./src/game.js", "./src/art.js", "./src/audio.js", "./src/questions.js", "./manifest.webmanifest", "./icons/treasure.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => Promise.all(CORE.map((u) => fetch(u, { cache: "reload" }).then((r) => (r.ok ? cache.put(u, r) : null)).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(req, { cache: "no-cache" })
      .then((res) => { if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return res; })
      .catch(() => caches.match(req).then((hit) => hit || (req.mode === "navigate" ? caches.match("./index.html") : Response.error())))
  );
});
