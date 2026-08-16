/**
 * Parcours de `assets/pictos` — les fichiers sont la source de vérité.
 *
 * Partagé par le générateur de registre et le générateur de sprite, pour que
 * la règle de nommage logique n'existe qu'à un seul endroit.
 */

import { readdirSync, statSync } from 'node:fs';
import { join, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const PICTOS_DIR = join(ROOT, 'assets', 'pictos');

/** Un seul fichier vit à la racine de `assets/pictos` : le picto de repli. */
export const FALLBACK_FILE = 'unknown.svg';

/**
 * Normalise un nom en identifiant logique : minuscules, séparateurs unifiés,
 * frontières de casse explicitées (`MonPicto` → `mon_picto`).
 *
 * Les fichiers de ce dépôt sont déjà canoniques — `check-naming.mjs` le
 * garantit — donc cette fonction est l'identité sur eux. Elle sert au
 * *bord* : normaliser ce qui vient de l'API côté client, dont on ne maîtrise
 * pas la forme.
 */
export function toGlyph(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase()
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/** Nom du symbole dans le sprite et du glyphe dans la police d'icônes. */
export function glyphName(family, glyph) {
  const kebabFamily = family
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
  return `picto-${kebabFamily}-${glyph.replace(/_/g, '-')}`;
}

/**
 * @returns {{families: string[], entries: Map<string, {family: string, glyph: string, formats: Map<string, string>}>}}
 */
export function collect() {
  const families = readdirSync(PICTOS_DIR)
    .filter((entry) => statSync(join(PICTOS_DIR, entry)).isDirectory())
    .sort();

  const entries = new Map();

  for (const family of families) {
    for (const file of readdirSync(join(PICTOS_DIR, family)).sort()) {
      const ext = extname(file).slice(1).toLowerCase();
      if (!ext) continue;
      const glyph = toGlyph(basename(file, extname(file)));
      const id = `${family}/${glyph}`;
      if (!entries.has(id)) {
        entries.set(id, { family, glyph, formats: new Map() });
      }
      const existing = entries.get(id).formats.get(ext);
      if (existing && existing !== file) {
        throw new Error(
          `Collision de nom logique : « ${existing} » et « ${file} » ` +
            `donnent tous deux ${id}.${ext}. Renommer l'un des deux fichiers.`,
        );
      }
      entries.get(id).formats.set(ext, file);
    }
  }

  return { families, entries };
}
