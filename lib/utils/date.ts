// ============================================================================
// DATE FORMATTING SINGLE SOURCE OF TRUTH (SSOT)
// ============================================================================

export type DateInput = string | number | Date | null | undefined;

export type DateVariant =
  | "standard"
  | "short"
  | "long"
  | "month-year"
  | "datetime"
  | "time";

export interface FormatDateOptions {
  /** Preset variant to apply */
  variant?: DateVariant;
  /** Fallback string if date is null, undefined, or invalid. Defaults to "—" */
  fallback?: string;
  /** BCP 47 language tag. Defaults to "en-US" to guarantee consistent SSR/CSR hydration */
  locale?: string;
  /** Custom Intl formatting options overriding the preset */
  options?: Intl.DateTimeFormatOptions;
}

// Preset formatting options for standard variants
const VARIANT_OPTIONS: Record<DateVariant, Intl.DateTimeFormatOptions> = {
  standard: {
    month: "short",
    day: "numeric",
    year: "numeric",
  },
  short: {
    month: "short",
    day: "numeric",
    year: "numeric",
  },
  long: {
    month: "long",
    day: "numeric",
    year: "numeric",
  },
  "month-year": {
    month: "long",
    year: "numeric",
  },
  datetime: {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  },
  time: {
    hour: "numeric",
    minute: "2-digit",
  },
};

// Cached pre-instantiated formatters for default "en-US" locale to maximize render performance
const DEFAULT_LOCALE = "en-US";
const DEFAULT_FORMATTERS: Record<DateVariant, Intl.DateTimeFormat> = {
  standard: new Intl.DateTimeFormat(DEFAULT_LOCALE, VARIANT_OPTIONS.standard),
  short: new Intl.DateTimeFormat(DEFAULT_LOCALE, VARIANT_OPTIONS.short),
  long: new Intl.DateTimeFormat(DEFAULT_LOCALE, VARIANT_OPTIONS.long),
  "month-year": new Intl.DateTimeFormat(DEFAULT_LOCALE, VARIANT_OPTIONS["month-year"]),
  datetime: new Intl.DateTimeFormat(DEFAULT_LOCALE, VARIANT_OPTIONS.datetime),
  time: new Intl.DateTimeFormat(DEFAULT_LOCALE, VARIANT_OPTIONS.time),
};

/**
 * Validates whether the given value can be parsed into a valid Date.
 */
export function isValidDate(date: unknown): date is string | number | Date {
  if (date === null || date === undefined || date === "") return false;
  const d = date instanceof Date ? date : new Date(date as string | number);
  return !isNaN(d.getTime());
}

/**
 * Universal Date Formatter (SSOT).
 * Formats a Date object, ISO string, or timestamp into a consistent presentation string.
 *
 * Guaranteed to never throw or return "Invalid Date". If the input is null, undefined,
 * or malformed, it gracefully returns the configured fallback string (default: "—").
 *
 * @example
 * formatDate("2026-09-17T12:00:00Z", "short")      // "Sep 17, 2026"
 * formatDate("2026-09-17T12:00:00Z", "long")       // "September 17, 2026"
 * formatDate("2026-09-17T12:00:00Z", "month-year") // "September 2026"
 * formatDate(null)                                 // "—"
 */
export function formatDate(
  date: DateInput,
  variantOrOptions?: DateVariant | FormatDateOptions,
): string {
  const options: FormatDateOptions =
    typeof variantOrOptions === "string"
      ? { variant: variantOrOptions }
      : variantOrOptions || {};

  const {
    variant = "standard",
    fallback = "—",
    locale = DEFAULT_LOCALE,
    options: customOptions,
  } = options;

  if (date === null || date === undefined || date === "") {
    return fallback;
  }

  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) {
    return fallback;
  }

  // Fast path: use cached Intl formatter for standard en-US queries without custom options
  if (locale === DEFAULT_LOCALE && !customOptions) {
    const formatter = DEFAULT_FORMATTERS[variant] || DEFAULT_FORMATTERS.standard;
    return formatter.format(d);
  }

  // Dynamic path: custom locale or custom formatting options
  const resolvedOptions = customOptions || VARIANT_OPTIONS[variant] || VARIANT_OPTIONS.standard;
  return new Intl.DateTimeFormat(locale, resolvedOptions).format(d);
}

/**
 * Formats a date relative to another date (defaults to now).
 * Useful for review timestamps, notification feeds, or activity streams.
 * Zero external dependencies.
 *
 * @example
 * formatRelativeTime("2026-09-17T11:00:00Z") // "1 hour ago"
 */
export function formatRelativeTime(
  date: DateInput,
  baseDate: DateInput = new Date(),
): string {
  if (!isValidDate(date) || !isValidDate(baseDate)) {
    return "—";
  }

  const d = date instanceof Date ? date : new Date(date);
  const base = baseDate instanceof Date ? baseDate : new Date(baseDate);
  const diffInSeconds = Math.round((base.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 30) return "just now";
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;

  const diffInMinutes = Math.round(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? "1 minute ago" : `${diffInMinutes} minutes ago`;
  }

  const diffInHours = Math.round(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
  }

  const diffInDays = Math.round(diffInHours / 24);
  if (diffInDays < 30) {
    return diffInDays === 1 ? "yesterday" : `${diffInDays} days ago`;
  }

  const diffInMonths = Math.round(diffInDays / 30);
  if (diffInMonths < 12) {
    return diffInMonths === 1 ? "1 month ago" : `${diffInMonths} months ago`;
  }

  const diffInYears = Math.round(diffInDays / 365);
  return diffInYears === 1 ? "1 year ago" : `${diffInYears} years ago`;
}
