if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js") // ✅ Attention au chemin : sans "/"
      .then((reg) => {
        console.log("✅ Service Worker enregistré avec succès", reg);
      })
      .catch((err) => {
        console.error("❌ Échec de l'enregistrement du Service Worker", err);
      });
  });
}
