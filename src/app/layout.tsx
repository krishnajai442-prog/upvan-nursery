import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Upvan Nursery — Buy Plants Online, Delivered Across India", template: "%s · Upvan Nursery" },
  description: "India's friendly online plant nursery. Shop indoor plants, succulents, flowering plants & air-purifying plants with secure payments and doorstep delivery to 27,000+ PIN codes.",
  keywords: ["buy plants online india", "online nursery", "indoor plants", "succulents", "plant delivery"],
  openGraph: {
    title: "Upvan Nursery — Buy Plants Online, Delivered Across India",
    description: "Hand-nurtured plants, eco packaging, pan-India delivery.",
    type: "website", locale: "en_IN", siteName: "Upvan Nursery",
    images: [{ url: "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?auto=format&fit=crop&w=1200&q=80", width: 1200, height: 630, alt: "Upvan Nursery" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#153624" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="bg-paper font-sans text-ink antialiased">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <Providers>
          <Navbar />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
          <WhatsAppFloat />
        </Providers>
      </body>
    </html>
  );
}