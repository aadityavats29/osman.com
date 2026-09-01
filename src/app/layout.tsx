import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

/**
 * Self-hosted variable fonts (no Google Fonts request at runtime — faster and
 * GDPR-friendlier for an EU audience). Files vendored from Fontsource (OFL).
 *
 * Archivo variable carries both wght (100–900) and wdth (62–125) axes — the
 * display voice of the site: strong, slightly condensed grotesk uppercase.
 */
const archivo = localFont({
  src: [
    {
      path: "../fonts/archivo-latin-standard-normal.woff2",
      style: "normal",
      weight: "100 900",
    },
  ],
  variable: "--font-archivo",
  display: "swap",
});

const inter = localFont({
  src: [
    {
      path: "../fonts/inter-latin-wght-normal.woff2",
      style: "normal",
      weight: "100 900",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Gilroy — the logotype's face, applied site-wide per the brand direction.
 * Only Regular (400) was supplied, so heavier weights are browser-synthesized;
 * drop real Medium/Bold files here later for true weights. Archivo and Inter
 * stay in the stacks behind it as fallbacks.
 */
const gilroy = localFont({
  src: [
    {
      path: "../fonts/gilroy-regular.woff2",
      style: "normal",
      weight: "400",
    },
  ],
  variable: "--font-gilroy",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.osmanmeyredi.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Osman Meyredi — Multi-instrumentalist, bassist & composer",
    template: "%s — Osman Meyredi",
  },
  description:
    "Osman Meyredi is a multi-instrumentalist, bassist and composer performing, coaching and facilitating workshops across the Netherlands, Italy and Europe.",
  openGraph: {
    type: "website",
    siteName: "Osman Meyredi",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${gilroy.variable} ${archivo.variable} ${inter.variable}`}>
      {/* No pre-hydration scripts needed: reveals arm themselves client-side
          after hydration (content is visible by default for no-JS visitors),
          and cursor/header states are only ever set by client components. */}
      <body>{children}</body>
    </html>
  );
}
