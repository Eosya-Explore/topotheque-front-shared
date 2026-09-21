// FICHIER GÉNÉRÉ — NE PAS ÉDITER À LA MAIN.
//
// Produit par `manage.py export_field_labels` à partir du vocabulaire
// canonique (backend/topotheque_app/labels.py), seule source de vérité des
// libellés de champs. Toute correction se fait là-bas, puis on régénère.
//
// Ce fichier vit dans `topotheque-front-shared` et non dans un front : les
// deux fronts en ont besoin, et celui qui ne pourrait pas l'atteindre
// garderait ses libellés en dur — c'est exactement ce que ce dispositif
// existe pour empêcher.
//
// `short` : vignettes et filtres — contextes étroits.
// `long`  : pages de présentation, admin, pages bots.

export interface FieldLabel {
  short: string;
  long: string;
  unit: string | null;
}

export const FIELD_LABELS: { [field: string]: FieldLabel } = {
  "climb_configuration": {
    "long": "Configuration de l'itinéraire",
    "short": "Configuration",
    "unit": null
  },
  "climbing_style": {
    "long": "Style(s) de grimpe",
    "short": "Style de grimpe",
    "unit": null
  },
  "costly": {
    "long": "Payant",
    "short": "Payant",
    "unit": null
  },
  "developed_length": {
    "long": "Longueur développée",
    "short": "Développé",
    "unit": "m"
  },
  "distance": {
    "long": "Distance",
    "short": "Distance",
    "unit": "km"
  },
  "distance_start_finish": {
    "long": "Distance de la navette voiture",
    "short": "Distance navette",
    "unit": "km"
  },
  "duration_approach": {
    "long": "Durée de l'approche",
    "short": "Durée approche",
    "unit": "min"
  },
  "duration_difficulty": {
    "long": "Durée des difficultés",
    "short": "Durée diff.",
    "unit": "min"
  },
  "duration_return": {
    "long": "Durée retour / descente",
    "short": "Durée retour",
    "unit": "min"
  },
  "duration_total": {
    "long": "Durée totale",
    "short": "Durée",
    "unit": "min"
  },
  "elevation_crag": {
    "long": "Altitude du site d'escalade",
    "short": "Altitude du site",
    "unit": "m"
  },
  "elevation_difficulty": {
    "long": "Dénivelé des difficultés",
    "short": "Dénivelé des difficultés",
    "unit": "m"
  },
  "elevation_end": {
    "long": "Altitude d'arrivée",
    "short": "Altitude arrivée",
    "unit": "m"
  },
  "elevation_gain": {
    "long": "Dénivelé total positif",
    "short": "Dénivelé +",
    "unit": "m"
  },
  "elevation_loss": {
    "long": "Dénivelé total négatif",
    "short": "Dénivelé -",
    "unit": "m"
  },
  "elevation_max": {
    "long": "Altitude maximale",
    "short": "Altitude maximale",
    "unit": "m"
  },
  "elevation_max_crag": {
    "long": "Hauteur maximale du site",
    "short": "Hauteur max du site",
    "unit": "m"
  },
  "elevation_min": {
    "long": "Altitude minimale",
    "short": "Altitude minimale",
    "unit": "m"
  },
  "elevation_min_crag": {
    "long": "Hauteur minimale du site",
    "short": "Hauteur min du site",
    "unit": "m"
  },
  "elevation_start": {
    "long": "Altitude de départ",
    "short": "Altitude départ",
    "unit": "m"
  },
  "end_place": {
    "long": "Lieu d'arrivée",
    "short": "Arrivée",
    "unit": null
  },
  "equipment": {
    "long": "Équipements",
    "short": "Équipements",
    "unit": null
  },
  "first_ascensionist": {
    "long": "Ouvreur(s)",
    "short": "Ouvreur(s)",
    "unit": null
  },
  "first_ascent_date": {
    "long": "Date de l'ouverture",
    "short": "Ouverture",
    "unit": null
  },
  "flight_elevation_loss": {
    "long": "Dénivelé de vol",
    "short": "Dénivelé du vol",
    "unit": "m"
  },
  "flight_type": {
    "long": "Type(s) de vol",
    "short": "Type de vol",
    "unit": null
  },
  "flood_risk": {
    "long": "Risque de crue",
    "short": "Risque de crue",
    "unit": null
  },
  "grade_aid_climbing": {
    "long": "Cotation escalade artificielle",
    "short": "Cotation artificielle",
    "unit": null
  },
  "grade_alpine": {
    "long": "Cotation alpine globale",
    "short": "Cotation alpine",
    "unit": null
  },
  "grade_biking": {
    "long": "Cotation difficulté VTT",
    "short": "Cotation VTT",
    "unit": null
  },
  "grade_book": {
    "long": "Cotation indiquée dans le topoguide",
    "short": "Cotation",
    "unit": null
  },
  "grade_canyon_vertical": {
    "long": "Cotation verticalité canyoning",
    "short": "Cotation verticalité",
    "unit": null
  },
  "grade_canyon_water": {
    "long": "Cotation aquatique canyoning",
    "short": "Cotation aquatique",
    "unit": null
  },
  "grade_engagement": {
    "long": "Cotation d'engagement",
    "short": "Cotation engagement",
    "unit": null
  },
  "grade_expo": {
    "long": "Cotation d'exposition",
    "short": "Cotation exposition",
    "unit": null
  },
  "grade_free_climbing": {
    "long": "Cotation escalade libre",
    "short": "Cotation libre",
    "unit": null
  },
  "grade_hiking": {
    "long": "Cotation difficulté randonnée",
    "short": "Cotation randonnée",
    "unit": null
  },
  "grade_ice": {
    "long": "Cotation cascade de glace",
    "short": "Cotation glace",
    "unit": null
  },
  "grade_mandatory_climbing": {
    "long": "Cotation escalade obligatoire",
    "short": "Cotation obligatoire",
    "unit": null
  },
  "grade_mixed": {
    "long": "Cotation mixte",
    "short": "Cotation mixte",
    "unit": null
  },
  "grade_protection": {
    "long": "Cotation équipement",
    "short": "Cotation équipement",
    "unit": null
  },
  "grade_ski_toponeige": {
    "long": "Cotation ski (toponeige)",
    "short": "Cotation ski",
    "unit": null
  },
  "grade_ski_up": {
    "long": "Cotation montée à ski",
    "short": "Cotation montée",
    "unit": null
  },
  "grade_snowshoeing": {
    "long": "Cotation difficulté raquette",
    "short": "Cotation raquette",
    "unit": null
  },
  "grades_bouldering_area": {
    "long": "Nombre de blocs par cotation",
    "short": "Cotations",
    "unit": null
  },
  "grades_climbing_area": {
    "long": "Nombre de voies par cotation",
    "short": "Cotations",
    "unit": null
  },
  "ign_map": {
    "long": "Référence de la carte IGN",
    "short": "Carte IGN",
    "unit": null
  },
  "itinerary_type": {
    "long": "Type d'itinéraire",
    "short": "Type d'itinéraire",
    "unit": null
  },
  "kids_friendly": {
    "long": "Convient aux enfants",
    "short": "Enfants",
    "unit": null
  },
  "landing_elevation": {
    "long": "Altitude d'atterrissage",
    "short": "Altitude atterrissage",
    "unit": "m"
  },
  "landing_name": {
    "long": "Lieu d'atterrissage",
    "short": "Atterrissage",
    "unit": null
  },
  "length": {
    "long": "Longueur du canyon",
    "short": "Longueur du canyon",
    "unit": "m"
  },
  "main_orientation": {
    "long": "Orientation(s) principale(s)",
    "short": "Orientation",
    "unit": null
  },
  "max_depth": {
    "long": "Profondeur maximale",
    "short": "Profondeur max",
    "unit": "m"
  },
  "max_drop": {
    "long": "Hauteur de la plus haute cascade",
    "short": "Plus haute cascade",
    "unit": "m"
  },
  "max_slope": {
    "long": "Pente maximale",
    "short": "Pente maximale",
    "unit": "°"
  },
  "max_slope_length": {
    "long": "Longueur de la pente maximale",
    "short": "Pente max.",
    "unit": "m"
  },
  "narrow_passage": {
    "long": "Passage étroit",
    "short": "Passage étroit",
    "unit": null
  },
  "period": {
    "long": "Quand y aller",
    "short": "Quand y aller",
    "unit": null
  },
  "pitch_number": {
    "long": "Nombre de longueurs",
    "short": "Nombre de longueurs",
    "unit": null
  },
  "rock_type": {
    "long": "Nature du rocher",
    "short": "Nature du rocher",
    "unit": null
  },
  "rope_length": {
    "long": "Longueur de corde nécessaire",
    "short": "Longueur de corde",
    "unit": "m"
  },
  "route_number": {
    "long": "Nombre de voies du site",
    "short": "Nb de voies du site",
    "unit": null
  },
  "shuttle": {
    "long": "Navette",
    "short": "Navette",
    "unit": null
  },
  "start_place": {
    "long": "Lieu de départ",
    "short": "Départ",
    "unit": null
  },
  "takeoff_elevation": {
    "long": "Altitude du site de décollage",
    "short": "Altitude décollage",
    "unit": "m"
  },
  "takeoff_name": {
    "long": "Lieu de décollage",
    "short": "Décollage",
    "unit": null
  },
  "vertical_number": {
    "long": "Nombre de verticales",
    "short": "Nombre de verticales",
    "unit": null
  }
};

// Doublons hérités des fronts : deux clés désignent le même champ.
export const FIELD_ALIASES: { [alias: string]: string } = {
  "elevation": "elevation_max",
  "ropes_length": "rope_length"
};
