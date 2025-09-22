/* File: src/app/layout.js */
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Providers } from "@/components/layout/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Quran Audio - Listen to the Holy Quran",
  description:
    "Explore the Quran with high-quality audio recitations, translations, and tafsir from various Qaris. An ad-free and accessible platform for a beautiful Quran listening experience.",
  openGraph: {
    title: "Quran Audio - Listen & Understand the Holy Quran",
    description:
      "Immerse yourself in the words of the Almighty. Listen to beautiful recitations, explore different Qaris, and understand the meaning with translation and tafsir for a beautiful experience. Click to start your spiritual journey.",
    url: "https://quranaudio.in",
    images: [
      {
        url: "https://quranaudio.in/quran-audio-og-image.png", // Correct absolute URL
        width: 1200,
        height: 630,
        alt: "Quran Audio - Listen & Reflect",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      {/* The <head> tag is managed by Next.js, no need for manual content here */}
      <head />
      <body
        className={`${inter.className} bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200`}
      >
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
            {/* We wrap the children with our new client-side Provider component */}
            <Providers>{children}</Providers>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
