export interface BrandLogo {
  src: string;
  name: string;
  /** Optional per-logo scale to normalise logos that render small (built-in whitespace). Default 1. */
  scale?: number;
}

export const BRAND_LOGOS: BrandLogo[] = [
  { src: "/logos/broadus-sm.png",    name: "Broadus Foods"    },
  { src: "/logos/bud-light.png",     name: "Bud Light"        },
  { src: "/logos/champs-sports.png", name: "Champs Sports",   scale: 1.35 },
  { src: "/logos/complexcon.png",    name: "ComplexCon"       },
  { src: "/logos/finishline.png",    name: "Finish Line",     scale: 1.2  },
  { src: "/logos/flexx.png",         name: "Flexx Nutrition", scale: 1.2  },
  { src: "/logos/footlocker.png",    name: "Foot Locker",     scale: 1.45 },
  { src: "/logos/knicks.png",        name: "NY Knicks",       scale: 1.4  },
  { src: "/logos/lids.png",          name: "Lids"             },
  { src: "/logos/mcdonalds.png",     name: "McDonald's",      scale: 1.2  },
  { src: "/logos/nike.png",          name: "Nike",            scale: 1.25 },
  { src: "/logos/puma.png",          name: "Puma",            scale: 1.1  },
  { src: "/logos/snoop-cereal.png",  name: "Snoop Cereal",    scale: 1.15 },
  { src: "/logos/1800.png",          name: "1800 Tequila"     },
];
