# School Management — Version 100% française

## Installation

```bash
npm install
npm start
```

Puis ouvrir : http://localhost:3000

Comptes de démonstration :

| Rôle           | Nom  | Prénom | Mot de passe |
|----------------|------|--------|--------------|
| Administrateur | Den  | Arnaud | 0123         |
| Professeur     | Bob  | LeBon  | 1234         |
| Élève          | Jean | Martin | 0000         |

CLI historique toujours disponible : `npm run cli`.

## Ce qui a été fait dans cette livraison

### 1. Traduction complète du code en français

Tous les noms de variables, fonctions, paramètres et commentaires ont été traduits,
dans le backend (`db/`, `config/`, `utils/`, `auth/`, `services/`, `controllers/`,
`routes/`, `server.js`, `main.js`, `menu/`) et le frontend (`public/js/`).

**Ce qui n'a volontairement PAS été renommé** (pour ne rien casser) :
- Les noms de fichiers/dossiers (`controllers/`, `services/`...) : ce sont des termes
  d'architecture standards, utilisés tels quels même en français.
- Les colonnes SQL et les clés JSON échangées entre le frontend et le backend
  (`student_id`, `password`, `role`...) : ce sont des "contrats de données" partagés
  entre plusieurs fichiers ; les renommer aurait démultiplié les risques d'erreur pour
  un bénéfice de lisibilité minime, puisqu'ils n'apparaissent jamais affichés à
  l'écran.
- Les classes de la librairie FontAwesome (`fa-solid`, `fa-user`...) : imposées par
  la librairie externe, non traduisibles.

### 2. HTML et CSS traduits en français

Tous les identifiants (`id`), classes CSS et variables CSS ont été traduits
(`#loginForm` → `#formulaireConnexion`, `.stat-card` → `.carte-statistique`,
`--bg-dark` → `--fond-sombre`, etc.) sur les 4 pages et les 5 feuilles de style.

### 3. Design étendu et corrigé sur les 4 pages

Ta refonte néon (orange/vert, glassmorphism, FontAwesome) ne couvrait que la page de
connexion et le tableau de bord admin. En creusant, j'ai trouvé deux vrais problèmes :
- `public/css/teacher.css` et `public/css/student.css` utilisaient encore d'anciennes
  variables CSS (`--accent-blue`, `--white`...) qui n'existaient plus du tout dans le
  nouveau `global.css` : ces deux pages s'affichaient donc **sans aucun style**.
- Le panneau "Statistiques" et l'état "aucune donnée" utilisaient des classes
  (`.cards`, `.empty-state`) jamais stylées dans le nouveau design : ils s'affichaient
  eux aussi sans mise en forme.

J'ai étendu le thème néon aux tableaux de bord professeur (accent bleu) et élève
(accent vert émeraude), avec la même structure (en-tête, profil, carte de contenu),
et comblé les styles manquants (statistiques, état vide, boutons secondaires).

### 4. Bugs corrigés au passage

- `auth/authService.js` importait `{ log }` depuis `utils/logger.js`, qui n'exporte
  que `logger`. C'était une erreur de syntaxe qui **empêchait le CLI de démarrer**
  (`node main.js` plantait immédiatement). Corrigé et adapté à la nouvelle fonction
  `journaliser(message)`.
- `server.js` avait le même problème avec son import (inutilisé) de `logger.js`.
- `controllers/authController.js` répondait parfois en texte brut (`res.send(...)`)
  au lieu de JSON, ce qui aurait fait échouer silencieusement l'affichage du message
  d'erreur de connexion côté frontend (`response.json()` sur du texte brut).

## Vérifications effectuées

- Syntaxe de tous les fichiers JS validée (`node --check`).
- Serveur démarré et testé avec `curl` : connexion (succès/échec), CRUD complet sur
  chaque ressource, contrôle d'accès par rôle, endpoints `/me`.
- Toutes les pages HTML, CSS et JS confirmées accessibles (code 200).
- Correspondance vérifiée entre tous les `id`/`data-panel` utilisés en JavaScript et
  ceux présents dans le HTML (aucun identifiant orphelin).
- CSS vérifié (accolades équilibrées), HTML vérifié (balises bien formées).
