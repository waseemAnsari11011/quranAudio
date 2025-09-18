/* File: src/app/page.js */
import SurahList from "@/components/surah/SurahList";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-green-600 dark:text-green-500">
          Listen to the Holy Quran
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-balance">
          Browse through the Surahs and start listening to the beautiful
          recitations from renowned Qaris from around the world.
        </p>
      </section>

      {/* The SurahList component - removed the commented out code */}
      <section>
        <SurahList />
      </section>
    </div>
  );
}
