// sw-register.js – enregistrement SW + abonnement Push
const CACHE_NAME = 'pwa-demo-v12'; 
const publicVapidKey =
  "BEWXhrAV4d7Boqb4wgTNXzSkmFK9G1wiBoQshXnBdWsSchxLe1jXOuiYqc6GBbqIHTukGYv3zoQinyHIjSXNy2c"; // ⚠️ à générer via web‑push
if ("serviceWorker" in navigator && "PushManager" in window) {
  window.addEventListener("load", async () => {
    try {
      // 1. Enregistrer le Service‑Worker
      const reg = await navigator.serviceWorker.register("service-worker.js");
      console.log("✅ Service‑Worker enregistré", reg);

      // 2. Vérifier la permission de notifications
      let permission = Notification.permission;
      if (permission === "default") {
        permission = await Notification.requestPermission();
      }

      if (permission !== "granted") {
        console.warn("Notifications non autorisées par l’utilisateur");
        return;
      }

      // 3. S’abonner aux Push Notifications si pas déjà abonné
      const existingSub = await reg.pushManager.getSubscription();
      if (existingSub) {
        console.log("Déjà abonné :", JSON.stringify(existingSub));
        return;
      }

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });

      console.log("📝 Nouvelle souscription :", JSON.stringify(subscription));
      // TODO : Envoyer subscription à votre back‑end pour stocker et pouvoir pousser
    } catch (err) {
      console.error("❌ Erreur d’enregistrement SW / Push", err);
    }
  });
}

// helper : transforme la clé VAPID base64→Uint8Array
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
// Ajoute un écouteur pour les messages envoyés depuis la page (via reg.active.postMessage)
self.addEventListener('message', event => {
  // Vérifie que le message contient l’action attendue
  if (event.data && event.data.action === 'test-notif') {
    console.log('📨 SW a reçu un message :', event.data);

    // Retarde volontairement la notification de 2 secondes
    setTimeout(() => {
      console.log('🔔 SW déclenche showNotification');

      // Affiche une notification système native avec un titre, un corps, une icône
      self.registration.showNotification('Direct test notif', {
        body: 'Test affichage brut',
        icon: 'icon.png',          // Image affichée dans la notif
        tag: 'debug',              // Sert à regrouper ou remplacer les notifs avec le même tag
        requireInteraction: true   // Garde la notif visible jusqu'à interaction de l'utilisateur
      });

    }, 2000); // 2 secondes de délai pour tester en changeant d’onglet
  }
});
