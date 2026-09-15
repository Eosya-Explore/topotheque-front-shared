/**
 * Contrôle des pictogrammes référencés par `filter-utils.ts`.
 *
 * Deux oublis sont possibles et tous deux silencieux jusqu'à l'image cassée
 * en production — l'un et l'autre se sont produits pendant la mise en commun :
 *
 * 1. une icône construite **dans le corps d'une fonction**, donc hors de la
 *    table que `resolveIcons()` parcourt : elle doit passer par
 *    `resolvedIcon()`, sinon l'identifiant logique arrive tel quel dans un
 *    `<img src>` ;
 * 2. un identifiant qui ne correspond à aucun pictogramme du registre : le
 *    repli rend `unknown.svg` sans rien dire.
 */

import { readFileSync } from 'node:fs';

// Le registre est lu comme du texte et non importé : il est écrit en
// TypeScript, que Node ne sait pas charger, et ce contrôle doit pouvoir
// tourner avant toute compilation.
const registry = readFileSync(new URL('../src/pictos.generated.ts', import.meta.url), 'utf8');
const KNOWN = new Set([...registry.matchAll(/^\s{2}"([^"]+)": \{ family:/gm)].map((m) => m[1]));
if (KNOWN.size === 0) {
  console.error('✗ Registre illisible : aucun identifiant extrait de pictos.generated.ts.');
  process.exit(1);
}

const SOURCE = new URL('../src/filter-utils.ts', import.meta.url);
const text = readFileSync(SOURCE, 'utf8');
const lines = text.split('\n');

// La table se termine là où commencent les fonctions utilitaires.
const tableEnd = lines.findIndex((l) => l.startsWith('export function vocabularyLabel'));
if (tableEnd === -1) {
  console.error('✗ Repère introuvable : `export function vocabularyLabel`.');
  process.exit(1);
}

const errors = [];
const ids = new Set();

lines.forEach((line, i) => {
  const literal = line.match(/^\s*icon: '([^']+)',?\s*$/);
  const wrapped = line.match(/^\s*icon: resolvedIcon\('([^']+)'\),?\s*$/);
  if (!literal && !wrapped) return;

  const id = (literal ?? wrapped)[1];
  ids.add(id);

  if (literal && i > tableEnd) {
    errors.push(
      `src/filter-utils.ts:${i + 1} — « ${id} » est construit hors de la table : ` +
        'envelopper dans resolvedIcon(), sinon aucun front ne le résoudra.',
    );
  }
  if (wrapped && i < tableEnd) {
    errors.push(
      `src/filter-utils.ts:${i + 1} — « ${id} » est dans la table : ` +
        'resolveIcons() s\'en charge, resolvedIcon() est inutile ici.',
    );
  }
});

// Les icônes d'interface ne sont pas des pictogrammes et n'ont pas de registre.
const UI_PREFIX = 'icons/';
for (const id of [...ids].sort()) {
  if (id.startsWith(UI_PREFIX)) continue;
  if (!KNOWN.has(id)) {
    errors.push(`« ${id} » ne correspond à aucun pictogramme du registre.`);
  }
}

if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`);
  process.exit(1);
}
console.log(`Les ${ids.size} pictogrammes de filter-utils sont résolus et connus du registre.`);
