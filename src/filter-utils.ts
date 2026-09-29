// Centralisation des filtres et champs par activité, commune aux deux fronts.
//
// Les LIBELLÉS ne sont pas ici : ils viennent du vocabulaire canonique du
// backend (`field-labels.generated.ts`). Ce fichier ne décrit que la mise en
// page — groupes, ordre, pictos, formatage — qui est bien une décision de
// front, et la seule partie qu'il soit légitime de partager entre un web
// Angular et une app NativeScript.
//
// Les PICTOGRAMMES y sont des noms logiques (`topos/duration`), jamais des
// chemins : le web sert des fichiers, l'app affiche une police d'icônes.
// Résoudre ici reviendrait à réserver ce fichier à une plateforme — c'est
// précisément ce qui l'avait fait exister en deux exemplaires divergents.
// Chaque front applique `resolveIcons()` une fois au démarrage.
import {
  FIELD_ALIASES,
  FIELD_LABELS,
  GROUP_LABELS,
} from './field-labels.generated.js';

export interface ActivityFieldConfig {
  key: string;
  /** Injecté depuis le vocabulaire canonique — ne pas écrire à la main. */
  label?: string;
  unit?: string;
  orderKey?: string;
  group?: string;
  groupSeparator?: string;
  /**
   * Libellé de la ligne composée : une clé de `GROUP_LABELS`, ou celle d'un
   * champ quand le groupe se nomme comme lui. Résolue au chargement, comme
   * `label`. Absent, la ligne prend le libellé de son premier champ.
   */
  groupPrefix?: string;
  itemPrefix?: string;
  itemSuffix?: string;
  valueFormatter?: (value: any) => string;
  icon?: string;
  hide?: boolean;
  /** Champ affiché à la place quand celui-ci est vide. */
  fallbackKey?: string;
  /**
   * Libellés pris sous repli — des clés (champ ou groupe), résolues au
   * chargement. Absents, la ligne garde son libellé.
   */
  fallbackLabel?: string;
  fallbackGroupPrefix?: string;
  secondFallbackKey?: string;
  secondFallbackLabel?: string;
  secondFallbackGroupPrefix?: string;
  displayContextOverrides?: {
    [context: string]: Partial<
      Omit<
        ActivityFieldConfig,
        'key' | 'valueFormatter' | 'displayContextOverrides'
      >
    > & {
      key?: string;
      hide?: boolean;
      group?: string | null;
      groupSeparator?: string | null;
      groupPrefix?: string | null;
      itemPrefix?: string | null;
      itemSuffix?: string | null;
      orderKey?: string | null;
    };
  };
}

export interface ActivityConfig {
  name: string;
  fields: {
    [group: string]: ActivityFieldConfig[];
  };
}

// Fonctions utilitaires pour le formatage des valeurs
/**
 * Libellés de `Guide.shuttle` (nécessité d'une navette). L'API sert la clé
 * anglaise ; les libellés sont ceux du backend (`Guide.SHUTTLE`,
 * `filter_labels.VALUE_LABEL_OVERRIDES`). Une valeur inconnue est rendue
 * telle quelle plutôt que masquée.
 */
export const SHUTTLE_LABELS: Record<string, string> = {
  required: 'Navette nécessaire',
  possible: 'Navette possible',
  no_shuttle: 'Sans navette',
};

export function formatShuttle(val: string): string {
  return SHUTTLE_LABELS[val] ?? val;
}

export function formatDurationMinutesToHours(val: number) {
  // Espace insécable
  const nbsp = '\u00A0';
  if (val < 60) {
    return `${val}${nbsp}min`;
  }
  const heures = Math.floor(val / 60);
  const minutes = val % 60;
  // Format : 5 h 30 ou 5 h
  return minutes > 0 ? `${heures}${nbsp}h${nbsp}${minutes}` : `${heures}${nbsp}h`;
}


export function convertToRoman(val: string | number) {
  if (!val) return '';

  // Vérifie si la valeur est déjà en chiffres romains (I, II, III, IV, etc.)
  if (typeof val === 'string' && /^[IVXLCDM]+$/i.test(val.trim())) {
    return val.toUpperCase();
  }

  if (typeof val === 'number') {
    const romanNumerals = [
      { value: 1000, numeral: 'M' },
      { value: 900, numeral: 'CM' },
      { value: 500, numeral: 'D' },
      { value: 400, numeral: 'CD' },
      { value: 100, numeral: 'C' },
      { value: 90, numeral: 'XC' },
      { value: 50, numeral: 'L' },
      { value: 40, numeral: 'XL' },
      { value: 10, numeral: 'X' },
      { value: 9, numeral: 'IX' },
      { value: 5, numeral: 'V' },
      { value: 4, numeral: 'IV' },
      { value: 1, numeral: 'I' },
    ];
    let result = '';

    let remaining = val;
    for (const { value, numeral } of romanNumerals) {
      while (remaining >= value) {
        result += numeral;
        remaining -= value;
      }
    }
    return result;
  }
  return '';
}

function capitalize(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  // Post F-flight-type-m2m : Guide.flight_type devient list[str].
  // Récursivement : chaque item capitalisé, items vides filtrés, joints en ", ".
  if (Array.isArray(value)) {
    return value
      .map((item) => capitalize(item))
      .filter((item) => item !== '')
      .join(', ');
  }

  const stringValue = String(value);
  if (!stringValue) {
    return stringValue;
  }

  return stringValue.charAt(0).toUpperCase() + stringValue.slice(1).toLowerCase();
}


// Mapping slug (EN parapentiste, post-migration 0050/0051/0052) → label
// FR pour l'affichage des types de vol dans les cards / popup / detail
// d'un guide. Doit rester synchronisé avec FLIGHT_TYPE_CHOICES côté
// backend (models.py) et flightTypes dans filter-paraglide.component.ts.
const FLIGHT_TYPE_LABELS: { [slug: string]: string } = {
  thermal: 'Thermique',
  dynamic: 'Dynamique',
  soaring: 'Soaring',
  cross: 'Cross',
  static: 'Statique',
  restitution: 'Restitution',
  ground_handling: 'Gonflage',
  mountain_flying: 'Montagne',
  morning_flight: 'Vol du matin',
  afternoon_flight: "Vol de l'après-midi",
  evening_flight: 'Vol du soir',
  training_slope: 'Pente école',
  wagga: 'Wagga',
  ski_flight: 'Vol à ski',
  mountaineering_flight: 'Paralpinisme',
};

// Style de grimpe : slug EN (ClimbingStyle.value backend) → libellé FR.
const CLIMBING_STYLE_LABELS: { [slug: string]: string } = {
  crimps: 'Réglettes',
  overhang: 'Dévers',
  cracks: 'Fissures',
  slab: 'Dalle',
  technical_wall: 'Mur technique',
  vertical_wall: 'Mur vertical',
  layered_wall: 'Mur à strate',
  flint_wall: 'Mur à silex',
  dihedral: 'Dièdre',
};

function formatClimbingStyles(value: any): string {
  if (value === null || value === undefined) return '';
  const items = Array.isArray(value) ? value : [value];
  return items
    .map((item: any) => {
      // Le backend envoie désormais le LIBELLÉ FR prêt à afficher (y compris pour les
      // styles ajoutés hors des 9 standard) — on l'affiche TEL QUEL. La table figée ne
      // sert plus qu'à mapper un éventuel slug EN legacy (réponse cachée).
      const raw =
        item && typeof item === 'object'
          ? item.label ?? item.value ?? ''
          : item;
      const label = String(raw || '').trim();
      return CLIMBING_STYLE_LABELS[label] || label;
    })
    .filter((s: string) => s !== '')
    .join(', ');
}

function formatFlightTypes(value: any): string {
  if (value === null || value === undefined) return '';
  const items = Array.isArray(value) ? value : [value];
  return items
    .map((item: any) => {
      // La donnée peut être un slug (string) ou un objet M2M ({value}/{label}).
      const raw =
        item && typeof item === 'object'
          ? item.value ?? item.label ?? ''
          : item;
      const slug = String(raw || '').trim();
      // Fallback : si le slug n'est pas mappé (cas migration partielle
      // ou ancien guide avec valeur legacy non normalisée), on capitalize
      // au lieu de tout perdre.
      return FLIGHT_TYPE_LABELS[slug] || capitalize(slug);
    })
    .filter((s: string) => s !== '')
    .join(', ');
}


function formatDate(value: string): string {
  if (!value) return '';
  // Si value est déjà un objet Date, on l'utilise directement, sinon on tente de le parser
  let date: Date;
  // On gère le format "YYYY-MM-DD"
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [_, year, month, day] = match;
    date = new Date(Number(year), Number(month) - 1, Number(day));
  } else {
    // On tente de parser tout autre format
    date = new Date(value);
  }

  // Tableau des mois en français
  const moisFrancais = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];

  const jour = date.getDate();
  const mois = moisFrancais[date.getMonth()];
  const annee = date.getFullYear();

  return `${jour} ${mois} ${annee}`;
}

function formatBoolean(value: boolean): string {
  if (value === null) return '-';
  return value ? 'Oui' : 'Non';
}

/**
 * Cotations couenne, repli TEXTE de la barre proportionnelle.
 *
 * `value` est soit la liste `grades_climbing_area` (["6a 5", "5c 2", …]) qu'on
 * regroupe par niveau en sommant les voies (« 4 → 3 voies · 5 → 8 voies »),
 * soit — quand ce détail manque (anciens topos) et que le fallback `grade_book`
 * a pris le relais — une chaîne qu'on renvoie telle quelle. Sert d'affichage de
 * secours partout où le composant `app-couenne-grade-bar` n'est pas rendu.
 */
export function formatGradesByLevelText(value: any): string {
  if (!Array.isArray(value)) {
    return value !== null && value !== undefined && value !== ''
      ? String(value)
      : '-';
  }
  const byLevel = new Map<number, number>();
  for (const entry of value) {
    if (typeof entry !== 'string') continue;
    const parts = entry.trim().split(/\s+/);
    const digits = parts[0] ? parts[0].match(/^\d+/) : null;
    if (!digits) continue;
    const lvl = parseInt(digits[0], 10);
    if (!Number.isFinite(lvl)) continue;
    const n = parseInt(parts[1], 10);
    byLevel.set(lvl, (byLevel.get(lvl) || 0) + (Number.isFinite(n) ? n : 0));
  }
  if (!byLevel.size) return '-';
  // Format « 4 : 3 voies, 5 : 8, 6 : 12, … » : l'unité « voies » n'apparaît que
  // sur la première entrée (elle vaut pour toutes), pour rester compact.
  return [...byLevel.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([lvl, n], i) =>
      i === 0 ? `${lvl} : ${n} ${n <= 1 ? 'voie' : 'voies'}` : `${lvl} : ${n}`
    )
    .join(', ');
}

/** Clé de tri d'une cotation escalade « 6a+ » → [niveau, lettre, suffixe]. */
function climbingGradeSortKey(cotation: string): [number, number, number] {
  const m = cotation.trim().match(/^(\d+)\s*([a-dA-D])?\s*([+-])?/);
  if (!m) return [999, 0, 0];
  const level = parseInt(m[1], 10);
  const letter = m[2] ? m[2].toLowerCase().charCodeAt(0) - 96 : 0; // a=1…d=4
  const suffix = m[3] === '+' ? 2 : m[3] === '-' ? 0 : 1;
  return [level, letter, suffix];
}

/**
 * Cotations couenne, format VIGNETTE simple : « 28 voies, du 4a au 8b ».
 *
 * `value` = liste `grades_climbing_area` (["6a 5", "5c 2", …]) : on borne la
 * fourchette de cotations (min → max, tri escalade). Le TOTAL affiché est
 * `routeNumber` (« nombre de voies du site ») quand il est fourni et > 0 ;
 * sinon on retombe sur la somme des couples (cotation, nombre), qui peut être
 * partielle. Si une seule cotation : « n voies en 6a ». Repli `grade_book`
 * (chaîne) renvoyé tel quel.
 */
export function formatGradesRangeText(value: any, routeNumber?: number): string {
  if (!Array.isArray(value)) {
    return value !== null && value !== undefined && value !== ''
      ? String(value)
      : '-';
  }
  let sum = 0;
  const cotations: string[] = [];
  for (const entry of value) {
    if (typeof entry !== 'string') continue;
    const parts = entry.trim().split(/\s+/);
    const cot = parts[0];
    if (!cot || !/^\d/.test(cot)) continue;
    const n = parseInt(parts[1], 10);
    sum += Number.isFinite(n) ? n : 0;
    cotations.push(cot);
  }
  if (!cotations.length) return '-';
  const total =
    typeof routeNumber === 'number' && Number.isFinite(routeNumber) && routeNumber > 0
      ? routeNumber
      : sum;
  const sorted = cotations.slice().sort((a, b) => {
    const ka = climbingGradeSortKey(a);
    const kb = climbingGradeSortKey(b);
    return ka[0] - kb[0] || ka[1] - kb[1] || ka[2] - kb[2];
  });
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const word = total <= 1 ? 'voie' : 'voies';
  return min === max
    ? `${total} ${word} en ${min}`
    : `${total} ${word}, du ${min} au ${max}`;
}

// --- Début de la section pour la factorisation des formateurs de groupe ---

interface GroupMapEntryValue {
  value: string;
  orderKey: string | undefined;
  key?: string; // Clé originale du champ (ex: 'grade_free_climbing')
}

interface GroupMapEntry {
  label: string;
  values: GroupMapEntryValue[];
  orderKey: string;
  icon?: string;
  separator: string;
  mainGroupKey: string; // 'C', 'D', 'F', etc.
  isPrefixSet?: boolean;
  originalFieldsOrderKeys: string[];
}

function formatEscaladeGrandeVoieGrade(groupData: GroupMapEntry): string {
  const freeClimbingItem = groupData.values.find(
    (item) => item.key === 'grade_free_climbing'
  );
  const mandatoryClimbingItem = groupData.values.find(
    (item) => item.key === 'grade_mandatory_climbing'
  );
  const aidClimbingItem = groupData.values.find(
    (item) => item.key === 'grade_aid_climbing'
  );

  const freeDisplayValue = freeClimbingItem ? freeClimbingItem.value : '-';
  const mandatoryDisplayValue = mandatoryClimbingItem
    ? mandatoryClimbingItem.value
    : '-';
  const aidDisplayValue = aidClimbingItem ? aidClimbingItem.value : '-';

  let result: string;
  if (freeDisplayValue !== '-' && mandatoryDisplayValue !== '-') {
    result = `${freeDisplayValue}${groupData.separator}${mandatoryDisplayValue}`;
  } else if (freeDisplayValue !== '-' && mandatoryDisplayValue === '-') {
    result = freeDisplayValue;
  } else if (freeDisplayValue === '-' && mandatoryDisplayValue !== '-') {
    result = mandatoryDisplayValue;
  } else {
    result = '-';
  }

  // Cotation artificielle ajoutée à la suite des cotations libre / obligatoire,
  // uniquement quand elle est renseignée (cf. entrée grade_aid_climbing du
  // groupe C, visible seulement dans la vignette).
  if (aidDisplayValue !== '-') {
    result =
      result === '-'
        ? aidDisplayValue
        : `${result}${groupData.separator}${aidDisplayValue}`;
  }

  return result;
}

const CUSTOM_GROUP_FORMATTERS: {
  [activityAndGroupKey: string]: (groupData: GroupMapEntry) => string;
} = {
  'climbing-multi-pitch_C_grade': formatEscaladeGrandeVoieGrade,
};

// --- Fin de la section pour la factorisation ---

export const ACTIVITY_CONFIGS: { [key: string]: ActivityConfig } = {
  hiking: {
    name: 'Hiking',
    fields: {
      C: [
        {
          key: 'itinerary_type',
          orderKey: 'C3',
          icon: 'topos/itinerary',
        },
        {
          key: 'duration_total',
                    orderKey: 'C4',
          valueFormatter: formatDurationMinutesToHours,
          icon: 'topos/duration',
        },
        {
          key: 'elevation_gain',
                    orderKey: 'C5a',
                    group: 'denivele',
          groupSeparator: ' / ',
          groupPrefix: 'elevation_gain_loss',
          icon: 'topos/positive_elevation',
        },
        {
          key: 'elevation_loss',
                    orderKey: 'C5b',
                    group: 'denivele',
          icon: 'topos/positive_elevation',
        },
      ],
      D: [
        {
          key: 'grade_book',
                    orderKey: 'D2a',
          group: 'grade',
          groupSeparator: ' / ',
          groupPrefix: 'grades',
          icon: 'topos/difficulty_rating',
        },
        {
          key: 'grade_hiking',
                    orderKey: 'D2b',
          group: 'grade',
        },
        {
          key: 'distance',
                    orderKey: 'D3',
                    icon: 'topos/distance',
        },
      ],
      F: [
        {
          key: 'elevation_min',
                    orderKey: 'F1a',
                    group: 'altitude',
          groupSeparator: ' / ',
          groupPrefix: 'elevation_min_max',
          icon: 'topos/altitude',
        },
        {
          key: 'elevation_max',
                    orderKey: 'F1b',
                    group: 'altitude',
          icon: 'topos/altitude',
        },
        { key: 'equipment', orderKey: 'F2' },
        { key: 'period', orderKey: 'F4', icon: 'topos/period' },
      ],
      // Ajoute M, P, Z si besoin
    },
  },
  snowshoeing: {
    name: 'Snowshoeing',
    fields: {
      C: [
        {
          key: 'itinerary_type',
          orderKey: 'C3',
          icon: 'topos/itinerary',
        },
        {
          key: 'duration_total',
                    orderKey: 'C4',
          valueFormatter: formatDurationMinutesToHours,
          icon: 'topos/duration',
        },
        {
          key: 'elevation_gain',
                    orderKey: 'C5a',
                    group: 'denivele',
          groupSeparator: ' / ',
          groupPrefix: 'elevation_gain_loss',
          icon: 'topos/positive_elevation',
        },
        {
          key: 'elevation_loss',
                    orderKey: 'C5b',
                    group: 'denivele',
          icon: 'topos/positive_elevation',
        },
      ],
      D: [
        {
          key: 'grade_book',
                    orderKey: 'D2a',
          group: 'grade',
          groupSeparator: ' / ',
          groupPrefix: 'grades',
          icon: 'topos/difficulty_rating',
        },
        {
          key: 'grade_snowshoeing',
                    orderKey: 'D2b',
          group: 'grade',
          icon: 'topos/difficulty_rating',
        },
        {
          key: 'distance',
                    orderKey: 'D3',
                    icon: 'topos/distance',
        },
      ],
      F: [
        {
          key: 'elevation_min',
                    orderKey: 'F1a',
                    group: 'altitude',
          groupSeparator: ' / ',
          groupPrefix: 'elevation_min_max',
          icon: 'topos/altitude',
        },
        {
          key: 'elevation_max',
                    orderKey: 'F1b',
                    group: 'altitude',
          icon: 'topos/altitude',
        },
        { key: 'ign_map', orderKey: 'F3', icon: 'topos/ign_map' },
        { key: 'period', orderKey: 'F4', icon: 'topos/period' },
      ],
    },
  },

  mountain_biking: {
    name: 'Mountain Biking',
    fields: {
      C: [
        {
          key: 'itinerary_type',
          orderKey: 'C3',
          icon: 'topos/itinerary',
        },
        {
          key: 'duration_total',
                    orderKey: 'C4',
          valueFormatter: formatDurationMinutesToHours,
          icon: 'topos/duration',
        },
        {
          key: 'elevation_gain',
                    orderKey: 'C5a',
                    group: 'denivele',
          groupSeparator: ' / ',
          groupPrefix: 'elevation_gain_loss',
          icon: 'topos/positive_elevation',
        },
        {
          key: 'elevation_loss',
                    orderKey: 'C5b',
                    group: 'denivele',
          icon: 'topos/positive_elevation',
        },
      ],
      D: [
        {
          key: 'grade_book',
                    orderKey: 'D2a',
          group: 'grade',
          groupSeparator: ' / ',
          groupPrefix: 'grades',
          icon: 'topos/difficulty_rating',
        },
        {
          key: 'grade_biking',
                    orderKey: 'D2b',
          group: 'grade',
        },
        {
          key: 'grade_expo',
                    orderKey: 'D2c',
          group: 'grade',
        },
        {
          key: 'distance',
                    orderKey: 'D3',
                    icon: 'topos/distance',
        },
      ],
      F: [
        {
          key: 'elevation_min',
                    orderKey: 'F1a',
                    group: 'altitude',
          groupSeparator: ' / ',
          groupPrefix: 'elevation_min_max',
          icon: 'topos/altitude',
        },
        {
          key: 'elevation_max',
                    orderKey: 'F1b',
                    group: 'altitude',
          icon: 'topos/altitude',
        },
        { key: 'ign_map', orderKey: 'F3', icon: 'topos/ign_map' },
        { key: 'period', orderKey: 'F4', icon: 'topos/period' },
      ],
    },
  },

  via_ferrata: {
    name: 'Via Ferrata',
    fields: {
      C: [
        {
          key: 'grade_alpine',
                    orderKey: 'C3a',
          // groupSeparator: ' / ',
          // groupPrefix: 'Cotation (Alpine, Livre)',
          icon: 'topos/difficulty_rating',
        },
        // {
        //   key: 'grade_book',
        //           //   orderKey: 'C3b',
        //   group: 'grade',
        //   icon: 'topos/difficulty_rating',
        // },
        {
          key: 'duration_total',
                    orderKey: 'C4a',
          valueFormatter: formatDurationMinutesToHours,
          icon: 'topos/duration',
          displayContextOverrides: {
            'guide-card': {
              hide: true,
            },
            'guide-details': {
              hide: true,
            },
          },
        },
        {
          key: 'duration_approach',
                    orderKey: 'C4b',
          valueFormatter: formatDurationMinutesToHours,
          group: 'durees',
          groupPrefix: 'durations_approach_via_return',
          icon: 'topos/duration',
          displayContextOverrides: {
            'guide-guidebook-learn-more-popup': {
              group: undefined,
            },
          },
        },
        {
          key: 'duration_difficulty',
                    orderKey: 'C4c',
          valueFormatter: formatDurationMinutesToHours,
          group: 'durees',
          icon: 'topos/duration',
          displayContextOverrides: {
            'guide-guidebook-learn-more-popup': {
              group: undefined,
            },
          },
        },
        {
          key: 'duration_return',
                    orderKey: 'C4d',
          valueFormatter: formatDurationMinutesToHours,
          group: 'durees',
          icon: 'topos/duration',
          displayContextOverrides: {
            'guide-guidebook-learn-more-popup': {
              group: undefined,
            },
          },
        },
        {
          key: 'elevation_gain',
                    orderKey: 'C5a',
                    group: 'denivele',
          groupSeparator: ' / ',
          groupPrefix: 'elevation_gain_loss',
          icon: 'topos/positive_elevation',
        },
        {
          key: 'elevation_loss',
                    orderKey: 'C5b',
                    group: 'denivele',
          icon: 'topos/positive_elevation',
        },
      ],
      D: [
        {
          key: 'main_orientation',
                    orderKey: 'D2',
          icon: 'topos/orientation',
        },
        {
          key: 'elevation_difficulty',
                    orderKey: 'D3a',
                    group: 'denivele_difficulty',
          groupSeparator: ' / ',
          groupPrefix: 'elevation_difficulty_developed_length',
          icon: 'topos/positive_elevation',
        },
        {
          key: 'developed_length',
                    orderKey: 'D3b',
                    group: 'denivele_difficulty',
          icon: 'topos/length',
        },
        {
          key: 'equipment',
                    orderKey: 'D5',
          icon: 'icons/info',
        },
      ],
      F: [
        {
          key: 'elevation_min',
                    orderKey: 'F1a',
                    group: 'altitude',
          groupSeparator: ' / ',
          groupPrefix: 'elevation_min_max',
          icon: 'topos/altitude',
        },
        {
          key: 'elevation_max',
                    orderKey: 'F1b',
                    group: 'altitude',
          icon: 'topos/altitude',
        },
        {
          key: 'distance',
                    orderKey: 'F3',
                    icon: 'topos/distance',
        },
        { key: 'ign_map', orderKey: 'F5', icon: 'topos/ign_map' },
        { key: 'rock_type', orderKey: 'F6', icon: 'topos/rock_type' },
        { key: 'period', orderKey: 'F7', icon: 'topos/period' },
        { key: 'kids_friendly', orderKey: 'F8', icon: 'topos/kids' },
        {
          key: 'costly',
          icon: 'topos/costly',
                    orderKey: 'F9',
          valueFormatter: formatBoolean,
        },
      ],
    },
  },

  'climbing-single-pitch': {
    name: 'Escalade couenne',
    fields: {
      C: [
        {
          // Cotations couenne : rendu par <app-couenne-grade-bar> (barre
          // proportionnelle par niveau) via le champ `gradeBar` des items.
          // Repli sur `grade_book` (texte) quand un topo n'a pas le détail par
          // cotation ; `valueFormatter` fournit alors un texte de secours.
          key: 'grades_climbing_area',
                    orderKey: 'C3a',
          icon: 'topos/difficulty_rating',
          fallbackKey: 'grade_book',
          // Vignette (carte recherche/guidebook) : texte « 28 voies, allant du
          // 4a au 8b ». La barre (page guide/popup) passe par `gradeBar`.
          valueFormatter: formatGradesRangeText,
        },
        {
          key: 'main_orientation',
                    orderKey: 'C4',
          icon: 'topos/orientation',
        },
        {
          key: 'duration_approach',
                    orderKey: 'C5',
          valueFormatter: formatDurationMinutesToHours,
          icon: 'topos/duration',
        },
      ],
      D: [
        {
          key: 'elevation_crag',
                    orderKey: 'D2',
                    icon: 'topos/positive_elevation',
        },
        {
          key: 'elevation_max_crag',
                    orderKey: 'D3a',
                    group: 'hauteur',
          groupSeparator: ' / ',
          groupPrefix: 'crag_height_min_max',
          icon: 'topos/altitude',
        },
        {
          key: 'elevation_min_crag',
                    orderKey: 'D3b',
                    group: 'hauteur',
          icon: 'topos/altitude',
        },
        {
          key: 'climbing_style',
                    orderKey: 'D4',
          icon: 'activites/climbing',
          valueFormatter: capitalize,
        },
      ],
      F: [
        // Les 6 champs ci-dessous sont masqués DANS LE POPUP couenne uniquement
        // (via displayContextOverrides 'guide-guidebook-learn-more-popup') ; ils
        // restent affichés sur la carte et la section détail.
        {
          key: 'grade_expo',
                    orderKey: 'F1',
          icon: 'topos/exposition',
          displayContextOverrides: {
            'guide-guidebook-learn-more-popup': { hide: true },
          },
        },
        {
          key: 'grade_engagement',
                    orderKey: 'F2',
          valueFormatter: (value: any) => convertToRoman(value),
          icon: 'topos/engagement',
          displayContextOverrides: {
            'guide-guidebook-learn-more-popup': { hide: true },
          },
        },
        {
          key: 'grade_protection',
                    orderKey: 'F3',
          icon: 'topos/equipment',
          displayContextOverrides: {
            'guide-guidebook-learn-more-popup': { hide: true },
          },
        },
        {
          key: 'grade_aid_climbing',
                    orderKey: 'F4',
          icon: 'topos/aid',
          displayContextOverrides: {
            'guide-guidebook-learn-more-popup': { hide: true },
          },
        },
        { key: 'route_number', orderKey: 'F5' },
        { key: 'rock_type', orderKey: 'F6', icon: 'topos/rock_type' },
        {
          key: 'period',
          icon: 'topos/period',
                    orderKey: 'F8',
          displayContextOverrides: {
            'guide-guidebook-learn-more-popup': { hide: true },
          },
        },
      ],
    },
  },

  'climbing-boulder': {
    name: 'Escalade bloc',
    fields: {
      C: [
        {
          key: 'grades_climbing_area',
          //'Nombre de voies par cotation'
          orderKey: 'C3',
          icon: 'topos/difficulty_rating',
        },
        {
          key: 'main_orientation',
                    orderKey: 'C4',
          icon: 'topos/orientation',
        },
        {
          key: 'duration_approach',
                    orderKey: 'C5',
          valueFormatter: formatDurationMinutesToHours,
          icon: 'topos/duration',
        },
      ],
      D: [
        {
          key: 'elevation_crag',
                    orderKey: 'D2',
                    icon: 'topos/positive_elevation',
        },
        {
          key: 'climbing_style',
                    orderKey: 'D3',
          icon: 'activites/climbing',
          valueFormatter: capitalize,
        },
        { key: 'rock_type', orderKey: 'D4', icon: 'topos/rock_type' },
      ],
      F: [
        { key: 'route_number', orderKey: 'F1' },
        { key: 'period', orderKey: 'F3', icon: 'topos/period' },
        {
          key: 'elevation_max_crag',
                    orderKey: 'F4a',
                    group: 'hauteur',
          groupSeparator: ' / ',
          groupPrefix: 'crag_height_max_min',
          icon: 'topos/altitude',
        },
        {
          key: 'elevation_min_crag',
                    orderKey: 'F4b',
                    group: 'hauteur',
          icon: 'topos/altitude',
        },
      ],
    },
  },

  'climbing-multi-pitch': {
    name: 'Escalade grande voie',
    fields: {
      C: [
        {
          key: 'grade_free_climbing',
                    orderKey: 'C3a',
          group: 'grade',
          groupSeparator: ' ',
          groupPrefix: 'grades',
          icon: 'topos/difficulty_rating',
        },
        {
          key: 'grade_mandatory_climbing',
                    orderKey: 'C3b',
          group: 'grade',
          icon: 'topos/difficulty_rating',
          displayContextOverrides: {
            'guide-card': {
              itemPrefix: ' (',
              itemSuffix: ' obl.)',
            },
            'guide-details': {
              itemPrefix: ' (',
              itemSuffix: ' obl.)',
            },
          },
        },
        {
          // Vignette uniquement (guide-card) : on greffe la cotation
          // artificielle à la suite des cotations libre / obligatoire, via
          // formatEscaladeGrandeVoieGrade. L'entrée du groupe D
          // (grade_aid_climbing, D4e) reste la source pour le détail, les
          // popups et la page guidebook.
          key: 'grade_aid_climbing',
                    orderKey: 'C3c',
          group: 'grade',
          icon: 'topos/aid',
          displayContextOverrides: {
            'guide-details': { hide: true },
            'guide-guidebook-learn-more-popup': { hide: true },
            'guidebook-page': { hide: true },
          },
        },
        {
          key: 'developed_length',
                    orderKey: 'C4a',
                    group: 'longueur',
          groupSeparator: ' ',
          groupPrefix: 'developed_length',
          icon: 'topos/distance',
          fallbackKey: 'elevation_difficulty',
          fallbackLabel: 'elevation_difficulty',
          fallbackGroupPrefix: 'elevation_difficulty',
          secondFallbackKey: 'pitch_number',
          secondFallbackLabel: 'pitch_number',
          secondFallbackGroupPrefix: 'pitch_number',
          displayContextOverrides: {
            // Popup : affichée seule (sans fallback), juste sous la ligne
            // "Dénivelé des difficultés" (cf. elevation_difficulty / pitch_number).
            'guide-guidebook-learn-more-popup': {
              group: undefined,
              orderKey: 'C4c',
            },
            // Page guidebook / guide (System A) : pour la grande voie on
            // affiche « Dénivelé des difficultés » (valeur elevation_difficulty)
            // au lieu de « Longueur développée ».
            'guidebook-page': {
              key: 'elevation_difficulty',
                          },
          },
        },
        {
          key: 'pitch_number',
                    orderKey: 'C4b',
          itemPrefix: ' (',
          group: 'longueur',
          itemSuffix: ' longueurs)',
          icon: 'topos/pitch',
          displayContextOverrides: {
            // Popup : fusionné avec "Dénivelé des difficultés" → "(N longueurs)".
            'guide-guidebook-learn-more-popup': {
              groupSeparator: ' ',
              itemPrefix: '(',
            },
          },
        },
        {
          key: 'main_orientation',
                    orderKey: 'C5',
          icon: 'topos/orientation',
        },
      ],
      D: [
        {
          key: 'rock_type',
                    orderKey: 'D2',
          icon: 'topos/rock_type',
          displayContextOverrides: {
            'guide-details': {
              hide: true,
            },
          },
        },
        {
          key: 'climbing_style',
                    orderKey: 'D3',
          icon: 'activites/climbing',
          valueFormatter: capitalize,
          displayContextOverrides: {
            'guide-details': {
              hide: true,
            },
          },
        },
        {
          key: 'grade_alpine',
                    orderKey: 'D4a',
          group: 'cotation',
          groupSeparator: ' / ',
          groupPrefix: 'grades',
          icon: 'topos/difficulty_rating',
          displayContextOverrides: {
            'guide-details': {
              hide: true,
            },
            'guide-guidebook-learn-more-popup': {
              group: undefined,
            },
          },
        },
        {
          key: 'grade_expo',
                    orderKey: 'D4b',
          group: 'cotation',
          icon: 'topos/exposition',
          displayContextOverrides: {
            'guide-details': {
              hide: true,
            },
            'guidebook-page': {
              hide: true,
            },
            'guide-guidebook-learn-more-popup': {
              group: undefined,
              icon: 'topos/difficulty_rating',
            },
          },
        },
        {
          key: 'grade_engagement',
                    orderKey: 'D4c',
          group: 'cotation',
          valueFormatter: (value: any) => convertToRoman(value),
          icon: 'topos/engagement',
          displayContextOverrides: {
            'guide-details': {
              hide: true,
            },
            'guidebook-page': {
              hide: true,
            },
            'guide-guidebook-learn-more-popup': {
              group: undefined,
              icon: 'topos/difficulty_rating',
            },
          },
        },
        {
          key: 'grade_protection',
                    orderKey: 'D4d',
          group: 'cotation',
          icon: 'topos/equipment',
          displayContextOverrides: {
            'guide-details': {
              hide: true,
            },
            'guide-guidebook-learn-more-popup': {
              group: undefined,
              icon: 'topos/difficulty_rating',
            },
          },
        },
        {
          key: 'grade_aid_climbing',
                    orderKey: 'D4e',
          group: 'cotation',
          icon: 'topos/aid',
          displayContextOverrides: {
            'guide-details': {
              hide: true,
            },
            'guide-guidebook-learn-more-popup': {
              group: undefined,
              icon: 'topos/difficulty_rating',
            },
          },
        },
        // Filtre « Altitude du site » masqué pour la grande voie pour l'instant.
        // Le backend filtre désormais bien elevation_crag pour multi_pitch
        // (CLIMBING_SUBTYPE_MATRIX) ; décommenter pour le réactiver.
        // {
        //   key: 'elevation_crag',
        //           //   orderKey: 'D5',
        //           //   icon: 'topos/positive_elevation',
        // },
        {
          key: 'duration_approach',
                    orderKey: 'D6',
          valueFormatter: formatDurationMinutesToHours,
          icon: 'topos/duration',
        },
      ],
      F: [
        {
          key: 'first_ascensionist',
                    orderKey: 'F1',
          icon: 'topos/opener',
        },
        {
          key: 'first_ascent_date',
                    orderKey: 'F2',
          icon: 'topos/period',
          valueFormatter: formatDate,
        },
        {
          key: 'elevation_gain',
                    orderKey: 'F3a',
                    group: 'denivele',
          groupSeparator: ' / ',
          groupPrefix: 'elevation_total_gain_loss_difficulty_multi_pitch',
          icon: 'topos/positive_elevation',
        },
        {
          key: 'elevation_loss',
                    orderKey: 'F3b',
                    group: 'denivele',
          icon: 'topos/positive_elevation',
        },
        {
          key: 'elevation_difficulty',
                    orderKey: 'F3c',
                    icon: 'topos/positive_elevation',
          displayContextOverrides: {
            // Popup : remonte au niveau des longueurs et fusionne avec
            // pitch_number → "Dénivelé des difficultés : XX m (N longueurs)".
            'guide-guidebook-learn-more-popup': {
              group: 'longueur',
              groupPrefix: 'elevation_difficulty',
              orderKey: 'C4a',
            },
          },
        },
        {
          key: 'distance',
                    orderKey: 'F4',
                    icon: 'topos/distance',
        },
        {
          key: 'duration_total',
                    orderKey: 'F5a',
          group: 'duration',
          groupSeparator: ' / ',
          groupPrefix: 'durations_total_difficulty_return',
          valueFormatter: formatDurationMinutesToHours,
          icon: 'topos/duration',
          displayContextOverrides: {
            'guide-guidebook-learn-more-popup': {
              group: undefined,
            },
          },
        },
        {
          key: 'duration_difficulty',
                    orderKey: 'F5b',
          group: 'duration',
          valueFormatter: formatDurationMinutesToHours,
          icon: 'topos/duration',
          displayContextOverrides: {
            'guide-guidebook-learn-more-popup': {
              group: undefined,
            },
          },
        },
        {
          key: 'duration_return',
                    orderKey: 'F5c',
          group: 'duration',
          valueFormatter: formatDurationMinutesToHours,
          icon: 'topos/duration',
          displayContextOverrides: {
            'guide-guidebook-learn-more-popup': {
              group: undefined,
            },
          },
        },
        {
          key: 'period',
          icon: 'topos/period',
                    orderKey: 'F7',
          displayContextOverrides: {
            'guide-guidebook-learn-more-popup': { hide: true },
          },
        },
        {
          key: 'ign_map',
          icon: 'topos/ign_map',
                    orderKey: 'F8',
          displayContextOverrides: {
            'guide-guidebook-learn-more-popup': { hide: true },
          },
        },
      ],
    },
  },

  canyoning: {
    name: 'Canyoning',
    fields: {
      C: [
        {
          key: 'grade_canyon_vertical',
                    orderKey: 'C3a',
          group: 'cotation',
          groupSeparator: ' ',
          groupPrefix: 'grades',
          icon: 'topos/difficulty_rating',
          displayContextOverrides: {
            'guide-guidebook-learn-more-popup': {
              group: undefined,
            },
          },
        },
        {
          key: 'grade_canyon_water',
                    orderKey: 'C3b',
          group: 'cotation',
          icon: 'topos/difficulty_rating',
          displayContextOverrides: {
            'guide-guidebook-learn-more-popup': {
              group: undefined,
            },
          },
        },
        {
          key: 'grade_engagement',
                    orderKey: 'C3c',
          group: 'cotation',
          // valueFormatter: (value: any) => convertToRoman(value),
          icon: 'topos/difficulty_rating',
          displayContextOverrides: {
            'guide-guidebook-learn-more-popup': {
              group: undefined,
            },
          },
        },
        {
          key: 'elevation_difficulty',
                    orderKey: 'C4',
                    icon: 'topos/positive_elevation',
        },
        {
          key: 'max_drop',
                    orderKey: 'C5',
                    // Retour Seb (option B) — cascade validée + flèche ↑ (hauteur).
          icon: 'topos/waterfall_height',
        },
      ],
      D: [
        {
          key: 'duration_total',
                    orderKey: 'D2a',
          valueFormatter: formatDurationMinutesToHours,
          icon: 'topos/duration',
          displayContextOverrides: {
            'guide-card': {
              hide: true,
            },
            'guide-details': {
              hide: true,
            },
          },
        },
        {
          key: 'duration_approach',
                    orderKey: 'D2b',
          group: 'duration',
          groupSeparator: ' / ',
          groupPrefix: 'durations_approach_canyon_return',
          valueFormatter: formatDurationMinutesToHours,
          icon: 'topos/duration',
          displayContextOverrides: {
            'guide-guidebook-learn-more-popup': {
              group: undefined,
            },
          },
        },
        {
          key: 'duration_difficulty',
                    orderKey: 'D2c',
          group: 'duration',
          valueFormatter: formatDurationMinutesToHours,
          icon: 'topos/duration',
          displayContextOverrides: {
            'guide-guidebook-learn-more-popup': {
              group: undefined,
            },
          },
        },
        {
          key: 'duration_return',
                    orderKey: 'D2d',
          group: 'duration',
          valueFormatter: formatDurationMinutesToHours,
          icon: 'topos/duration',
          displayContextOverrides: {
            'guide-guidebook-learn-more-popup': {
              group: undefined,
            },
          },
        },
        {
          key: 'length',
                    orderKey: 'D3',
                    icon: 'topos/distance',
        },
      ],
      F: [
        {
          key: 'elevation_max',
                    orderKey: 'F4a',
                    group: 'altitude',
          groupSeparator: ' / ',
          groupPrefix: 'elevation_min_max',
          icon: 'topos/altitude',
        },
        {
          key: 'elevation_min',
                    orderKey: 'F4b',
                    group: 'altitude',
          icon: 'topos/altitude',
        },
        {
          key: 'shuttle',
                    orderKey: 'F5a',
                    icon: 'topos/distance',
                    valueFormatter: formatShuttle,
        },
        {
          key: 'distance_start_finish',
                    orderKey: 'F5b',
                    icon: 'topos/distance',
        },
        {
          key: 'rope_length',
                    orderKey: 'F6',
                    icon: 'topos/distance',
        },
      ],
    },
  },

  mountaineering: {
    name: 'Mountaineering',
    fields: {
      C: [
        {
          key: 'grade_alpine',
                    orderKey: 'C3a',
          group: 'cotation',
          groupSeparator: ' ',
          groupPrefix: 'grades',
          icon: 'topos/difficulty_rating',
        },
        {
          key: 'grade_free_climbing',
                    orderKey: 'C3b',
          group: 'cotation',
          icon: 'topos/difficulty_rating',
        },
        {
          key: 'grade_mandatory_climbing',
                    orderKey: 'C3c',
          group: 'cotation',
          icon: 'topos/difficulty_rating',
          displayContextOverrides: {
            'guide-card': {
              itemPrefix: ' (',
              itemSuffix: ' obl.)',
            },
            'guide-details': {
              itemPrefix: ' (',
              itemSuffix: ' obl.)',
            },
          },
        },
        {
          key: 'grade_aid_climbing',
                    orderKey: 'C3d',
          group: 'cotation',
          icon: 'topos/aid',
        },
        {
          key: 'grade_ice',
                    orderKey: 'C3e',
          group: 'cotation',
          icon: 'topos/ice',
        },
        {
          key: 'grade_mixed',
                    orderKey: 'C3f',
          group: 'cotation',
          icon: 'topos/mixed',
        },
        {
          key: 'grade_expo',
                    orderKey: 'C3g',
          group: 'cotation',
          icon: 'topos/exposition',
        },
        {
          key: 'grade_engagement',
                    orderKey: 'C3h',
          group: 'cotation',
          valueFormatter: (value: any) => convertToRoman(value),
          icon: 'topos/engagement',
        },
        {
          key: 'grade_protection',
                    orderKey: 'C3i',
          group: 'cotation',
          icon: 'topos/equipment',
        },
        {
          key: 'developed_length',
                    orderKey: 'C4a',
                    group: 'longueur',
          groupSeparator: ' ',
          groupPrefix: 'developed_length',
          icon: 'topos/distance',
        },
        {
          key: 'pitch_number',
                    orderKey: 'C4b',
          itemPrefix: ' (',
          group: 'longueur',
          itemSuffix: ' longueurs)',
          icon: 'topos/pitch',
        },
        {
          key: 'elevation_max',
                    orderKey: 'C5',
                    icon: 'topos/altitude',
        },
      ],
      D: [
        {
          key: 'elevation_gain',
                    orderKey: 'D2a',
                    group: 'denivele',
          groupSeparator: ' / ',
          groupPrefix: 'elevation_total_gain_loss_difficulty',
          icon: 'topos/positive_elevation',
        },
        {
          key: 'elevation_loss',
                    orderKey: 'D2b',
                    group: 'denivele',
          icon: 'topos/positive_elevation',
        },
        {
          key: 'elevation_difficulty',
                    orderKey: 'D2c',
                    group: 'denivele',
          icon: 'topos/positive_elevation',
        },
        {
          key: 'main_orientation',
                    orderKey: 'D3',
          icon: 'topos/orientation',
        },
        {
          key: 'climb_configuration',
                    orderKey: 'D4',
          icon: 'topos/difficulty_rating',
        },
        {
          key: 'duration_total',
                    orderKey: 'D5a',
          group: 'duration',
          groupSeparator: ' / ',
          groupPrefix: 'duration_total',
          valueFormatter: formatDurationMinutesToHours,
          icon: 'topos/duration',
          displayContextOverrides: {
            'guide-details': {
              group: undefined,
            },
            'guide-guidebook-learn-more-popup': {
              group: undefined,
            },
          },
        },
        {
          key: 'duration_approach',
                    orderKey: 'D5b',
          group: 'duration',
          valueFormatter: formatDurationMinutesToHours,
          icon: 'topos/duration',
          displayContextOverrides: {
            'guide-details': {
              hide: true,
            },
            'guide-guidebook-learn-more-popup': {
              group: undefined,
            },
          },
        },
        {
          key: 'duration_difficulty',
                    orderKey: 'D5c',
          group: 'duration',
          valueFormatter: formatDurationMinutesToHours,
          icon: 'topos/duration',
          displayContextOverrides: {
            'guide-details': {
              hide: true,
            },
            'guide-guidebook-learn-more-popup': {
              group: undefined,
            },
          },
        },
        {
          key: 'duration_return',
                    orderKey: 'D5d',
          group: 'duration',
          valueFormatter: formatDurationMinutesToHours,
          icon: 'topos/duration',
          displayContextOverrides: {
            'guide-details': {
              hide: true,
            },
            'guide-guidebook-learn-more-popup': {
              group: undefined,
            },
          },
        },
        {
          key: 'first_ascensionist',
                    orderKey: 'D6',
          icon: 'topos/opener',
        },
        {
          key: 'first_ascent_date',
                    orderKey: 'D7',
          icon: 'topos/period',
          valueFormatter: formatDate,
        },
      ],
      F: [
        {
          key: 'elevation_min',
                    orderKey: 'F1',
                    icon: 'topos/altitude',
        },
        {
          key: 'distance',
                    orderKey: 'F2',
                    icon: 'topos/distance',
        },
        {
          key: 'rock_type',
                    orderKey: 'F3',
          icon: 'topos/rock_type',
        },
        { key: 'period', orderKey: 'F5', icon: 'topos/period' },
        { key: 'ign_map', orderKey: 'F6', icon: 'topos/ign_map' },
        { key: 'equipment', orderKey: 'F7' },
      ],
    },
  },

  caving: {
    name: 'Caving',
    fields: {
      C: [
        {
          key: 'elevation_difficulty',
                    orderKey: 'C3',
                    icon: 'topos/positive_elevation',
        },
        {
          key: 'duration_total',
                    orderKey: 'C4a',
          group: 'duration',
          groupSeparator: ' / ',
          groupPrefix: 'durations_total_approach_difficulty_return',
          valueFormatter: formatDurationMinutesToHours,
          icon: 'topos/duration',
        },
        {
          key: 'duration_approach',
                    orderKey: 'C4b',
          group: 'duration',
          valueFormatter: formatDurationMinutesToHours,
          icon: 'topos/duration',
        },
        {
          key: 'duration_difficulty',
                    orderKey: 'C4c',
          group: 'duration',
          valueFormatter: formatDurationMinutesToHours,
          icon: 'topos/duration',
        },
        {
          key: 'duration_return',
                    orderKey: 'C4d',
          group: 'duration',
          valueFormatter: formatDurationMinutesToHours,
          icon: 'topos/duration',
        },
        {
          key: 'developed_length',
                    orderKey: 'C5',
                    icon: 'topos/length',
        },
      ],
      D: [
        {
          key: 'narrow_passage',
          icon: 'topos/narrow_passage',
          orderKey: 'D2',
        },
        { key: 'flood_risk', orderKey: 'D3', icon: 'topos/flood_risk' },
        { key: 'itinerary_type', orderKey: 'D4' },
        {
          key: 'grade_alpine',
                    orderKey: 'D5',
        },
      ],
      F: [
        {
          key: 'rope_length',
                    orderKey: 'F1a',
                    group: 'longueur',
          groupSeparator: ' / ',
          groupPrefix: 'rope_length_vertical_number',
          icon: 'topos/ropes',
        },
        {
          key: 'vertical_number',
                    orderKey: 'F1b',
          group: 'longueur',
          icon: 'topos/vertical',
        },
        { key: 'period', orderKey: 'F2', icon: 'topos/period' },
        {
          key: 'grade_engagement',
                    orderKey: 'F3',
          valueFormatter: (value: any) => convertToRoman(value),
          icon: 'topos/engagement',
        },
        {
          key: 'elevation_max',
                    orderKey: 'F4a',
                    group: 'altitude',
          groupSeparator: ' / ',
          groupPrefix: 'elevation_max_min',
          icon: 'topos/altitude',
        },
        {
          key: 'elevation_min',
                    orderKey: 'F4b',
                    group: 'altitude',
          icon: 'topos/altitude',
        },
        { key: 'ign_map', orderKey: 'F5', icon: 'topos/ign_map' },
        {
          key: 'first_ascensionist',
                    orderKey: 'F6',
          icon: 'topos/opener',
        },
        {
          key: 'first_ascent_date',
                    orderKey: 'F7',
          icon: 'topos/period',
          valueFormatter: formatDate,
        },
        { key: 'rock_type', orderKey: 'F8', icon: 'topos/rock_type' },
      ],
    },
  },

  backcountry_skiing: {
    name: 'Backcountry Skiing',
    fields: {
      C: [
        {
          key: 'grade_ski_toponeige',
                    orderKey: 'C3a',
          group: 'cotation',
          groupSeparator: ' / ',
          groupPrefix: 'grades_ski',
          icon: 'topos/difficulty_rating',
        },
        {
          key: 'grade_expo',
                    orderKey: 'C3b',
          group: 'cotation',
          icon: 'topos/exposition',
        },
        {
          key: 'grade_ski_up',
                    orderKey: 'C3c',
          group: 'cotation',
          icon: 'topos/ski',
        },
        {
          key: 'elevation_gain',
                    orderKey: 'C4a',
                    group: 'denivele',
          groupSeparator: ' / ',
          groupPrefix: 'elevation_gain_loss_difficulty',
          icon: 'topos/positive_elevation',
        },
        {
          key: 'elevation_loss',
                    orderKey: 'C4b',
                    group: 'denivele',
          icon: 'topos/positive_elevation',
        },
        {
          key: 'elevation_difficulty',
                    orderKey: 'C4c',
                    group: 'denivele',
          icon: 'topos/positive_elevation',
        },
        {
          key: 'main_orientation',
                    orderKey: 'C5',
          icon: 'topos/orientation',
        },
      ],
      D: [
        {
          key: 'elevation_max',
                    orderKey: 'D2a',
                    group: 'altitude',
          groupSeparator: ' / ',
          groupPrefix: 'elevation_max_min',
          icon: 'topos/altitude',
        },
        {
          key: 'elevation_min',
                    orderKey: 'D2b',
                    group: 'altitude',
          icon: 'topos/altitude',
        },
        {
          key: 'max_slope',
                    orderKey: 'D3a',
                    group: 'pente',
          icon: 'topos/slope',
          groupPrefix: 'slope_max_length',
        },
        {
          key: 'max_slope_length',
                    orderKey: 'D3b',
                    group: 'pente',
          icon: 'topos/difficulty_rating',
        },
      ],
      F: [
        {
          key: 'first_ascensionist',
                    orderKey: 'F1',
          icon: 'topos/opener',
        },
        {
          key: 'first_ascent_date',
                    orderKey: 'F2',
          icon: 'topos/period',
          valueFormatter: formatDate,
        },
        { key: 'grade_book', orderKey: 'F4', icon: 'topos/difficulty_rating' },
        {
          key: 'duration_total',
                    orderKey: 'F4a',
          group: 'duration',
          groupSeparator: ' / ',
          groupPrefix: 'durations_total_difficulty_approach_return',
          valueFormatter: formatDurationMinutesToHours,
          icon: 'topos/duration',
        },
        {
          key: 'duration_difficulty',
                    orderKey: 'F4b',
          group: 'duration',
          valueFormatter: formatDurationMinutesToHours,
          icon: 'topos/duration',
        },
        {
          key: 'duration_approach',
                    orderKey: 'F4c',
          group: 'duration',
          valueFormatter: formatDurationMinutesToHours,
          icon: 'topos/duration',
        },
        {
          key: 'duration_return',
                    orderKey: 'F4d',
          group: 'duration',
          valueFormatter: formatDurationMinutesToHours,
          icon: 'topos/duration',
        },
        {
          key: 'distance',
                    orderKey: 'F5',
                    icon: 'topos/distance',
        },
        { key: 'period', orderKey: 'F6', icon: 'topos/period' },
        { key: 'ign_map', orderKey: 'F7', icon: 'topos/ign_map' },
      ],
    },
  },

  paragliding: {
    name: 'Paragliding',
    fields: {
      C: [
        {
          key: 'flight_elevation_loss',
                    orderKey: 'C3',
                    icon: 'topos/positive_elevation',
        },
        {
          key: 'takeoff_elevation',
                    orderKey: 'C4a',
                    group: 'altitude',
          groupSeparator: ' / ',
          groupPrefix: 'altitude_takeoff',
          icon: 'topos/altitude',
        },
        // {
        //   key: 'landing_elevation',
        //   label: "Altitude du site d'atterrissage",
        //   orderKey: 'C4b',
        //           //   group: 'altitude',
        //   icon: 'topos/altitude',
        // },
        {
          key: 'flight_type',
                    orderKey: 'C5',
          icon: 'activites/paragliding',
          valueFormatter: (value: any) => formatFlightTypes(value),
        },
      ],
      D: [
        {
          key: 'main_orientation',
                    orderKey: 'D2',
          icon: 'topos/orientation',
        },
      ],
      F: [
        // Issue #81 — period / ign_map / distance_start_finish supprimés du
        // popup "en savoir plus" pour l'activité parapente (pertinents pour
        // randonnée/alpinisme, pas pour parapente où le décollage et le type
        // de vol priment).
        { key: 'grade_book', orderKey: 'F4', icon: 'topos/difficulty_rating' },
      ],
    },
  },
};
/** Résout les clés héritées des fronts (ropes_length → rope_length, …). */
function canonicalKey(key: string): string {
  return FIELD_ALIASES[key] ?? key;
}

/**
 * Libellé d'un champ. `short` pour les vignettes et les filtres, `long` pour
 * les pages de présentation — c'est la seule distinction que porte le
 * vocabulaire, il n'y a plus de variation par activité.
 */
export function vocabularyLabel(
  key: string,
  form: 'short' | 'long' = 'long'
): string | undefined {
  return FIELD_LABELS[canonicalKey(key)]?.[form];
}

/** Unité d'affichage, séparée du libellé. */
export function vocabularyUnit(key: string): string | undefined {
  return FIELD_LABELS[canonicalKey(key)]?.unit ?? undefined;
}

/**
 * Libellé d'une ligne qui compose plusieurs champs (« Dénivelé + / - »).
 *
 * `GROUP_LABELS` d'abord ; un groupe libellé comme l'un de ses champs n'a
 * pas d'entrée et retombe sur le vocabulaire, forme longue. Une clé inconnue
 * est rendue telle quelle — visible, plutôt qu'une ligne sans nom.
 */
export function groupLabel(group: string): string {
  return GROUP_LABELS[group] ?? vocabularyLabel(group, 'long') ?? group;
}

// Les entrées de config n'embarquent plus leur libellé : on le pose ici, une
// fois, à partir du vocabulaire. La forme longue est le défaut ; la vignette
// bascule sur la forme courte au moment du rendu (cf. getDisplayItemsForGroups).
// Les préfixes de groupe et les libellés de repli suivent le même chemin,
// overrides compris : un contexte peut rattacher un champ à un autre groupe
// et le renommer.
const LABEL_KEYS = [
  'groupPrefix',
  'fallbackLabel',
  'fallbackGroupPrefix',
  'secondFallbackLabel',
  'secondFallbackGroupPrefix',
] as const;

for (const config of Object.values(ACTIVITY_CONFIGS)) {
  for (const group of Object.values(config.fields)) {
    for (const field of group) {
      field.label = vocabularyLabel(field.key, 'long') ?? field.key;
      const unit = vocabularyUnit(field.key);
      if (unit) field.unit = unit;
      for (const prop of LABEL_KEYS) {
        if (field[prop]) field[prop] = groupLabel(field[prop]);
      }
      for (const override of Object.values(field.displayContextOverrides ?? {})) {
        if (override.groupPrefix) override.groupPrefix = groupLabel(override.groupPrefix);
      }
    }
  }
}


/**
 * Récupère les champs d'une activité pour un ou plusieurs groupes donnés
 * @param activityKey clé de l'activité (ex: 'randonnée')
 * @param groups string ou tableau de groupes (ex: 'F' ou ['C','F'])
 * @returns ActivityFieldConfig[]
 */
export function getFieldsByGroup(
  activityKey: string,
  groups: string | string[]
): ActivityFieldConfig[] {
  const config = ACTIVITY_CONFIGS[activityKey];
  if (!config) return [];
  const groupArray = Array.isArray(groups) ? groups : [groups];
  let result: ActivityFieldConfig[] = [];
  for (const group of groupArray) {
    if (config.fields[group]) {
      result = result.concat(config.fields[group]);
    }
  }
  return result;
}

/**
 * Récupère les champs d'une activité pour un ou plusieurs groupes donnés,
 * prépare les valeurs à partir d'un objet de données (ex: guideDetails),
 * et retourne un tableau d'items prêts à l'affichage (groupés et non groupés).
 *
 * @param activityKey clé de l'activité (ex: 'randonnée')
 * @param groups string ou tableau de groupes (ex: 'F' ou ['C','F'])
 * @param data objet contenant les valeurs (ex: guideDetails)
 * @returns Array<{ label: string, value: string, orderKey: string, group: string }>
 */
export function getDisplayItemsForGroups(
  activityKey: string,
  groups: string | string[],
  data: { [key: string]: any },
  displayContext?: string
): any[] {
  const formattedActivityKey = activityKey.toLowerCase().replace(/\s+/g, '_');
  const config = ACTIVITY_CONFIGS[formattedActivityKey];
  if (!config) return [];

  // La vignette est un contexte étroit : elle prend la forme courte du
  // vocabulaire. Les pages de présentation gardent la forme longue.
  const form: 'short' | 'long' =
    displayContext === 'guide-card' ? 'short' : 'long';
  const labelOf = (field: ActivityFieldConfig): string =>
    vocabularyLabel(field.key, form) ?? field.label ?? field.key;

  const groupArray = Array.isArray(groups) ? groups : [groups];
  const availableItems: any[] = [];
  const groupsMap: {
    [groupName: string]: GroupMapEntry; // Utilisation du type défini
  } = {};
  // Tracker pour savoir quels champs ont été utilisés comme second fallback
  const fieldsUsedAsSecondFallback = new Set<string>();
  
  for (const mainGroupKey of groupArray) {
    // ex: 'C', 'D'
    const fieldsInMainGroup = config.fields[mainGroupKey] || [];
    for (let baseField of fieldsInMainGroup) {
      if (
        displayContext &&
        baseField.displayContextOverrides?.[displayContext]
      ) {
        const overrides = baseField.displayContextOverrides[displayContext];
        baseField = { ...baseField, ...overrides };
      }
      if (baseField.hide) {
        continue;
      }
      
      // Si ce champ a été utilisé comme second fallback ailleurs, ne pas l'afficher
      if (fieldsUsedAsSecondFallback.has(baseField.key)) {
        continue;
      }

      let value = data[baseField.key];
      // Valeur brute (avant fallback/format) : sert au rendu de la barre couenne.
      const rawValue = value;
      let usedFallback = false;
      let usedSecondFallback = false;
      
      // Si la valeur est vide et qu'un fallbackKey existe, utiliser la valeur de fallback
      // Sauf si le displayContext désactive explicitement le fallback
      const fallbackDisabled = displayContext && 
        baseField.displayContextOverrides?.[displayContext] !== undefined &&
        baseField.fallbackKey &&
        !baseField.displayContextOverrides[displayContext].fallbackKey;
      
      if (
        (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) &&
        baseField.fallbackKey &&
        !fallbackDisabled
      ) {
        value = data[baseField.fallbackKey];
        usedFallback = true;
        
        // Si le premier fallback est aussi vide et qu'un second fallback existe
        if (
          (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) &&
          baseField.secondFallbackKey
        ) {
          value = data[baseField.secondFallbackKey];
          usedFallback = false;
          usedSecondFallback = true;
          // Marquer ce champ comme utilisé en tant que second fallback
          fieldsUsedAsSecondFallback.add(baseField.secondFallbackKey);
        }
      }
      
      if (
        baseField.key === 'main_orientation' &&
        Array.isArray(value) &&
        value.length > 0
      ) {
        value = value.map((item: any) => item.orient).join(', ');
      }

      let displayValueStr: string;
      if (
        value !== null &&
        value !== undefined &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        if (baseField.valueFormatter) {
          value = baseField.valueFormatter(value);
        }
        displayValueStr = String(value);
      } else {
        displayValueStr = '-';
      }

      // Cotations couenne (vignette) : le total affiché est « nombre de voies du
      // site » (route_number), pas la somme des couples (cotation, nombre) —
      // seule cette fonction a accès à `data` (le valueFormatter ne voit que la
      // valeur du champ). rawValue non vide ⇒ on a le détail par cotation.
      if (
        baseField.key === 'grades_climbing_area' &&
        Array.isArray(rawValue) &&
        rawValue.length > 0
      ) {
        displayValueStr = formatGradesRangeText(rawValue, data['route_number']);
      }

      // Pour le second fallback (pitch_number), ne pas ajouter les parenthèses sauf dans le popup
      const isSecondFallbackWithoutParentheses = usedSecondFallback && 
        displayContext !== 'guide-guidebook-learn-more-popup';
      
      // Appliquer itemPrefix avant l'unité et la valeur formatée
      if (baseField.itemPrefix && displayValueStr !== '-' && !isSecondFallbackWithoutParentheses) {
        displayValueStr = baseField.itemPrefix + displayValueStr;
      }

      // Appliquer l'unité avec espace insécable (sauf pour le second fallback)
      if (baseField.unit && displayValueStr !== '-' && !isSecondFallbackWithoutParentheses) {
        displayValueStr = `${displayValueStr}\u00A0${baseField.unit}`;
      }

      // Appliquer suffix après l'unité
      if (baseField.itemSuffix && displayValueStr !== '-' && !isSecondFallbackWithoutParentheses) {
        displayValueStr = displayValueStr + baseField.itemSuffix;
      }
      
      // Pour le second fallback, ajouter " longueurs" directement
      if (isSecondFallbackWithoutParentheses && displayValueStr !== '-') {
        displayValueStr = displayValueStr + '\u00A0longueurs';
      }
      // Si displayValueStr est toujours '-' et qu'un prefix/suffix est défini, on pourrait choisir de les afficher ou non.
      // Pour l'instant, on les affiche seulement si la valeur n'est pas '-'.

      if (baseField.group) {
        const currentGroupName = baseField.group;
        if (!groupsMap[currentGroupName]) {
          // Utiliser le secondFallbackGroupPrefix si second fallback, sinon fallbackGroupPrefix si fallback, sinon groupPrefix normal
          let effectiveGroupPrefix: string;
          if (usedSecondFallback && baseField.secondFallbackGroupPrefix) {
            effectiveGroupPrefix = baseField.secondFallbackGroupPrefix;
          } else if (usedFallback && baseField.fallbackGroupPrefix) {
            effectiveGroupPrefix = baseField.fallbackGroupPrefix;
          } else {
            effectiveGroupPrefix = baseField.groupPrefix || labelOf(baseField);
          }
          
          groupsMap[currentGroupName] = {
            label: effectiveGroupPrefix,
            values: [],
            orderKey: baseField.orderKey || 'Z99',
            icon: baseField.icon,
            separator: baseField.groupSeparator || ' / ',
            mainGroupKey: mainGroupKey,
            isPrefixSet: !!(usedSecondFallback ? baseField.secondFallbackGroupPrefix : (usedFallback ? baseField.fallbackGroupPrefix : baseField.groupPrefix)),
            originalFieldsOrderKeys: [], // Ceci n'est pas utilisé actuellement mais pourrait l'être
          };
        }

        groupsMap[currentGroupName].values.push({
          value: displayValueStr,
          orderKey: baseField.orderKey,
          key: baseField.key, // Stocker la clé originale du champ
        });

        // Si ce champ a un groupPrefix et que le groupe ne l'avait pas encore, on met à jour le label du groupe.
        let effectiveGroupPrefixUpdate: string | undefined;
        if (usedSecondFallback && baseField.secondFallbackGroupPrefix) {
          effectiveGroupPrefixUpdate = baseField.secondFallbackGroupPrefix;
        } else if (usedFallback && baseField.fallbackGroupPrefix) {
          effectiveGroupPrefixUpdate = baseField.fallbackGroupPrefix;
        } else {
          effectiveGroupPrefixUpdate = baseField.groupPrefix;
        }
        
        if (effectiveGroupPrefixUpdate && !groupsMap[currentGroupName].isPrefixSet) {
          groupsMap[currentGroupName].label = effectiveGroupPrefixUpdate;
          groupsMap[currentGroupName].isPrefixSet = true;
          groupsMap[currentGroupName].orderKey =
            baseField.orderKey || groupsMap[currentGroupName].orderKey;
          groupsMap[currentGroupName].icon =
            baseField.icon || groupsMap[currentGroupName].icon;
        }
      } else {
        // Utiliser le secondFallbackLabel si second fallback, sinon fallbackLabel si fallback, sinon label normal
        let effectiveLabel: string;
        if (usedSecondFallback && baseField.secondFallbackLabel) {
          effectiveLabel = baseField.secondFallbackLabel;
        } else if (usedFallback && baseField.fallbackLabel) {
          effectiveLabel = baseField.fallbackLabel;
        } else {
          effectiveLabel = labelOf(baseField);
        }
        
        availableItems.push({
          label: effectiveLabel,
          value: displayValueStr,
          orderKey: baseField.orderKey,
          group: mainGroupKey, // Le grand groupe 'C', 'D', 'F'
          icon: baseField.icon,
          key: baseField.key,
          // Cotations couenne : données brutes pour <app-couenne-grade-bar>.
          // Non nul seulement si le détail par cotation existe (sinon on retombe
          // sur le texte de `value`, alimenté par le fallback grade_book).
          gradeBar:
            baseField.key === 'grades_climbing_area' &&
            Array.isArray(rawValue) &&
            rawValue.length > 0
              ? rawValue
              : null,
        });
      }
    }
  }

  for (const groupName in groupsMap) {
    const groupData = groupsMap[groupName];
    // Trier les valeurs au sein du groupe par leur orderKey original
    groupData.values.sort((a, b) => compareOrderKeys(a.orderKey, b.orderKey));

    let groupValue: string;
    const formatterKey = `${formattedActivityKey}_${groupData.mainGroupKey}_${groupName}`;
    const customFormatter = CUSTOM_GROUP_FORMATTERS[formatterKey];

    if (customFormatter) {
      groupValue = customFormatter(groupData);
    } else {
      // Nouvelle logique : n'afficher '-' que si tous les éléments sont '-', sinon n'afficher que les éléments non '-'
      const stringValues = groupData.values.map((v) => v.value);

      if (stringValues.length === 0) {
        groupValue = '-'; // Cas où un groupe est défini mais n'a pas de champs valides
      } else if (stringValues.every((val) => val === '-')) {
        groupValue = '-';
      } else {
        // On filtre les valeurs pour ne garder que celles qui ne sont pas '-'
        const filteredValues = stringValues.filter((val) => val !== '-');
        groupValue = filteredValues.join(groupData.separator);
      }
    }

    availableItems.push({
      label: groupData.label,
      value: groupValue,
      orderKey: groupData.orderKey, // OrderKey du groupe entier
      group: groupData.mainGroupKey, // Le grand groupe 'C', 'D', 'F'
      icon: groupData.icon,
      key: groupName, // La clé unique pour cet item groupé
    });
  }

  availableItems.sort((a, b) => compareOrderKeys(a.orderKey, b.orderKey));
  return availableItems;
}

// --- Vignette (contexte 'guide-card') : formats d'attributs par activité ---
// Les champs optionnels du serializer (B.13.2) sont OMIS quand ils valent
// 0/null/'' ; ces helpers renvoient donc null dans ce cas.
function fmtDurationOrNull(v: any): string | null {
  return v === null || v === undefined || v === ''
    ? null
    : formatDurationMinutesToHours(v);
}
function fmtMetersOrNull(v: any): string | null {
  return v === null || v === undefined || v === '' ? null : `${v} m`;
}
/** « a (b) » si les deux existent, sinon la seule présente, sinon null. */
function pairWithParens(a: string | null, b: string | null): string | null {
  if (a && b) return `${a} (${b})`;
  return a ?? b ?? null;
}

/**
 * Items du groupe C tels qu'affichés sur la VIGNETTE (section résultats ET
 * popup carte, contexte 'guide-card'). Part de getDisplayItemsForGroups puis
 * applique les formats par activité demandés (retours Seb) :
 *  - via ferrata : Cotation · Durée « totale (difficultés) » · Dénivelé
 *    « positif (difficultés) » — parenthèses omises s'il ne reste qu'une valeur ;
 *  - alpinisme : « longueur développée » remplacée par « dénivelé des difficultés ».
 * Les autres activités passent inchangées.
 */
export function getGuideCardGroupCItems(
  activityKey: string,
  data: { [key: string]: any }
): any[] {
  const key = activityKey.toLowerCase().replace(/\s+/g, '_');
  // Vignette : on n'affiche jamais un attribut vide (« - »), qui n'apporte rien
  // et alourdit la ligne (ex. « ↔ - » quand la longueur développée manque). La
  // page détail (getDisplayItemsForGroups direct) garde ses « - ».
  const clean = (items: any[]): any[] =>
    items.filter(
      (it) => it && it.value != null && it.value !== '' && it.value !== '-'
    );
  const base = getDisplayItemsForGroups(activityKey, 'C', data, 'guide-card');

  if (key === 'via_ferrata') {
    const items: any[] = [];
    const grade = base.find((i) => i.key === 'grade_alpine');
    if (grade && grade.value && grade.value !== '-') {
      items.push(grade);
    }
    const duree = pairWithParens(
      fmtDurationOrNull(data['duration_total']),
      fmtDurationOrNull(data['duration_difficulty'])
    );
    if (duree) {
      items.push({
        label: groupLabel('duration_total_difficulty'),
        value: duree,
        orderKey: 'C4',
        group: 'C',
        icon: resolvedIcon('topos/duration'),
        key: 'vf_duration',
      });
    }
    const deniv = pairWithParens(
      fmtMetersOrNull(data['elevation_gain']),
      fmtMetersOrNull(data['elevation_difficulty'])
    );
    if (deniv) {
      items.push({
        label: groupLabel('elevation_gain_difficulty'),
        value: deniv,
        orderKey: 'C5',
        group: 'C',
        icon: resolvedIcon('topos/positive_elevation'),
        key: 'vf_elevation',
      });
    }
    return clean(items);
  }

  if (key === 'mountaineering') {
    // Remplace « longueur développée » (item groupé 'longueur') par le
    // dénivelé des difficultés quand il est renseigné.
    const deniv = fmtMetersOrNull(data['elevation_difficulty']);
    if (!deniv) return clean(base);
    return clean(
      base.map((item) =>
        item.key === 'longueur'
          ? {
              ...item,
              value: deniv,
              label: vocabularyLabel('elevation_difficulty', 'short'),
              icon: resolvedIcon('topos/positive_elevation'),
            }
          : item
      )
    );
  }

  return clean(base);
}

// Helper function to compare orderKeys like "C5a", "D1", etc.
function compareOrderKeys(
  orderKeyA: string | undefined,
  orderKeyB: string | undefined
): number {
  if (!orderKeyA) return !orderKeyB ? 0 : 1; // no A, A is greater (or equal if no B)
  if (!orderKeyB) return -1; // no B, A is smaller

  const getOrderParts = (orderKey: string) => {
    const letter = orderKey.charAt(0).toUpperCase();
    const rest = orderKey.substring(1);
    const numMatch = rest.match(/^\d+/);
    const num = numMatch ? parseInt(numMatch[0], 10) : 0;
    const suffix = numMatch ? rest.substring(numMatch[0].length) : rest;
    return { letter, num, suffix };
  };

  const partsA = getOrderParts(orderKeyA);
  const partsB = getOrderParts(orderKeyB);

  if (partsA.letter !== partsB.letter) {
    return partsA.letter.localeCompare(partsB.letter);
  }
  if (partsA.num !== partsB.num) {
    return partsA.num - partsB.num;
  }
  return partsA.suffix.localeCompare(partsB.suffix);
}

/**
 * Récupère les champs C et D de l'activité en question, sauf si le champ est activity_type,
 * en appliquant le displayContext "guidebook-page" s'il existe.
 * @param activityKey clé de l'activité (ex: 'randonnée')
 * @param subActivityKey clé de l'activité secondaire (ex: 'escalade')
 * @returns Array<{ label: string, value: string, orderKey: string, group: string }>
 */
export function getDisplayItemsForGuidebooks(
  activityKey: string,
  subActivityKey: string
) {
  let formattedActivityKey = activityKey.toLowerCase().replace(/\s+/g, '_');
  let formattedSubActivityKey = subActivityKey
    .toLowerCase()
    .replace(/[\s_]+/g, '-');

  // L'API renvoie le nom anglais ('climbing') ; les configs escalade sont
  // déclinées par sous-type ('climbing-multi-pitch', 'climbing-boulder', …).
  if (formattedActivityKey === 'climbing' || formattedActivityKey === 'escalade') {
    formattedActivityKey = 'climbing-' + formattedSubActivityKey;
  }
  // On ajoute le displayContext "guidebook-page"
  const displayContext = "guidebook-page";
  const config = ACTIVITY_CONFIGS[formattedActivityKey];
  if (!config) return [];
  const fields = config.fields['C'] || [];
  const fieldsD = config.fields['D'] || [];
  const concatenatedFields = fields.concat(fieldsD);

  // Applique le displayContext "guidebook-page" si défini
  const filteredFields = concatenatedFields
    .map(field => {
      if (field.displayContextOverrides?.[displayContext]) {
        return { ...field, ...field.displayContextOverrides[displayContext] };
      }
      return field;
    })
    .filter(field => !field.hide);


  return filteredFields.map((field) => ({
    label: field.label,
    key: field.key,
    orderKey: field.orderKey,
    group: field.group,
    icon: field.icon,
  }));
}

export function getUnit(
  fieldKey: string,
  activityKey: string,
  subActivityKey: string,
  value: any
) {
  let formattedActivityKey = activityKey.toLowerCase().replace(/\s+/g, '_');
  let formattedSubActivityKey = subActivityKey
    .toLowerCase()
    .replace(/[\s_]+/g, '-');
  if (formattedActivityKey === 'climbing' || formattedActivityKey === 'escalade') {
    formattedActivityKey = 'climbing-' + formattedSubActivityKey;
  }
  const config = ACTIVITY_CONFIGS[formattedActivityKey];
  // On cherche le champ dans tous les groupes (C, D et F) : certains champs
  // réaffectés via displayContextOverrides (ex. elevation_difficulty pour la
  // grande voie) vivent dans le groupe F.
  const concatenatedFields = config
    ? [
        ...(config.fields['C'] || []),
        ...(config.fields['D'] || []),
        ...(config.fields['F'] || []),
      ]
    : [];
  const field = concatenatedFields.find((field) => field.key === fieldKey);
  if (field?.unit) {
    // Espace insécable avant l'unité (cohérent avec System B et les durées),
    // ex. « 80 m » plutôt que « 80m ».
    return `${value}\u00A0${field.unit}`;
  }
  if (field?.valueFormatter) {
    return field.valueFormatter(value);
  }
  // Pas d'unité ni de formateur dédié : seuls les champs de durée sont
  // formatés en h/min ; les autres (ex. pitch_number) gardent leur valeur
  // brute. Auparavant tout passait par formatDurationMinutesToHours, d'où le
  // « De 2 min à 20 min » affiché pour un nombre de longueurs.
  if (fieldKey.startsWith('duration_')) {
    return formatDurationMinutesToHours(value);
  }
  return `${value}`;
}

export function formatFieldValue(
  value: any,
  fieldKey: string,
  activityName: string,
  subActivity: string
): string {
  if (!value) return '-';

  // flight_type (parapente) : slugs EN → libellés FR (gère string/array/objet).
  if (fieldKey === 'flight_type') {
    return formatFlightTypes(value) || '-';
  }

  // climbing_style : slugs EN → libellés FR.
  if (fieldKey === 'climbing_style') {
    return formatClimbingStyles(value) || '-';
  }

  if (Array.isArray(value)) {
    // Formatte ['7c 1', '8b 2', '8b+ 2', '9a 1', '3c 2', '4c 6', '5a 3', '4b 6', '4a 2', '4c+ 2', '4b+ 1']
    // En "De 3c à 9a"
    if (fieldKey === "grades_climbing_area") {
      // Repli texte : regroupement par niveau (« 4 → 3 voies · 5 → 8 voies »).
      // Le rendu principal de l'agrégat passe par la barre (cf. guidebook-page).
      return formatGradesByLevelText(value);
    }
    if (fieldKey === "main_orientation" && value.includes("S") && value.includes("N") && value.includes("E") && value.includes("O")) {
      return "Toutes";
    }
    if (fieldKey === "first_ascent_date") {
      if (!value.length) return '-';
      const sortedDates = value.slice().sort();
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', options);
      };
      if (sortedDates.length === 1) {
        return `le ${formatDate(sortedDates[0])}`;
      }
      return `du ${formatDate(sortedDates[0])} au ${formatDate(sortedDates[sortedDates.length - 1])}`;
    }
    return value.length ? value.join(', ') : '-';
  }

  if (typeof value === 'object') {
    if (fieldKey.startsWith('grade_')) {
      if (value.min === value.max) {
        return value.min;
      }
      return `De ${value.min} à ${value.max}`;
    }

    const min = getUnit(fieldKey, activityName, subActivity, value.min);
    const max = getUnit(fieldKey, activityName, subActivity, value.max);
    if (min === max && min !== 'NaNh') {
      return `${min}`;
    }
    return `De ${min} à ${max}`;
  }

  return value.toString();
}


/**
 * Résolution d'un identifiant logique de pictogramme vers ce que la
 * plateforme sait afficher : un chemin de fichier pour le web, un nom de
 * glyphe pour l'app.
 */
export type IconResolver = (id: string) => string;

/**
 * Identifiants d'origine, conservés par champ.
 *
 * Sans eux, un second appel résoudrait une valeur déjà résolue — le web
 * demanderait le pictogramme « assets/pictos/topos/duration.svg », inconnu du
 * registre, et obtiendrait `unknown.svg`. La table rend l'opération
 * idempotente et permet de changer de résolveur en cours de route.
 */
let currentResolver: IconResolver = (id) => id;

/**
 * Résout un pictogramme construit à la volée, hors de la table.
 *
 * `getGuideCardGroupCItems` fabrique trois entrées agrégées (via ferrata) qui
 * n'existent dans aucune configuration : `resolveIcons()` ne peut donc pas
 * les atteindre, et elles ont besoin du résolveur au moment de l'appel.
 *
 * Par défaut l'identité : un front qui oublierait `resolveIcons()` verrait
 * des identifiants logiques bruts — visible et diagnosticable — plutôt qu'un
 * chemin faux.
 */
function resolvedIcon(id: string): string {
  return currentResolver(id);
}

const ORIGINAL_ICONS = new WeakMap<object, string>();

/** Résout l'icône d'un porteur — un champ, ou l'un de ses overrides. */
function applyIcon(holder: { icon?: string }, resolve: IconResolver): void {
  if (!ORIGINAL_ICONS.has(holder)) {
    if (holder.icon === undefined) return;
    ORIGINAL_ICONS.set(holder, holder.icon);
  }
  const id = ORIGINAL_ICONS.get(holder);
  if (id !== undefined) holder.icon = resolve(id);
}

/**
 * Applique la résolution des pictogrammes à toute la table, en place.
 *
 * À appeler **une fois au démarrage** par chaque front. On écrit dans la
 * table plutôt que d'en rendre une copie parce que les configurations
 * portent des fonctions de formatage (`valueFormatter`) qu'un clonage
 * structuré perdrait, et parce que des composants lisent `ACTIVITY_CONFIGS`
 * directement : une copie laisserait les deux versions coexister, ce qui est
 * la panne qu'on cherche à éviter.
 *
 * Les `displayContextOverrides` portent aussi des icônes — quatre champs de
 * `climbing-multi-pitch` en changent pour le popup « en savoir plus ». Les
 * oublier laisserait un identifiant logique arriver tel quel dans un
 * `<img src>`, donc une image cassée dans ce seul contexte.
 */
export function resolveIcons(
  resolve: IconResolver,
  configs: { [key: string]: ActivityConfig } = ACTIVITY_CONFIGS,
): void {
  currentResolver = resolve;
  for (const activity of Object.values(configs)) {
    for (const group of Object.values(activity.fields)) {
      for (const field of group) {
        applyIcon(field, resolve);
        for (const override of Object.values(field.displayContextOverrides ?? {})) {
          applyIcon(override, resolve);
        }
      }
    }
  }
}
