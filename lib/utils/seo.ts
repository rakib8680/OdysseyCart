import type { Metadata } from "next";

export interface SEOOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  noIndex?: boolean;
}

const DEFAULT_TITLE = "OdysseyCart — Premium E-Commerce Storefront";
const DEFAULT_DESCRIPTION =
  "Discover top-rated products, accessories, tech, and furniture with fast shipping and secure checkout on OdysseyCart.";
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1200&h=630&q=80";

/**
 * Centralized SEO & Metadata construction utility.
 * Enforces DRY metadata structure, OpenGraph standards, Twitter card tags, and canonical links across all routes.
 */
export function constructMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url = "/",
  noIndex = false,
}: SEOOptions = {}): Metadata {
  const formattedTitle = title
    ? title.includes("OdysseyCart")
      ? title
      : `${title} | OdysseyCart`
    : DEFAULT_TITLE;

  return {
    title: formattedTitle,
    description,
    openGraph: {
      title: formattedTitle,
      description,
      images: image ? [{ url: image }] : [{ url: DEFAULT_IMAGE }],
      url,
      siteName: "OdysseyCart",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: formattedTitle,
      description,
      images: image ? [image] : [DEFAULT_IMAGE],
    },
    alternates: {
      canonical: url,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
