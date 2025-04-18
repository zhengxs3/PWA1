// 📡 server.js – Serveur Node.js pour notifications Push

const express = require('express');              // Framework pour créer le serveur HTTP
const webpush = require('web-push');             // Librairie pour envoyer des notifications push
const bodyParser = require('body-parser');       // Permet de lire les requêtes JSON
const cors = require('cors');                    // Autorise les appels entre domaines (utile pour local)
require('dotenv').config();                      // Charge les variables d'environnement (.env)

const app = express();
const PORT = 4000;                               // Port d'écoute du serveur

// 🔧 Middleware
app.use(cors());                                 // Autorise les requêtes CORS
app.use(bodyParser.json());                      // Parse les requêtes JSON automatiquement

// 🔑 Configuration des clés VAPID (obligatoire pour Web Push)
webpush.setVapidDetails(
  'mailto:test@example.com',                      // Email de contact
  process.env.PUBLIC_VAPID_KEY,                 // Clé publique VAPID
  process.env.PRIVATE_VAPID_KEY                 // Clé privée VAPID
);

let subscriptions = []; // Stocke les abonnements reçus (en mémoire pour cette démo)

// 🔔 Route POST pour s'abonner aux notifications
app.post('/subscribe', (req, res) => {
  const sub = req.body;                         // Récupère la souscription envoyée par le client
  subscriptions.push(sub);                      // L'ajoute à la liste
  console.log('✅ Nouvelle souscription reçue');
  res.status(201).json({});                     // Répond avec un statut "Créé"
});

// 📤 Route POST pour envoyer une notification à tous les abonnés
app.post('/notify', async (req, res) => {
  const { title, body, url } = req.body;        // Récupère le contenu de la notification

  const payload = JSON.stringify({              // Prépare le message à envoyer
    title: title || 'Notification',
    body: body || 'Contenu vide',
    url: url || '/'
  });

  for (const sub of subscriptions) {            // Pour chaque abonné enregistré
    try {
      await webpush.sendNotification(sub, payload); // Envoie la notification push
      console.log('📤 Notification envoyée');
    } catch (err) {
      console.error('❌ Erreur d’envoi :', err);    // En cas d'erreur (ex : abonné invalide)
    }
  }

  res.status(200).json({ success: true });       // Répond au client que l'envoi est terminé
});

// 🚀 Lance le serveur sur le port défini
app.listen(PORT, () => {
  console.log(`📡 Push server listening on http://localhost:${PORT}`);
});
