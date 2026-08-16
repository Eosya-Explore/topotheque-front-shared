/**
 * Génère `src/pictos.generated.ts` à partir de l'arborescence `assets/pictos`.
 *
 * Les fichiers sont la source de vérité, pas le registre : on ne renomme
 * jamais un fichier (des centaines de références statiques pointent dessus
 * côté web), on en dérive un *nom logique* normalisé. C'est ce nom que les
 * deux fronts s'échangent — le web le résout en chemin de fichier, l'app en
 * glyphe de police.
 *
 *     npm run generate   # régénère
 *     npm run check      # échoue si le fichier commité a divergé
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { collect, FALLBACK_FILE, ROOT } from './inventory.mjs';

const TARGET = join(ROOT, 'src', 'pictos.generated.ts');

function render({ families, entries }) {
  const records = [...entries.keys()]
    .sort()
    .map((id) => {
      const { family, glyph, formats } = entries.get(id);
      // SVG d'abord : c'est le format maître. Le PNG est un reliquat que
      // quelques composants web référencent encore en dur.
      const known = ['svg', 'png'].filter((ext) => formats.has(ext));
      const rest = [...formats.keys()].filter((ext) => !known.includes(ext));
      const files = [...known, ...rest.sort()]
        .map((ext) => `${ext}: ${JSON.stringify(formats.get(ext))}`)
        .join(', ');
      return (
        `  ${JSON.stringify(id)}: { family: ${JSON.stringify(family)}, ` +
        `glyph: ${JSON.stringify(glyph)}, files: { ${files} } },`
      );
    })
    .join('\n');

  return `// FICHIER GÉNÉRÉ — NE PAS ÉDITER À LA MAIN.
//
// Produit par \`npm run generate\` à partir de l'arborescence assets/pictos.
// Pour ajouter un pictogramme : déposer le SVG dans la bonne famille, puis
// régénérer. \`npm run check\` échoue si ce fichier ne correspond plus.

export type PictoFamily =
${families.map((f) => `  | ${JSON.stringify(f)}`).join('\n')};

/** Formats disponibles pour un pictogramme, par extension. */
export interface PictoFiles {
  svg?: string;
  png?: string;
}

export interface PictoEntry {
  family: PictoFamily;
  /** Nom logique normalisé — l'identité partagée entre les deux fronts. */
  glyph: string;
  /** Noms de fichiers réels, tels quels : ils ne sont jamais normalisés. */
  files: PictoFiles;
}

/** Pictogramme servi quand l'identifiant demandé est inconnu. */
export const FALLBACK_PICTO_FILE = ${JSON.stringify(FALLBACK_FILE)};

export const PICTOS: { [id: string]: PictoEntry } = {
${records}
};
`;
}

const content = render(collect());

if (process.argv.includes('--check')) {
  let current = '';
  try {
    current = readFileSync(TARGET, 'utf8');
  } catch {
    console.error(`${TARGET} est absent — lancer \`npm run generate\`.`);
    process.exit(1);
  }
  if (current !== content) {
    console.error(
      `${TARGET} ne correspond plus à assets/pictos — lancer \`npm run generate\`.`,
    );
    process.exit(1);
  }
  console.log(`${TARGET} est à jour.`);
} else {
  writeFileSync(TARGET, content, 'utf8');
  console.log(
    `${content.match(/^ {2}"/gm).length} pictogrammes écrits dans ${TARGET}.`,
  );
}
