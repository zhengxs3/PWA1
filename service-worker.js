const CACHE_NAME = "my-pwa-v2"; 
// Nom du cache (à changer à chaque nouvelle version pour une bonne gestion)

const urlsToCache = ["/", "/index.html"];
// Liste des fichiers à mettre en cache, ici la page d'accueil et index.html

// Événement d'installation du service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    // Ouvre le cache spécifié
    caches.open(CACHE_NAME).then((cache) => {
      // Ajoute les fichiers à mettre en cache
      return cache.addAll(urlsToCache);
    })
  );
});

// Événement de récupération (fetch) — déclenché à chaque requête
self.addEventListener("fetch", (event) => {
  event.respondWith(
    // Cherche la ressource dans le cache
    caches.match(event.request).then((response) => {
      // Si trouvée, renvoie la ressource du cache, sinon va la chercher sur le réseau
      return response || fetch(event.request);
    })
  );
});
