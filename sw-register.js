// Nom du cache utilisé pour stocker les fichiers statiques
const CACHE_NAME = 'pwa-demo-v12';

// Clé VAPID publique pour s’abonner aux notifications Push
const publicVapidKey = "BEWXhrAV4d7Boqb4wgTNXzSkmFK9G1wiBoQshXnBdWsSchxLe1jXOuiYqc6GBbqIHTukGYv3zoQinyHIjSXNy2c";

// Vérifie que le navigateur supporte les Service Workers et les Push Notifications
if ("serviceWorker" in navigator && "PushManager" in window) {
  // Exécute ce bloc après le chargement complet de la page
  window.addEventListener("load", async () => {
    try {
      // Étape 1 : Enregistrement du Service Worker (fichier en arrière-plan)
      const reg = await navigator.serviceWorker.register("service-worker.js");
      console.log("✅ Service‑Worker enregistré", reg);

      // Étape 2 : Vérifie si l’utilisateur a déjà donné sa permission de notifications
      let permission = Notification.permission;
      if (permission === "default") {
        // Demande la permission à l'utilisateur si ce n’est pas encore fait
        permission = await Notification.requestPermission();
      }

      // Si l’utilisateur refuse, on arrête ici
      if (permission !== "granted") {
        console.warn("Notifications non autorisées par l’utilisateur");
        return;
      }

      // Étape 3 : Vérifie si l’utilisateur est déjà abonné aux Push
      const existingSub = await reg.pushManager.getSubscription();
      if (existingSub) {
        console.log("Déjà abonné :", JSON.stringify(existingSub));
        return; // Pas besoin de réabonner
      }

      // Étape 4 : S’abonne aux notifications Push (retourne un objet `subscription`)
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true, // Doit obligatoirement afficher une notif
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey), // Clé publique convertie 
      });//en passant une clé VAPID (clé publique générée pour identifier le serveur d’envoi sécurisé)

      console.log("📝 Nouvelle souscription :", JSON.stringify(subscription));
      // À ce stade : on pourrait envoyer cette souscription au back-end pour l’enregistrer

    } catch (err) {
      console.error("❌ Erreur d’enregistrement SW / Push", err);
    }
  });
}

// Fonction utilitaire : convertit une clé VAPID base64 en Uint8Array pour l'API PushManager
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
