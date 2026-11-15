# Plan d'entraînement T1-2027 — objectif Ardéchoise (La Volcanique)

Application web statique (GitHub Pages) pour :

- **présenter le plan** : 13 semaines, du 4 janvier au 4 avril 2027, avec les cibles en watts calculées à partir de la FTP ;
- **suivre les séances** : statut, durée, watts moyens/NP, FC, cadence, RPE, sensations, commentaire ;
- **suivre le poids et les tests FTP**, avec des graphiques (trajectoire vers 85 kg, objectif > 300 W) ;
- **archiver les données** : stockage local, export JSON/CSV et archivage optionnel dans ce dépôt (`data/journal.json`) via un jeton GitHub ;
- **consulter le document du plan** (onglet Document, imprimable ; version Markdown dans [`PLAN.md`](PLAN.md)).

Installable sur iPhone et PC : Partager → « Sur l'écran d'accueil », ou icône d'installation dans Chrome/Edge.

## Fichiers

| Fichier | Rôle |
|---|---|
| `plan.js` | **Source unique du plan** (séances, semaines, blocs) |
| `index.html`, `app.js`, `app.css` | Application |
| `build-doc.js` | Génère `PLAN.md` à partir de `plan.js` (`node build-doc.js 288`) |
| `sw.js`, `manifest.webmanifest`, `icon*` | Mode hors ligne et installation |
| `data/` | Archives du journal envoyées depuis l'application |

## Archivage GitHub

1. GitHub → Settings → Developer settings → *Fine-grained tokens* → créer un jeton limité au dépôt `Mon-Plan-T1-2027`, avec la permission **Contents : Read and write**.
2. Dans l'application : **Réglages → Archivage GitHub**, coller le jeton, puis **Archiver sur GitHub**.
3. Sur un autre appareil : même jeton, puis **Restaurer depuis GitHub** (les données sont fusionnées).

Le jeton n'est stocké que dans le navigateur de l'appareil. Il n'est jamais écrit dans le dépôt ni dans les exports.

## PDF du plan

`node build-pdf.js 288` génère `pdf/plan-print.html` dans la mise en page du plan FTP sept.-déc. 2026 (polices Barlow Condensed et IBM Plex, incluses dans `pdf/fonts`). Pour obtenir le PDF : ouvrir ce fichier dans Chrome, puis Imprimer → Enregistrer en PDF (A4, arrière-plans activés). Pour régénérer après un test, remplacer `288` par la nouvelle FTP.
