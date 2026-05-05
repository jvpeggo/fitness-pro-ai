const CACHE = "fitness-ai-v2";

self.addEventListener("install", (event) => {
  self.skipWaiting(); // força ativação imediata

  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./app.js",
        "./manifest.json"
      ])
    )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE) {
            return caches.delete(key); // limpa cache antigo
          }
        })
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
