// FICHIER GÉNÉRÉ — NE PAS ÉDITER À LA MAIN.
//
// Produit par `npm run generate` à partir de l'arborescence assets/pictos.
// Pour ajouter un pictogramme : déposer le SVG dans la bonne famille, puis
// régénérer. `npm run check` échoue si ce fichier ne correspond plus.

export type PictoFamily =
  | "activites"
  | "geographical"
  | "guidebooks"
  | "onMapPOIs"
  | "topos";

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
export const FALLBACK_PICTO_FILE = "unknown.svg";

export const PICTOS: { [id: string]: PictoEntry } = {
  "activites/backcountry_skiing": { family: "activites", glyph: "backcountry_skiing", files: { svg: "backcountry_skiing.svg", png: "backcountry_skiing.png" } },
  "activites/backcountry_skiing_select": { family: "activites", glyph: "backcountry_skiing_select", files: { svg: "backcountry_skiing_select.svg" } },
  "activites/canyoning": { family: "activites", glyph: "canyoning", files: { svg: "canyoning.svg", png: "canyoning.png" } },
  "activites/canyoning_select": { family: "activites", glyph: "canyoning_select", files: { svg: "canyoning_select.svg" } },
  "activites/caving": { family: "activites", glyph: "caving", files: { svg: "caving.svg" } },
  "activites/caving_select": { family: "activites", glyph: "caving_select", files: { svg: "caving_select.svg" } },
  "activites/climbing": { family: "activites", glyph: "climbing", files: { svg: "climbing.svg", png: "climbing.png" } },
  "activites/climbing_select": { family: "activites", glyph: "climbing_select", files: { svg: "climbing_select.svg", png: "climbing_select.png" } },
  "activites/diving": { family: "activites", glyph: "diving", files: { svg: "diving.svg" } },
  "activites/hiking": { family: "activites", glyph: "hiking", files: { svg: "hiking.svg", png: "hiking.png" } },
  "activites/hiking_select": { family: "activites", glyph: "hiking_select", files: { svg: "hiking_select.svg" } },
  "activites/mountain_biking": { family: "activites", glyph: "mountain_biking", files: { svg: "mountain_biking.svg", png: "mountain_biking.png" } },
  "activites/mountain_biking_select": { family: "activites", glyph: "mountain_biking_select", files: { svg: "mountain_biking_select.svg" } },
  "activites/mountaineering": { family: "activites", glyph: "mountaineering", files: { svg: "mountaineering.svg", png: "mountaineering.png" } },
  "activites/mountaineering_select": { family: "activites", glyph: "mountaineering_select", files: { svg: "mountaineering_select.svg" } },
  "activites/paddling": { family: "activites", glyph: "paddling", files: { svg: "paddling.svg", png: "paddling.png" } },
  "activites/paddling_select": { family: "activites", glyph: "paddling_select", files: { svg: "paddling_select.svg" } },
  "activites/paragliding": { family: "activites", glyph: "paragliding", files: { svg: "paragliding.svg", png: "paragliding.png" } },
  "activites/paragliding_select": { family: "activites", glyph: "paragliding_select", files: { svg: "paragliding_select.svg" } },
  "activites/snowshoeing": { family: "activites", glyph: "snowshoeing", files: { svg: "snowshoeing.svg", png: "snowshoeing.png" } },
  "activites/snowshoeing_select": { family: "activites", glyph: "snowshoeing_select", files: { svg: "snowshoeing_select.svg" } },
  "activites/via_ferrata": { family: "activites", glyph: "via_ferrata", files: { svg: "via_ferrata.svg", png: "via_ferrata.png" } },
  "activites/via_ferrata_select": { family: "activites", glyph: "via_ferrata_select", files: { svg: "via_ferrata_select.svg" } },
  "geographical/administrative_area": { family: "geographical", glyph: "administrative_area", files: { svg: "administrative_area.svg" } },
  "geographical/cave": { family: "geographical", glyph: "cave", files: { svg: "cave.svg" } },
  "geographical/cliff": { family: "geographical", glyph: "cliff", files: { svg: "cliff.svg" } },
  "geographical/glacier": { family: "geographical", glyph: "glacier", files: { svg: "glacier.svg" } },
  "geographical/hut": { family: "geographical", glyph: "hut", files: { svg: "hut.svg" } },
  "geographical/hut_white": { family: "geographical", glyph: "hut_white", files: { svg: "hut_white.svg" } },
  "geographical/lake": { family: "geographical", glyph: "lake", files: { svg: "lake.svg" } },
  "geographical/mountain_range": { family: "geographical", glyph: "mountain_range", files: { svg: "mountain_range.svg" } },
  "geographical/protected_area": { family: "geographical", glyph: "protected_area", files: { svg: "protected_area.svg" } },
  "geographical/protected_area_white": { family: "geographical", glyph: "protected_area_white", files: { svg: "protected_area_white.svg" } },
  "geographical/river": { family: "geographical", glyph: "river", files: { svg: "river.svg" } },
  "geographical/saddle": { family: "geographical", glyph: "saddle", files: { svg: "saddle.svg" } },
  "geographical/summit": { family: "geographical", glyph: "summit", files: { svg: "summit.svg" } },
  "geographical/summit_white": { family: "geographical", glyph: "summit_white", files: { svg: "summit_white.svg" } },
  "geographical/waterfall": { family: "geographical", glyph: "waterfall", files: { svg: "waterfall.svg" } },
  "guidebooks/author": { family: "guidebooks", glyph: "author", files: { svg: "author.svg" } },
  "guidebooks/collection": { family: "guidebooks", glyph: "collection", files: { svg: "collection.svg" } },
  "guidebooks/guidebook": { family: "guidebooks", glyph: "guidebook", files: { svg: "guidebook.svg" } },
  "guidebooks/publication": { family: "guidebooks", glyph: "publication", files: { svg: "publication.svg" } },
  "guidebooks/publisher": { family: "guidebooks", glyph: "publisher", files: { svg: "publisher.svg" } },
  "guidebooks/weight": { family: "guidebooks", glyph: "weight", files: { svg: "weight.svg" } },
  "onMapPOIs/administrative_area": { family: "onMapPOIs", glyph: "administrative_area", files: { svg: "administrative_area.svg" } },
  "onMapPOIs/cave": { family: "onMapPOIs", glyph: "cave", files: { svg: "cave.svg" } },
  "onMapPOIs/cliff": { family: "onMapPOIs", glyph: "cliff", files: { svg: "cliff.svg" } },
  "onMapPOIs/finish": { family: "onMapPOIs", glyph: "finish", files: { svg: "finish.svg" } },
  "onMapPOIs/glacier": { family: "onMapPOIs", glyph: "glacier", files: { svg: "glacier.svg" } },
  "onMapPOIs/hut": { family: "onMapPOIs", glyph: "hut", files: { svg: "hut.svg" } },
  "onMapPOIs/lake": { family: "onMapPOIs", glyph: "lake", files: { svg: "lake.svg" } },
  "onMapPOIs/mountain_range": { family: "onMapPOIs", glyph: "mountain_range", files: { svg: "mountain_range.svg" } },
  "onMapPOIs/protected_area": { family: "onMapPOIs", glyph: "protected_area", files: { svg: "protected_area.svg" } },
  "onMapPOIs/river": { family: "onMapPOIs", glyph: "river", files: { svg: "river.svg" } },
  "onMapPOIs/saddle": { family: "onMapPOIs", glyph: "saddle", files: { svg: "saddle.svg" } },
  "onMapPOIs/start": { family: "onMapPOIs", glyph: "start", files: { svg: "start.svg" } },
  "onMapPOIs/summit": { family: "onMapPOIs", glyph: "summit", files: { svg: "summit.svg" } },
  "onMapPOIs/waterfall": { family: "onMapPOIs", glyph: "waterfall", files: { svg: "waterfall.svg" } },
  "topos/aid": { family: "topos", glyph: "aid", files: { svg: "aid.svg" } },
  "topos/altitude": { family: "topos", glyph: "altitude", files: { svg: "altitude.svg" } },
  "topos/costly": { family: "topos", glyph: "costly", files: { svg: "costly.svg" } },
  "topos/difficulty_rating": { family: "topos", glyph: "difficulty_rating", files: { svg: "difficulty_rating.svg" } },
  "topos/distance": { family: "topos", glyph: "distance", files: { svg: "distance.svg" } },
  "topos/duration": { family: "topos", glyph: "duration", files: { svg: "duration.svg" } },
  "topos/engagement": { family: "topos", glyph: "engagement", files: { svg: "engagement.svg" } },
  "topos/equipment": { family: "topos", glyph: "equipment", files: { svg: "equipment.svg" } },
  "topos/exposition": { family: "topos", glyph: "exposition", files: { svg: "exposition.svg" } },
  "topos/flood_risk": { family: "topos", glyph: "flood_risk", files: { svg: "flood_risk.svg" } },
  "topos/ice": { family: "topos", glyph: "ice", files: { svg: "ice.svg" } },
  "topos/ign_map": { family: "topos", glyph: "ign_map", files: { svg: "ign_map.svg" } },
  "topos/itinerary": { family: "topos", glyph: "itinerary", files: { svg: "itinerary.svg" } },
  "topos/kids": { family: "topos", glyph: "kids", files: { svg: "kids.svg" } },
  "topos/length": { family: "topos", glyph: "length", files: { svg: "length.svg" } },
  "topos/mixed": { family: "topos", glyph: "mixed", files: { svg: "mixed.svg" } },
  "topos/narrow_passage": { family: "topos", glyph: "narrow_passage", files: { svg: "narrow_passage.svg" } },
  "topos/opener": { family: "topos", glyph: "opener", files: { svg: "opener.svg" } },
  "topos/orientation": { family: "topos", glyph: "orientation", files: { svg: "orientation.svg" } },
  "topos/period": { family: "topos", glyph: "period", files: { svg: "period.svg" } },
  "topos/pitch": { family: "topos", glyph: "pitch", files: { svg: "pitch.svg" } },
  "topos/positive_elevation": { family: "topos", glyph: "positive_elevation", files: { svg: "positive_elevation.svg" } },
  "topos/rock_type": { family: "topos", glyph: "rock_type", files: { svg: "rock_type.svg" } },
  "topos/ropes": { family: "topos", glyph: "ropes", files: { svg: "ropes.svg" } },
  "topos/ski": { family: "topos", glyph: "ski", files: { svg: "ski.svg" } },
  "topos/slope": { family: "topos", glyph: "slope", files: { svg: "slope.svg" } },
  "topos/vertical": { family: "topos", glyph: "vertical", files: { svg: "vertical.svg" } },
  "topos/waterfall_height": { family: "topos", glyph: "waterfall_height", files: { svg: "waterfall_height.svg" } },
};
