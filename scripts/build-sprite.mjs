/**
 * Assemble les pictogrammes SVG en une planche unique (`dist/pictos.sprite.svg`).
 *
 * C'est la réponse du web à ce que la police d'icônes apporte à l'app : une
 * seule ressource au lieu de quatre-vingt-dix requêtes, référencée par nom
 * logique — `<use href="pictos.sprite.svg#picto-activites-canyoning">` — sans
 * rien perdre au passage. Les tracés restent des tracés (62 pictos sur 91
 * utilisent des `stroke`, qu'une police obligerait à vectoriser), les
 * pictogrammes bicolores restent bicolores, et le texte alternatif reste
 * possible.
 *
 * Le sprite n'est pas encore branché côté web : les composants servent les
 * fichiers un par un. Il est produit ici pour que la bascule soit un choix de
 * rendu, pas un changement de source.
 *
 *     npm run build:sprite
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';

import { collect, glyphName, PICTOS_DIR, ROOT } from './inventory.mjs';

const OUT = join(ROOT, 'dist', 'pictos.sprite.svg');

/**
 * Préfixe les identifiants internes d'un pictogramme par celui du symbole.
 *
 * Les SVG exportés de Figma portent des `id` de clipPath (`clip0_1207_3150`)
 * référencés par `clip-path="url(#…)"`. Dans un document unique, deux fichiers
 * qui partageraient un identifiant verraient la référence résolue vers le
 * premier — un pictogramme rogné par le masque d'un autre, sans erreur. Les
 * exports actuels ne collisionnent pas ; le préfixe fait que ça reste vrai
 * quel que soit le prochain export.
 */
function namespaceIds(body, symbolId) {
  const ids = [...body.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  let output = body;
  for (const id of new Set(ids)) {
    const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    output = output
      .replace(new RegExp(`\\bid="${escaped}"`, 'g'), `id="${symbolId}__${id}"`)
      .replace(new RegExp(`url\\(#${escaped}\\)`, 'g'), `url(#${symbolId}__${id})`)
      .replace(new RegExp(`\\bhref="#${escaped}"`, 'g'), `href="#${symbolId}__${id}"`);
  }
  return output;
}

function symbolFor({ family, glyph, formats }) {
  const file = formats.get('svg');
  if (!file) return null;

  const source = readFileSync(join(PICTOS_DIR, family, file), 'utf8');
  const openTag = source.match(/<svg\b[^>]*>/);
  if (!openTag) {
    // `caving_select.svg` est en réalité un WebP portant une extension SVG :
    // le navigateur le sert quand même, par reniflage de contenu. On le
    // signale sans échouer — reprendre le dessin est une décision de design,
    // pas de build, et le web continue de l'afficher tel quel.
    console.warn(
      `  ignoré : ${family}/${file} n'est pas un SVG (aucune source vectorielle).`,
    );
    return null;
  }

  let viewBox = openTag[0].match(/viewBox="([^"]+)"/)?.[1];
  if (!viewBox) {
    const width = openTag[0].match(/\bwidth="([\d.]+)/)?.[1];
    const height = openTag[0].match(/\bheight="([\d.]+)/)?.[1];
    if (!width || !height) throw new Error(`${file} : ni viewBox ni dimensions.`);
    viewBox = `0 0 ${width} ${height}`;
  }

  const id = glyphName(family, glyph);
  const body = source
    .slice(openTag.index + openTag[0].length, source.lastIndexOf('</svg>'))
    .trim();

  return `  <symbol id="${id}" viewBox="${viewBox}">\n${namespaceIds(body, id)}\n  </symbol>`;
}

const { entries } = collect();
const symbols = [...entries.keys()]
  .sort()
  .map((id) => symbolFor(entries.get(id)))
  .filter(Boolean);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(
  OUT,
  `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${symbols.join('\n')}\n</svg>\n`,
  'utf8',
);
console.log(`${symbols.length} symboles écrits dans ${OUT}.`);
