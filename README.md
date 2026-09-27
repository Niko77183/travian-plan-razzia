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

Une ferme explicitement marquée « désactivée » ou « inactive » dans une cellule de
statut après les données de sa ligne, ou sur une ligne suivante, est exclue. Une
icône ou une case à cocher non transmise dans le texte ne permet pas de connaître
cet état : copier uniquement les fermes actives dans ce cas. L'absence de dernier
pillage ne signifie pas que la ferme est désactivée.

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

    node tests/parser.test.cjs

## Déploiement

Page statique : `index.html` est publié tel quel par GitHub Pages depuis la racine
de la branche `main`.
