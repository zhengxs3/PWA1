// sw-register.js – enregistrement SW + abonnement Push

const publicVapidKey = 'REMPLACEZ_ICECI_PAR_VOTRE_CLÉ_VAPID_PUBLIQUE'; // ⚠️ à générer via web‑push

if ('serviceWorker' in navigator && 'PushManager' in window) {
  window.addEventListener('load', async () => {
    try {
      // 1. Enregistrer le Service‑Worker
      const reg = await navigator.serviceWorker.register('service-worker.js');
      console.log('✅ Service‑Worker enregistré', reg);

      // 2. Vérifier la permission de notifications
      let permission = Notification.permission;
      if (permission === 'default') {
        permission = await Notification.requestPermission();
      }

      if (permission !== 'granted') {
        console.warn('Notifications non autorisées par l’utilisateur');
        return;
      }

      // 3. S’abonner aux Push Notifications si pas déjà abonné
      const existingSub = await reg.pushManager.getSubscription();
      if (existingSub) {
        console.log('Déjà abonné :', JSON.stringify(existingSub));
        return;
      }

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });

      console.log('📝 Nouvelle souscription :', JSON.stringify(subscription));
      // TODO : Envoyer `subscription` à votre back‑end pour stocker et pouvoir pousser
    } catch (err) {
      console.error('❌ Erreur d’enregistrement SW / Push', err);
    }
  });
}

// helper : transforme la clé VAPID base64→Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
