/**
 * Garde-fou : tout fichier de `assets/` porte déjà un nom canonique.
 *
 * `toGlyph()` normalise ce qui entre depuis l'extérieur — un slug d'activité,
 * un type de POI venus de l'API, dont on ne maîtrise pas la forme. Il n'a pas
 * à rattraper *nos* fichiers : un dépôt de ressources qui contient
 * « positive elevation.svg » et « ZoneProtegee.svg » à côté de
 * « summit.svg » finit par produire des identifiants que personne ne devine.
 *
 * Ce contrôle refuse donc l'irrégularité à l'entrée plutôt que de l'absorber.
 * Convention : minuscules, chiffres et underscores.
 *
 *     npm run check
 */

import { readdirSync, statSync } from 'node:fs';
import { basename, extname, join } from 'node:path';

import { ROOT, toGlyph } from './inventory.mjs';

const ROOTS = ['assets/pictos', 'assets/icons'];

const offenders = [];

for (const root of ROOTS) {
  const dir = join(ROOT, root);
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const files = statSync(path).isDirectory()
      ? readdirSync(path).map((file) => join(path, file))
      : [path];
    for (const file of files) {
      const stem = basename(file, extname(file));
      const canonical = toGlyph(stem);
      if (canonical !== stem) {
        offenders.push(`  ${file.slice(ROOT.length + 1)}  →  ${canonical}`);
      }
    }
  }
}

if (offenders.length) {
  console.error(
    `${offenders.length} fichier(s) au nom non canonique ` +
      '(minuscules, chiffres, underscores) :',
  );
  console.error(offenders.join('\n'));
  process.exit(1);
}

console.log('Tous les noms de fichiers sont canoniques.');
