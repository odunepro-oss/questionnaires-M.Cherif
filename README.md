# Questionnaires de cadrage · Chérif

Site Next.js contenant les deux questionnaires : Patrinove et la marque de soins intimes.

## Lancer le site

Ouvrir le Terminal, puis :

```
cd ~/Documents/Claude/Projects/CHERIF/04-QUESTIONNAIRES
npm install
npm run dev
```

Le site s'ouvre sur http://localhost:3000

`npm install` n'est à faire qu'une seule fois. Ensuite, `npm run dev` suffit.

## Structure

```
app/
  layout.js              police, navigation, métadonnées
  globals.css            toute la direction artistique
  page.js                accueil
  patrinove/page.js
  soins-intimes/page.js
components/
  Logo.js                logo Odune en SVG (repris du site)
  Nav.js                 pastille de navigation
  Questionnaire.js       le formulaire, l'enregistrement, les exports
data/
  questionnaires.js      TOUT le contenu des questions
public/images/           pour des visuels si besoin
_v1-html/                la première version en HTML statique
```

Pour modifier une question, ajouter un bloc ou changer un texte d'aide : uniquement `data/questionnaires.js`. Rien d'autre à toucher.

## Direction artistique

Reprise exacte de odune.fr :

| | |
|---|---|
| Fond | `#F9F8F7` |
| Encre | `#261B1A` |
| Gris de texte | `#635B5A` |
| Filets | `rgba(38,27,26,.12)` et `.30` |
| Typographie | Geist Mono 300 / 400 / 500 |
| Interlettrage | `-0.024em` |
| Rayon | `6px` |

Les polices Geist sont chargées en local via le paquet `geist` : aucune requête vers Google Fonts, et rien ne casse hors ligne.

## Fonctionnement

- Les réponses s'enregistrent automatiquement dans le navigateur de la personne qui remplit. Elle peut fermer et revenir.
- Chaque bloc peut recevoir des images, par clic ou par glisser-déposer.
- Deux sorties : **Copier le texte** (presse-papier) et **Exporter les réponses**, qui télécharge un fichier HTML autonome contenant les réponses et les images intégrées.
- Rien n'est envoyé sur un serveur. Tout reste dans le navigateur tant qu'on n'exporte pas.

## Mise en ligne, plus tard

Le projet est prêt pour Vercel. Si les réponses doivent arriver directement dans une boîte mail ou une base, il faudra ajouter une route d'API : c'est une demi-journée de travail, à faire au moment de la mise en ligne.
