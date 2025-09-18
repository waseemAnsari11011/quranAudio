import { fetchSurahById } from "@/lib/api";
import SurahDetail from "@/components/surah/SurahDetail";

// This function generates the page title and metadata dynamically
export async function generateMetadata({ params }) {
  try {
    const surah = await fetchSurahById(params.surahId);
    if (!surah) {
      return {
        title: "Surah Not Found",
        description: "The requested Surah could not be found.",
      };
    }
    return {
      title: `${surah.name_english} (${surah.name_arabic}) - Quran Audio`,
      description: `Listen to Surah ${surah.name_english}, which is a ${surah.revelation_type} surah with ${surah.verses_count} verses.`,
    };
  } catch (error) {
    return {
      title: "Error",
      description: "An error occurred while fetching Surah details.",
    };
  }
}

// This is the main page component for the dynamic route
export default async function SurahPage({ params }) {
  const { surahId } = params;

  try {
    const surah = await fetchSurahById(surahId);

    if (!surah) {
      return (
        <div className="text-center py-10">
          <h1 className="text-3xl font-bold">Surah Not Found</h1>
          <p className="text-gray-500 mt-2">
            The Surah you are looking for does not exist.
          </p>
        </div>
      );
    }

    // We pass the fetched data to a client component to handle interactions
    return <SurahDetail surah={surah} />;
  } catch (error) {
    console.error("Failed to fetch surah:", error);
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold text-red-500">An Error Occurred</h1>
        <p className="text-gray-500 mt-2">
          Could not load the Surah details. Please try again later.
        </p>
      </div>
    );
  }
}
