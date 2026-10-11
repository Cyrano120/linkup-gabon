# 🇬🇦 LinkUp Gabon

Marketplace de services de proximité — connecte clients, étudiants et freelances autour de Libreville, Akanda, Owendo et Port-Gentil.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FFCA28?logo=firebase&logoColor=black)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

**Demo live :** https://linkup-gabon.vercel.app

---

## 📸 Aperçu

> Ajoute une capture dans `docs/screenshot-home.png` pour l'afficher ici.

![Accueil LinkUp Gabon](docs/screenshot-home.png)

**Pages :** Accueil (hero + comment ça marche + témoignages) · Services (recherche + filtres) · Publier une mission · Missions (statuts + candidatures) · Devenir prestataire · Messages · Auth (login / register)

---

## ✨ Fonctionnalités

- 🔍 Recherche prestataires (nom, rôle, compétence, lieu) + filtres catégorie / quartier / budget / dispo
- 📝 Publier une mission (client, titre, budget FCFA, lieu, délai, description)
- 📋 Suivi missions : `Ouverte → En discussion → Confirmée → Terminée`
- 🤝 Candidatures : postuler comme prestataire, accepter un candidat
- 👤 Profils prestataires : prix, note, missions, taux de réussite, compétences, avis, galerie
- 💬 Messagerie liée aux missions + notifications EmailJS
- 🔐 Auth Firebase (email/password) + Firestore temps réel
- 📱 Responsive Tailwind (couleurs `gabon-green` / `gabon-yellow` / `gabon-blue`, glassmorphism)

---

## 🛠 Stack

| Couche | Techno |
|---|---|
| Front | React 18 + Vite 5 |
| Style | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Backend | Firebase Auth + Firestore |
| Email | EmailJS (`@emailjs/browser`) |
| Deploy | Vercel (auto-deploy depuis `main`) |

---

## 🚀 Démarrage rapide

```bash
git clone https://github.com/Cyrano120/linkup-gabon.git
cd linkup-gabon
npm install
cp .env.example .env   # puis remplis tes clés
npm run dev            # http://localhost:5173
```

Build prod :

```bash
npm run build
npm run preview
```

> Sous PowerShell si `npm` bloque : utilise `npm.cmd install` / `npm.cmd run dev`.

---

## 🔑 Variables d'environnement

Copie `.env.example` vers `.env` :

| Variable | Obligatoire | Description |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | ✅ | Clé API Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | ✅ | `xxx.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | ✅ | ID projet Firebase |
| `VITE_FIREBASE_STORAGE_BUCKET` | ✅ | Bucket storage |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ✅ | Sender ID |
| `VITE_FIREBASE_APP_ID` | ✅ | App ID |
| `VITE_EMAILJS_PUBLIC_KEY` | optionnel | Clé publique EmailJS |
| `VITE_EMAILJS_SERVICE_ID` | optionnel | Service ID EmailJS |
| `VITE_EMAILJS_TEMPLATE_ID` | optionnel | Template ID EmailJS |

⚠️ Ne commit jamais `.env` (déjà dans `.gitignore`). Sur Vercel, ajoute ces mêmes variables dans **Settings → Environment Variables**.

---

## 🔥 Firebase : règles + index

Règles (`firestore.rules`) — lecture publique, écriture authentifiée :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /providers/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /requests/{doc}  { allow read: if true; allow write: if request.auth != null; }
    match /messages/{doc}  { allow read: if true; allow write: if request.auth != null; }
  }
}
```

Déploie via console Firebase → Firestore → Rules, ou via CLI :

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes   # voir firestore.indexes.json
```

Active aussi **Authentication → Email/Password**.

---

## 📁 Structure

```
src/
  App.jsx               # vues + subscriptions Firestore + modales
  AuthContext.jsx       # login / register / logout + session
  firebase.js           # init Firebase (env VITE_*)
  firestore.js          # subscribe / add / update + validation
  email.js              # notifications EmailJS
  data.js               # seed démo (providers, requests, messages…)
  styles.css            # Tailwind + thème gabon + glass + animations
  components/
    Header.jsx  Footer.jsx  ProviderGrid.jsx
    RequestForm.jsx  RequestList.jsx  ProviderForm.jsx
    Login.jsx  Register.jsx  Stats.jsx  HowItWorks.jsx
firestore.rules
firestore.indexes.json
vercel.json
.env.example
```

---

## ▲ Déploiement Vercel (auto-deploy)

Le projet est prêt — `vercel.json` définit déjà `buildCommand: npm run build` et `outputDirectory: dist`.

1. Va sur https://vercel.com/new
2. **Import** → sélectionne `Cyrano120/linkup-gabon`
3. Framework détecté : **Vite** (sinon force `npm run build` / `dist`)
4. Ajoute les **Environment Variables** (voir tableau ci-dessus)
5. **Deploy** → chaque `git push` sur `main` redéploie automatiquement

Domaine par défaut : `https://linkup-gabon.vercel.app` (renommable dans Settings → Domains).

---

## 🗺 Roadmap

- [ ] Upload photo profil (Firebase Storage)
- [ ] Paiement Airtel / Moov Money (lien / QR)
- [ ] Notes + avis après mission terminée
- [ ] Recherche géolocalisée par quartier
- [ ] PWA offline

---

## 📄 Licence

Projet démo / portfolio — libre d'utilisation pédagogique.
