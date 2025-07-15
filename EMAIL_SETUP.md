# Configuration Email pour FocusLight Commerce

## 📧 Configuration Email Simple (Gmail)

### Étape 1: Créer un email dédié

1. Créez un Gmail dédié à votre boutique : `boutique.focuslight@gmail.com`
2. Activez la validation en 2 étapes
3. Générez un "Mot de passe d'application" pour l'e-commerce

### Étape 2: Variables d'environnement

```bash
# Dans votre fichier .env
SHOP_EMAIL=boutique.focuslight@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=boutique.focuslight@gmail.com
SMTP_PASS=votre_mot_de_passe_dapp
ADMIN_EMAIL=altolille@gmail.com
```

### Étape 3: Test rapide

Le système envoie automatiquement :

- ✅ **Email au client** : Confirmation avec récap de commande
- 🚨 **Email admin** (vous) : Notification avec toutes les infos pour traiter

## 📱 Pour les SMS (plus tard)

```bash
# Optionnel - Twilio pour SMS
TWILIO_SID=your_sid
TWILIO_TOKEN=your_token
TWILIO_PHONE=+33123456789
```

## 🔧 Installation

```bash
cd server
npm install nodemailer @types/nodemailer
```

## 📝 Processus automatique

1. **Client commande** → Email de confirmation envoyé automatiquement
2. **Vous recevez** → Email avec tout le détail pour traiter
3. **Vous préparez** → Envoi manuel avec Mondial Relay
4. **Vous envoyez** → Email manuel avec lien de suivi

## ✅ Avantages

- ✅ Pas de compte client requis
- ✅ Email automatique pour rassurer
- ✅ Vous avez toutes les infos pour traiter
- ✅ Téléphone stocké pour contact d'urgence
- ✅ Backup automatique des commandes
- ✅ Légal en France (pas besoin de comptes)

## 📋 Actions manuelles (simples)

1. Lire email de notification
2. Préparer le colis
3. Imprimer étiquette Mondial Relay
4. Envoyer + email de suivi client
