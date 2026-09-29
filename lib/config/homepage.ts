/**
 * Single Source of Truth (SSOT) for OdysseyCart Homepage V2 Design Tokens.
 *
 * Enforces visual consistency, rhythm, and standardized typography/spacing
 * across all landing page sections.
 */

export const HOMEPAGE_TOKENS = {
  /**
   * Standardized vertical section padding across all homepage sections.
   */
  sectionPadding: "py-16 sm:py-20 lg:py-24",

  /**
   * Standardized horizontal constraint container.
   */
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",

  /**
   * Standardized card border radius across all cards (product, category, review).
   */
  cardRadius: "rounded-2xl",

  /**
   * Standardized typography scale for homepage section titles and descriptions.
   */
  typography: {
    sectionTitle: "text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900",
    sectionSubtitle: "text-sm sm:text-base text-slate-500 mt-2 max-w-2xl",
    sectionHeaderMargin: "mb-10 sm:mb-12 lg:mb-14",
  },

  /**
   * Semantic section backgrounds to alternate for clear visual hierarchy.
   */
  backgrounds: {
    white: "bg-white",
    subtle: "bg-slate-50/70",
  },
} as const;

export type HomepageTokens = typeof HOMEPAGE_TOKENS;
