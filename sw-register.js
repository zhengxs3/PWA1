if ("serviceWorker" in navigator) {
  // Vérifie si le navigateur supporte les Service Workers

  window.addEventListener("load", () => {
    // Enregistre le Service Worker après le chargement complet de la page

    navigator.serviceWorker
      .register("service-worker.js")
      .then((reg) => {
        // Si l'enregistrement réussit
        console.log("✅ Service Worker enregistré avec succès", reg);
      })
      .catch((err) => {
        // Si l'enregistrement échoue
        console.error("❌ Échec de l'enregistrement du Service Worker", err);
      });
  });
}
