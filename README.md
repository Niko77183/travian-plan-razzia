# Plan de Razzia

Calculateur de troupes de pillage pour **Travian**.

Pour frapper chaque ferme toutes les X minutes :

    groupes = plafond((aller-retour + marge) / délai)
    troupes = groupes × troupes par vague

## Utilisation

1. Copier la page du point de ralliement (liste de pillage) et la coller dans le cadre.
2. Régler la vitesse effective, le délai entre attaques et la taille d'une vague.
3. Lire le total de troupes, les groupes par cible et le plan de départs.

Le lecteur reconnaît les oasis et les villages, quel que soit leur nom. Les lignes
copiées du tableau contiennent le nom, la population et la distance, séparés par
des tabulations ; les troupes et les butins peuvent figurer sur les lignes suivantes.
Les chiffres du nom restent dans le nom et ne décalent pas les colonnes numériques.
Les formats précédents avec coordonnées et distance restent acceptés.

Les coordonnées ne sont pas toujours présentes dans le texte copié depuis Travian.
Dans ce cas, l'interface affiche un tiret et identifie la cible par son nom complet
et sa distance. Deux villages de même nom et même distance ne peuvent donc pas être
distingués sans coordonnées ; un changement de nom ou de distance crée une nouvelle
identité pour le suivi du rendement. Aucune coordonnée n'est inventée.

Le collage direct (Ctrl + V) conserve aussi le HTML du presse-papiers, lorsqu'il
est fourni par le navigateur. Ses marqueurs de désactivation (classes de ligne,
état explicite, opacité, ou couleur grise contrastant avec les autres cibles)
permettent d'isoler les fermes désactivées. Le HTML est lu dans un template inerte,
jamais inséré dans l'interface ni enregistré ou synchronisé.

Les fermes désactivées sont regroupées dans « Fermes exclues », hors calcul de
troupes, de groupes, de faisabilité et de départs. Le bouton « Exclure » et le
collage d'une liste de fermes à exclure permettent de corriger un collage dont
l'état visuel est absent. « Réintégrer » annule l'exclusion ; un nouveau collage
explicitement désactivé l'applique de nouveau. Les exclusions restent enregistrées
localement et sont conservées lors des prochains imports. Les nouveaux relevés de
rendement ignorent également les fermes exclues, sans effacer les anciens relevés.

Une case non cochée, un butin nul ou l'absence de dernier pillage ne suffisent pas
à établir une désactivation. La détection automatique dépend des métadonnées
réellement conservées par le navigateur ; le texte seul ne contient pas le grisement.

Travian enrobe ses nombres de marques bidirectionnelles invisibles : le lecteur
les retire et gère les séparateurs de milliers avant analyse. Le diagnostic ligne
par ligne et le détail des fragments écartés permettent de contrôler le résultat.

## Rendement et stockage

L'onglet rendement compare des relevés successifs de butin cumulé. Les réglages,
les cibles et les relevés sont conservés dans le navigateur (localStorage). Les
relevés sont également synchronisés avec Firebase lorsque la connexion et les
règles d'accès le permettent ; le mode local reste disponible sinon.

## Tests

Avec Node.js, depuis le dossier du dépôt :

    npm ci
    npm test

## Déploiement

Page statique : `index.html` est publié tel quel par GitHub Pages depuis la racine
de la branche `main`.
