/**
 * Contrôle des libellés référencés par `filter-utils.ts`.
 *
 * Le fichier ne décrit que la mise en page ; les mots viennent du vocabulaire
 * généré (`field-labels.generated.ts`). Deux façons de le contredire, toutes
 * deux silencieuses :
 *
 * 1. un `label` écrit en dur : il est écrasé au chargement, donc mort — quatre
 *    dormaient ici, dont un « Présence d'étroiture » qui affichait déjà
 *    « Passage étroit » ;
 * 2. un préfixe de groupe ou un libellé de repli qui n'est la clé d'aucun
 *    groupe ni d'aucun champ : la ligne afficherait la clé telle quelle.
 */

import { readFileSync } from 'node:fs';

const vocabulary = readFileSync(new URL('../src/field-labels.generated.ts', import.meta.url), 'utf8');
const groupsAt = vocabulary.indexOf('export const GROUP_LABELS');
if (groupsAt === -1) {
  console.error('✗ Vocabulaire illisible : `GROUP_LABELS` absent de field-labels.generated.ts.');
  process.exit(1);
}
const FIELDS = new Set([...vocabulary.matchAll(/^\s{2}"([^"]+)": \{$/gm)].map((m) => m[1]));
const GROUPS = new Set([...vocabulary.slice(groupsAt).matchAll(/^\s{2}"([^"]+)": "/gm)].map((m) => m[1]));
if (FIELDS.size === 0 || GROUPS.size === 0) {
  console.error('✗ Vocabulaire illisible : aucun champ ou aucun groupe extrait.');
  process.exit(1);
}

const lines = readFileSync(new URL('../src/filter-utils.ts', import.meta.url), 'utf8').split('\n');
const errors = [];
let prefixes = 0;

lines.forEach((line, i) => {
  if (line.trim().startsWith('//')) return;

  if (/\blabel:\s*['"]/.test(line)) {
    errors.push(
      `src/filter-utils.ts:${i + 1} — « label » écrit en dur : ` +
        'le libellé vient du vocabulaire, cette valeur est écrasée au chargement.',
    );
  }

  const prefix = line.match(
    /^\s*(groupPrefix|fallbackLabel|fallbackGroupPrefix|secondFallbackLabel|secondFallbackGroupPrefix):\s*'([^']*)'/,
  );
  if (!prefix) return;
  prefixes += 1;
  const key = prefix[2];
  if (!/^[a-z][a-z0-9_]*$/.test(key)) {
    errors.push(`src/filter-utils.ts:${i + 1} — « ${key} » n'est pas une clé : le libellé se décide dans labels.py.`);
  } else if (!GROUPS.has(key) && !FIELDS.has(key)) {
    errors.push(`src/filter-utils.ts:${i + 1} — « ${key} » n'est ni un groupe ni un champ du vocabulaire.`);
  }
});

if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`);
  process.exit(1);
}
console.log(`Les ${prefixes} préfixes de groupe et libellés de repli de filter-utils sont des clés du vocabulaire, et aucun libellé n'y est écrit en dur.`);
