import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export async function generateMetadata() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  
  try {
    // We use fetch with cache revalidation so it doesn't block heavily but stays fresh
    const res = await fetch(`${apiBaseUrl}/site-settings`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      return {
        title: data.seo_meta_title || "Nagpal Natraj Industries",
        description: data.seo_meta_description || "Precision Corrugation & Carton Box Packaging Machinery since 1952",
        keywords: data.seo_focus_keywords || "corrugation, packaging, machinery, India",
        icons: {
          icon: data.site_favicon || "/favicon.ico",
        },
        openGraph: {
          title: data.seo_meta_title || "Nagpal Natraj Industries",
          description: data.seo_meta_description || "Precision Corrugation machinery.",
          url: 'https://nagpalnatraj.com',
          siteName: 'Nagpal Natraj',
          images: [
            {
              url: data.site_logo || "/logo.png",
              width: 1200,
              height: 630,
              alt: data.seo_meta_title || "Nagpal Natraj Industries",
            }
          ],
          locale: 'en_US',
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: data.seo_meta_title || "Nagpal Natraj Industries",
          description: data.seo_meta_description || "Precision Corrugation machinery.",
          images: [data.site_logo || "/logo.png"],
        },
      };
    }
  } catch (err) {
    console.warn("Could not fetch SEO metadata:", err);
  }

  // Fallback if API fails
  return {
    title: "Nagpal Natraj Industries",
    description: "Precision Corrugation & Carton Box Packaging Machinery since 1952",
  };
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
