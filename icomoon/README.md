# Projet icomoon

L'app NativeScript affiche ses icônes via une police (`app/fonts/app.ttf`).
Aujourd'hui cette police n'a **aucune source commitée** : ni dans MobileExplore,
ni ici. Le projet icomoon qui l'a produite vit sur un poste, ce qui rend toute
modification dépendante d'une personne.

C'est ce dossier qui règle ça.

## Ce qu'il faut y déposer

`project.json`, tel qu'exporté par <https://icomoon.io/app> (bouton *Download*
du projet, pas de la police). C'est ce fichier qu'on réimporte via
<https://icomoon.io/new-app> pour repartir de l'état exact.

## Convention de nommage

Le nom d'une icône dans icomoon doit être celui que produit `pictoGlyph()` :

```
picto-<famille-en-kebab>-<glyphe-en-kebab>

picto-activites-canyoning
picto-on-map-pois-summit
picto-topos-positive-elevation
```

C'est ce qui permet au code partagé de désigner un pictogramme sans savoir
comment il est rendu. `node scripts/build-sprite.mjs` produit la liste complète
des noms attendus (les `id` des `<symbol>` dans `dist/pictos.sprite.svg`).

## Régénérer la police

1. Importer `project.json` sur <https://icomoon.io/new-app>.
2. Remplacer ou ajouter les icônes depuis `../assets/icons/` et
   `../assets/pictos/` — les SVG de ce dépôt sont la source de vérité.
3. Exporter en police, récupérer `app.ttf` **et** le CSS/SCSS des variables.
4. Réexporter `project.json` et le commiter ici, dans le même commit.

L'étape 4 est celle qui compte : sans elle, on retombe dans la situation
actuelle au premier changement d'icône.

## Attention à la conversion

58 pictogrammes sur 87 utilisent des `stroke`. icomoon veut des tracés pleins :
les contours doivent être vectorisés, et une vectorisation approximative
déplace ou fait disparaître les traits fins aux petites tailles — les pins de
carte font 22 px. Une revue visuelle avant/après est nécessaire sur ces
pictogrammes, qui ont été validés en cinq tours.

`caving_select.svg` est un WebP déguisé en SVG : il n'a pas de source
vectorielle et ne peut pas entrer dans la police en l'état.
