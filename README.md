# topotheque-front-shared

Ressources communes aux deux fronts Topothèque : le web Angular
(`topotheque_clean_room/frontend`) et l'app NativeScript (`MobileExplore`).

Les deux dépôts restent indépendants et ne s'écrivent jamais l'un chez
l'autre : chacun **consomme** ce paquet à la version qu'il choisit.

## Ce qu'il contient

| | |
|---|---|
| `assets/pictos/` | 90 pictogrammes en 5 familles — **sources maîtresses** |
| `assets/icons/` | 33 icônes d'interface — sources de la police d'icônes de l'app |
| `src/pictos.generated.ts` | registre des noms logiques, généré depuis l'arborescence |
| `src/index.ts` | résolution d'un nom logique en chemin (web) ou en glyphe (app) |
| `scripts/build-sprite.mjs` | planche SVG unique pour le web |
| `icomoon/` | projet icomoon d'où sort `app.ttf` |

## Le problème que ça résout

Ce n'est pas la duplication des fichiers, c'est l'**adresse**. Le front web
construisait ses chemins en dur :

```ts
act['pictoSrc'] = 'assets/pictos/activites/' + actName + '.svg';
```

Cette ligne lie du code métier à une arborescence servie par un serveur HTTP.
L'app NativeScript, elle, affiche une police d'icônes — elle n'a pas de
chemins. Aucun code contenant cette construction ne pouvait donc être partagé,
et c'est la vraie raison pour laquelle `filterUtils.ts` existe en deux
exemplaires qui ont divergé.

Ici un pictogramme s'identifie par un nom logique, et chaque plateforme le
résout comme elle sait faire :

```ts
import { pictoPath, pictoGlyph } from '@eosya/topotheque-front-shared';

pictoPath('activites/canyoning')    // web → assets/pictos/activites/canyoning.svg
pictoGlyph('activites/canyoning')   // app → picto-activites-canyoning
```

Un identifiant inconnu retombe sur `unknown.svg` au lieu de produire une image
cassée — ce que faisait la concaténation.

## Les fichiers ne sont jamais renommés

Des centaines de références statiques pointent sur les noms actuels, et ces
noms sont irréguliers : espaces (`positive elevation.svg`), casse mixte
(`ZoneAdministrative.svg`), français et anglais mêlés (`Arrivee.svg`,
`summit.svg`). Le registre absorbe ces irrégularités au lieu de les corriger :

```
topos/positive_elevation   → « positive elevation.svg »
onMapPOIs/zone_administrative → « ZoneAdministrative.svg »
```

Renommer les fichiers casserait les 331 `<img src="assets/pictos/…">` du web
pour un gain nul : le nom logique suffit.

## Ajouter ou modifier un pictogramme

1. Déposer le SVG dans `assets/pictos/<famille>/`.
2. `npm run generate` — met le registre à jour.
3. Commiter les deux.

`npm run check` échoue si le registre ne correspond plus à l'arborescence ;
c'est ce qu'il faut brancher en CI.

## Pourquoi le web reste en SVG

L'app affiche une police d'icônes, ce qui est l'approche idiomatique en
NativeScript. Le web garde les SVG, pour des raisons qui lui sont propres :

- ses 341 usages sont des `<img alt="…">` porteurs de sens, y compris sur les
  pages rendues côté serveur pour les robots ; un glyphe de police est un
  caractère de zone privée qu'aucun lecteur d'écran ne sait lire ;
- 62 pictogrammes sur 91 utilisent des `stroke`, qu'une police obligerait à
  vectoriser — donc à retoucher des dessins validés ;
- 11 variantes `_select` sont bicolores (fond orange, symbole blanc), ce qu'un
  glyphe monochrome ne sait pas rendre ;
- si le `.ttf` échoue au chargement, toutes les icônes disparaissent d'un coup.

Les deux plateformes partent donc des **mêmes sources SVG** et en dérivent des
formats différents : `npm run build:sprite` pour le web, le projet icomoon pour
l'app. C'est la source qui est unique, pas le format de rendu.

## Limite connue

`assets/pictos/activites/caving_select.svg` est en réalité un fichier **WebP**
portant une extension `.svg`. Le navigateur l'affiche par reniflage de contenu,
mais il n'a aucune source vectorielle : il est exclu du sprite et ne pourra pas
entrer dans la police d'icônes. Il faudra le redessiner — décision de design, à
prendre à part.

Par ailleurs `diving` n'a pas de variante `_select` ; le repli du registre
évite l'image cassée que produisait la concaténation.

## Consommer le paquet

```jsonc
// package.json
"dependencies": {
  "@eosya/topotheque-front-shared": "git+ssh://git@github.com/Eosya-Explore/topotheque-front-shared.git#v0.1.0"
}
```

Le tag est explicite : une mise à jour est un commit dans le dépôt consommateur,
jamais un effet de bord.
