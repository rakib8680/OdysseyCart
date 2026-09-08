/**
 * Enterprise Color & Swatch Resolution Engine
 *
 * Implements WCAG 2.1 Relative Luminance mathematics for dynamic contrast
 * boundary detection, paired with a comprehensive commercial e-commerce
 * color palette (80+ colorways across tech, apparel, and footwear).
 */

export interface ColorSwatchInfo {
  /** Hex color code or CSS linear-gradient string */
  background: string;
  /**
   * Mathematically computed via WCAG 2.1 relative luminance formula.
   * True if the color luminance exceeds 0.75 (requires contrast border on light backgrounds).
   */
  needsBorder: boolean;
  /** True if the swatch is a dual-tone split gradient (e.g. "Black / White") */
  isDualTone?: boolean;
  /** WCAG relative luminance value between 0 (pure black) and 1 (pure white) */
  luminance?: number;
}

// =============================================================================
// 1. COMMERCIAL E-COMMERCE COLOR MAPPING (80+ Commercial Colorways)
// =============================================================================

export const COLOR_HEX_MAP: Record<string, string> = {
  // Pure Neutrals & Monochromes
  black: "#0a0a0a",
  white: "#ffffff",
  snow: "#fbfbfb",
  offwhite: "#faf9f6",
  "off-white": "#faf9f6",
  "off white": "#faf9f6",
  ivory: "#fffff0",
  cream: "#fffdd0",
  bone: "#e3dac9",
  chalk: "#f6f6f4",
  oatmeal: "#e3dac9",
  linen: "#faf0e6",
  eggshell: "#f0ead6",

  // Modern Grays & Metals
  gray: "#6b7280",
  grey: "#6b7280",
  "light gray": "#d1d5db",
  "light grey": "#d1d5db",
  "dark gray": "#374151",
  "dark grey": "#374151",
  charcoal: "#262626",
  anthracite: "#292a2d",
  slate: "#64748b",
  silver: "#e2e8f0",
  platinum: "#e5e4e2",
  ash: "#b2beb5",
  smoke: "#738276",
  "heather gray": "#9ca3af",
  "heather grey": "#9ca3af",

  // Tech & Flagship Hardware Finishes (Apple, Google, Samsung)
  "space gray": "#4e4e52",
  "space grey": "#4e4e52",
  "space black": "#1d1d1f",
  midnight: "#191e24",
  "midnight black": "#121316",
  "midnight blue": "#1e293b",
  starlight: "#f0ece1",
  graphite: "#4c4b49",
  "sierra blue": "#9bb5ce",
  "alpine green": "#505f4e",
  "pacific blue": "#2d4e68",
  "deep purple": "#493b59",
  titanium: "#878681",
  "natural titanium": "#9a968f",
  "desert titanium": "#c2ab99",
  "black titanium": "#2d2d2d",
  "white titanium": "#e3e4e5",
  "jet black": "#080808",
  obsidian: "#1b1b1e",
  hazel: "#545951",
  porcelain: "#f4f1ea",
  bay: "#9ab3c9",
  aloe: "#bccfc0",
  mint: "#a7f3d0",

  // Blues & Navies
  navy: "#0f172a",
  "navy blue": "#1e3a8a",
  blue: "#2563eb",
  "royal blue": "#1d4ed8",
  cobalt: "#1e40af",
  sky: "#38bdf8",
  "sky blue": "#0ea5e9",
  cyan: "#06b6d4",
  teal: "#0d9488",
  turquoise: "#14b8a6",
  aquamarine: "#7fffd4",
  cerulean: "#007ba7",
  indigo: "#4f46e5",
  ocean: "#0369a1",
  ice: "#e0f2fe",
  "ice blue": "#bae6fd",

  // Greens & Earthy Tones
  green: "#16a34a",
  emerald: "#059669",
  forest: "#14532d",
  "forest green": "#166534",
  olive: "#556b2f",
  "olive green": "#3f6212",
  sage: "#9ca986",
  "sage green": "#849372",
  moss: "#4a5d4e",
  khaki: "#c3b091",
  army: "#4b5320",
  "army green": "#4b5320",
  lime: "#84cc16",

  // Warm Earths, Browns & Leathers
  brown: "#78350f",
  tan: "#d2b48c",
  camel: "#c19a6b",
  beige: "#f5f5dc",
  sand: "#e6c280",
  caramel: "#af6e4d",
  mocha: "#4a3525",
  espresso: "#362b28",
  chocolate: "#3b2219",
  cognac: "#9e472a",
  terracotta: "#e2725b",
  rust: "#b7410e",
  bronze: "#cd7f32",
  copper: "#b87333",

  // Reds, Maroons & Corals
  red: "#dc2626",
  crimson: "#991b1b",
  scarlet: "#ff2400",
  ruby: "#9b111e",
  burgundy: "#800020",
  maroon: "#831843",
  wine: "#722f37",
  bordeaux: "#5c0632",
  coral: "#f87171",
  salmon: "#fa8072",
  rose: "#f43f5e",
  "rose gold": "#b76e79",
  "product red": "#d91d24",

  // Pinks & Purples
  pink: "#ec4899",
  blush: "#de5d83",
  fuchsia: "#d946ef",
  magenta: "#c026d3",
  purple: "#9333ea",
  violet: "#7c3aed",
  lavender: "#e9d5ff",
  lilac: "#c8a2c8",
  mauve: "#e0b0ff",
  plum: "#dda0dd",

  // Yellows, Oranges & Golds
  yellow: "#eab308",
  gold: "#d97706",
  amber: "#f59e0b",
  orange: "#f97316",
  peach: "#ffcba4",
  mustard: "#d97706",
};

// =============================================================================
// 2. MATHEMATICAL WCAG 2.1 RELATIVE LUMINANCE ALGORITHM
// =============================================================================

/**
 * Normalizes an 8-bit sRGB color channel into linear luminance space per WCAG 2.1.
 * Standard: https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
function sRGBtoLinear(channel8Bit: number): number {
  const sRGB = channel8Bit / 255;
  return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
}

/**
 * Calculates the exact WCAG 2.1 relative luminance of any hex color code.
 *
 * Formula: L = 0.2126 * R + 0.7152 * G + 0.0722 * B
 * Returns: float from 0.0 (pure black) to 1.0 (pure white).
 */
export function getRelativeLuminance(hex: string): number {
  const cleanHex = hex.replace("#", "").trim();

  let r = 0;
  let g = 0;
  let b = 0;

  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  } else {
    // Default fallback if malformed
    return 0.5;
  }

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return 0.5;
  }

  const rLinear = sRGBtoLinear(r);
  const gLinear = sRGBtoLinear(g);
  const bLinear = sRGBtoLinear(b);

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Determines whether a color is considered "light" mathematically
 * and requires an optical boundary border to prevent bleeding into light canvases.
 * Standard e-commerce threshold is L >= 0.75 (covers whites, creams, silvers, light pastels).
 */
export function isLightColor(hex: string, threshold = 0.75): boolean {
  return getRelativeLuminance(hex) >= threshold;
}

// =============================================================================
// 3. COLOR RESOLUTION FUNCTIONS
// =============================================================================

/**
 * Resolves a commercial color name string into a hex code.
 * Supports direct matches, multi-word matching, and fallback matching.
 */
export function resolveColorHex(colorName: string): string {
  const normalized = colorName.toLowerCase().trim();

  // 1. Direct hex input support (e.g. "#1e3a8a")
  if (normalized.startsWith("#") && (normalized.length === 4 || normalized.length === 7)) {
    return normalized;
  }

  // 2. Direct exact match in dictionary
  if (COLOR_HEX_MAP[normalized]) {
    return COLOR_HEX_MAP[normalized];
  }

  // 3. Keyword matching (prioritizing longer multi-word keys first)
  const sortedKeys = Object.keys(COLOR_HEX_MAP).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (normalized.includes(key)) {
      return COLOR_HEX_MAP[key];
    }
  }

  // 4. Default fallback to neutral slate
  return "#94a3b8";
}

/**
 * Resolves a color name or option value into complete swatch styling:
 * - Single colors: hex code + mathematically calculated `needsBorder`
 * - Two-tone colors ("Black / White", "Navy / Red"): 45-degree split linear-gradient
 *   with optical contrast border if either component color is light.
 */
export function resolveColorSwatch(colorName: string): ColorSwatchInfo {
  const raw = colorName.trim();

  // Check for dual-color two-tone format (e.g. "Black / White", "Navy / Gold")
  if (raw.includes("/")) {
    const parts = raw.split("/").map((p) => p.trim());
    if (parts.length === 2 && parts[0] && parts[1]) {
      const hexA = resolveColorHex(parts[0]);
      const hexB = resolveColorHex(parts[1]);
      const lumA = getRelativeLuminance(hexA);
      const lumB = getRelativeLuminance(hexB);
      const needsBorder = lumA >= 0.75 || lumB >= 0.75;

      return {
        background: `linear-gradient(135deg, ${hexA} 50%, ${hexB} 50%)`,
        needsBorder,
        isDualTone: true,
        luminance: (lumA + lumB) / 2,
      };
    }
  }

  const hex = resolveColorHex(raw);
  const luminance = getRelativeLuminance(hex);
  const needsBorder = isLightColor(hex);

  return {
    background: hex,
    needsBorder,
    isDualTone: false,
    luminance,
  };
}
