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
    "A modern, ad-free platform for listening to the Holy Quran with verse-by-verse recitations and tafsir.",
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
