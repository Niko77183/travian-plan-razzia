# Plan de Razzia

Calculateur de troupes de pillage pour **Travian**.

Chaque ferme a sa propre duree d'aller-retour. Pour la frapper toutes les *X* minutes,
il faut autant de groupes de troupes en rotation que le cycle contient d'intervalles :

    groupes = plafond( (aller-retour + marge) / delai )
    troupes = groupes x troupes par vague

## Utilisation

1. Copier la page du point de ralliement (liste de pillage) et la coller dans le cadre.
2. Regler la vitesse effective, le delai entre attaques et la taille d'une vague.
3. Lire le total de troupes, les groupes par cible et le plan de departs.

Une cible est retenue si elle a un **nom**, des **coordonnees** et une **distance**.
Le reste de la page collee est ecarte, avec le detail de ce qui manque a chaque fragment.

Travian enrobe ses nombres de marques bidirectionnelles invisibles (U+202D / U+202C) :
le lecteur les retire avant analyse. Le diagnostic ligne par ligne les rend visibles.

## Deploiement

Page statique, sans dependance serveur. `index.html` est publie tel quel par GitHub Pages
(branche `main`, racine). Les reglages et la liste de cibles sont conserves dans le
navigateur du visiteur (localStorage) et ne quittent jamais son poste.
