import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

/**
 * Self-hosted variable fonts (no Google Fonts request at runtime — faster and
 * GDPR-friendlier for an EU audience). Files vendored from Fontsource (OFL).
 */
const fraunces = localFont({
  src: [
    {
      path: "../fonts/fraunces-latin-full-normal.woff2",
      style: "normal",
      weight: "100 900",
    },
    {
      path: "../fonts/fraunces-latin-full-italic.woff2",
      style: "italic",
      weight: "100 900",
    },
  ],
  variable: "--font-fraunces",
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
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        {/* Motion gate: mark JS availability before first paint so scroll-reveal
            hiding never applies for no-JS visitors (progressive enhancement). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("js");`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
