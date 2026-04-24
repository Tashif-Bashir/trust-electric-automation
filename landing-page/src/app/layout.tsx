import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  title:
    "NEOS Electric Radiators | Save Up to 40% on Heating Bills | Trust Electric Heating",
  description:
    "Switch to the NEOS radiator with patented natural stone core technology. Lower energy bills, zero emissions, no annual servicing. Get your free quote today.",
  keywords: [
    "electric radiators",
    "NEOS radiator",
    "electric heating",
    "save on heating bills",
    "stone core radiator",
    "zero emissions heating",
    "Trust Electric Heating",
    "Leeds",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    title:
      "NEOS Electric Radiators | Save Up to 40% on Heating Bills | Trust Electric Heating",
    description:
      "The NEOS radiator uses patented natural stone core technology to heat your room quickly, then maintain comfort by gradually releasing stored heat.",
    siteName: "Trust Electric Heating",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEOS Electric Radiators | Trust Electric Heating",
    description:
      "Save up to 40% on heating bills with the NEOS natural stone core radiator. Zero emissions, no annual servicing, made in Leeds.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.trustelectricheating.co.uk/#organization",
      name: "Trust Electric Heating Ltd",
      url: "https://www.trustelectricheating.co.uk",
      logo: "https://www.trustelectricheating.co.uk/theme/images/trust-logo-2x.png",
      foundingDate: "2014",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Elmfield Business Park, Lotherton Way, Garforth",
        addressLocality: "Leeds",
        postalCode: "LS25 2JY",
        addressCountry: "GB",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "info@trustelectricheating.co.uk",
        areaServed: "GB",
      },
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://www.trustelectricheating.co.uk/#local",
      name: "Trust Electric Heating Ltd",
      description:
        "Manufacturers of the NEOS electric radiator with patented natural stone core technology. Based in Leeds, serving the whole of the UK.",
      url: "https://www.trustelectricheating.co.uk",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Elmfield Business Park, Lotherton Way, Garforth",
        addressLocality: "Leeds",
        postalCode: "LS25 2JY",
        addressCountry: "GB",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 53.7874,
        longitude: -1.3726,
      },
      areaServed: {
        "@type": "Country",
        name: "United Kingdom",
      },
    },
    {
      "@type": "Product",
      "@id": "https://www.trustelectricheating.co.uk/#neos-radiator",
      name: "NEOS Electric Radiator",
      brand: {
        "@type": "Brand",
        name: "Trust Electric Heating",
      },
      description:
        "The NEOS radiator features a patented natural stone core that heats quickly and then releases stored warmth gradually — keeping rooms comfortable without constant energy draw. Zero emissions, no annual servicing, 10-year warranty.",
      category: "Electric Heating",
      manufacturer: {
        "@id": "https://www.trustelectricheating.co.uk/#organization",
      },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "GBP",
        availability: "https://schema.org/InStock",
        seller: {
          "@id": "https://www.trustelectricheating.co.uk/#organization",
        },
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${playfair.variable} ${dmSans.variable} h-full`}
    >
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='12' fill='%23e8833a'/><text y='.9em' font-size='75' x='50%' text-anchor='middle' font-family='serif' fill='white'>T</text></svg>"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-amber focus:text-white focus:rounded-lg"
        >
          Skip to main content
        </a>
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
