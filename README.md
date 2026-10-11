# LinkUp Gabon

LinkUp Gabon est une application web React de type marketplace de services de proximite. Elle met en relation des clients avec des prestataires locaux pour des missions rapides : depannage informatique, cours particuliers, livraison, design, montage video et creation web.

L'application est adaptee au contexte gabonais : quartiers de Libreville, Akanda, Owendo, Port-Gentil, budgets en FCFA et references aux paiements Airtel Money / Moov Money.

## Objectif du projet

Le projet montre les bases importantes de React :

- composants reutilisables ;
- props entre composants ;
- state avec `useState` ;
- effet avec `useEffect` pour sauvegarder les missions ;
- formulaire controle ;
- filtrage dynamique ;
- navigation simple entre les vues ;
- design responsive.

## Fonctionnalites

- consulter les prestataires disponibles ;
- rechercher par nom, role ou competence ;
- filtrer par categorie ;
- publier une mission avec un formulaire ;
- suivre les missions publiees ;
- changer le statut d'une mission ;
- conserver les missions dans le navigateur avec `localStorage`.
- ajouter un profil prestataire ;
- postuler a une mission ;
- accepter une candidature ;
- consulter des messages lies aux missions ;
- naviguer avec un footer complet.

## Lancer le projet

```bash
npm install
npm run dev
```

Si PowerShell bloque `npm`, utiliser :

```bash
npm.cmd install
npm.cmd run dev
```

## Structure

```text
src/
  components/
    Header.jsx
    Stats.jsx
    ProviderGrid.jsx
    RequestForm.jsx
    RequestList.jsx
    HowItWorks.jsx
  App.jsx
  data.js
  main.jsx
  styles.css
```
