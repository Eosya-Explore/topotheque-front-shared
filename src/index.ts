/**
 * Ressources communes aux deux fronts Topothèque.
 *
 * Le problème que ce paquet résout n'est pas la duplication des fichiers,
 * c'est l'**adresse** : le front web construisait des chemins en dur
 * (`'assets/pictos/activites/' + activite + '.svg'`), ce qui liait le code
 * métier à une arborescence de fichiers servie par un serveur HTTP. L'app
 * NativeScript, elle, affiche une police d'icônes : elle n'a pas de chemins.
 * Aucun code partageant ces constructions ne pouvait donc être commun.
 *
 * Ici, un pictogramme s'identifie par un **nom logique** — `activites/canyoning`
 * — et chaque plateforme le résout à sa façon :
 *
 *     pictoPath('activites/canyoning')   // web  → assets/pictos/activites/canyoning.svg
 *     pictoGlyph('activites/canyoning')  // app  → picto-activites-canyoning
 *
 * Les fichiers ne sont jamais renommés (des centaines de références statiques
 * pointent dessus) : c'est le registre généré qui absorbe leurs irrégularités
 * de nommage — espaces, casse mixte, français et anglais mêlés.
 */

export type { PictoEntry, PictoFamily, PictoFiles } from './pictos.generated.js';
export { FALLBACK_PICTO_FILE, PICTOS } from './pictos.generated.js';

import {
  FALLBACK_PICTO_FILE,
  PICTOS,
  type PictoEntry,
  type PictoFamily,
} from './pictos.generated.js';

/** Identifiant logique d'un pictogramme : `famille/glyphe`. */
export type PictoId = string;

export type PictoFormat = 'svg' | 'png';

/**
 * Normalise un libellé brut en nom de glyphe.
 *
 * Les valeurs qui arrivent de l'API (slugs d'activité, codes de POI) sont
 * déjà en minuscules et en underscores : la fonction est alors l'identité.
 * Elle sert aux cas où ce n'est pas garanti.
 */
export function toGlyph(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase()
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/** Compose un identifiant à partir d'une famille et d'un nom brut. */
export function pictoId(family: PictoFamily, name: string): PictoId {
  return `${family}/${toGlyph(name)}`;
}

export function getPicto(id: PictoId): PictoEntry | undefined {
  return PICTOS[id];
}

export function hasPicto(id: PictoId): boolean {
  return id in PICTOS;
}

/** Tous les identifiants d'une famille, triés. */
export function pictosOfFamily(family: PictoFamily): PictoId[] {
  return Object.keys(PICTOS)
    .filter((id) => PICTOS[id].family === family)
    .sort();
}

export interface PictoPathOptions {
  /**
   * Racine sous laquelle les assets sont servis. Le web sert tantôt
   * `assets/…` (relatif) tantôt `/assets/…` (absolu) selon les composants :
   * le choix reste à l'appelant.
   */
  base?: string;
  /** Format souhaité. Par défaut le SVG, avec repli sur le PNG. */
  format?: PictoFormat;
}

/**
 * Chemin du fichier à servir, avec repli sur `unknown.svg`.
 *
 * Le repli est le vrai apport par rapport au chemin construit en dur : une
 * activité inconnue du front donnait jusqu'ici une image cassée.
 */
export function pictoPath(id: PictoId, options: PictoPathOptions = {}): string {
  const base = options.base ?? 'assets';
  const entry = PICTOS[id];
  if (!entry) return `${base}/pictos/${FALLBACK_PICTO_FILE}`;

  const preferred = options.format ?? 'svg';
  const file =
    entry.files[preferred] ?? entry.files.svg ?? entry.files.png;
  if (!file) return `${base}/pictos/${FALLBACK_PICTO_FILE}`;

  return `${base}/pictos/${entry.family}/${file}`;
}

/**
 * Nom de glyphe dans la police d'icônes, pour les plateformes qui n'affichent
 * pas de fichiers. Convention : `picto-<famille>-<glyphe>`, en minuscules et
 * tirets — c'est le nom à donner à l'icône dans le projet icomoon.
 */
export function pictoGlyph(id: PictoId): string {
  const entry = PICTOS[id];
  if (!entry) return 'picto-unknown';
  const family = entry.family.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  return `picto-${family}-${entry.glyph.replace(/_/g, '-')}`;
}
