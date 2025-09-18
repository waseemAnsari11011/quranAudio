/* File: src/lib/api.js */
// --- Local Backend API Configuration ---
const LOCAL_API_BASE_URL = "http://localhost:8000/api";
// const LOCAL_API_BASE_URL = "https://103e09ce49d5.ngrok-free.app/api"; // Use your ngrok URL here

import { getTafsirForChapter } from "./tafsirData";
import { usePlayerStore } from "./store";

/**
 * A generic fetch wrapper for calling the local backend API.
 * @param {string} endpoint - The API endpoint to call (e.g., "/chapters").
 * @param {object} options - Optional fetch options (method, body, etc.).
 * @returns {Promise<any>} - The JSON response from the API.
 */
async function fetchFromLocalAPI(endpoint, options = {}) {
  try {
    const res = await fetch(`${LOCAL_API_BASE_URL}${endpoint}`, options);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        `API error: ${errorData.message || res.statusText} (Status: ${
          res.status
        })`
      );
    }
    return res.json();
  } catch (error) {
    console.error(
      `Failed to fetch from ${LOCAL_API_BASE_URL}${endpoint}:`,
      error
    );
    // Re-throw the error to be handled by the calling component
    throw error;
  }
}

/**
 * Fetches the list of all Surahs (chapters) from the backend.
 * @returns {Promise<Array<object>>} - A list of Surah objects.
 */
export const fetchSurahs = async () => {
  const data = await fetchFromLocalAPI("/chapters");
  // Map the API response to the structure our components expect
  return data.chapters.map((surah) => ({
    number: surah.id,
    name: surah.name_simple,
    englishName: surah.translated_name.name,
    numberOfAyahs: surah.verses_count,
    revelationType:
      surah.revelation_place.charAt(0).toUpperCase() +
      surah.revelation_place.slice(1),
    // Pass the arabic name through as well
    name_arabic: surah.name_arabic,
  }));
};

/**
 * Constructs the proper audio URL based on the URL format returned by the API.
 * @param {string} audioFileUrl - The URL returned by the API.
 * @returns {string} - The properly formatted full URL.
 */
const constructAudioUrl = (audioFileUrl) => {
  // If the URL starts with //, it's a protocol-relative URL - add https:
  if (audioFileUrl.startsWith("//")) {
    return `https:${audioFileUrl}`;
  }

  // If the URL starts with http:// or https://, it's already a complete URL
  if (
    audioFileUrl.startsWith("http://") ||
    audioFileUrl.startsWith("https://")
  ) {
    return audioFileUrl;
  }

  // Otherwise, it's a relative URL - prepend the base URL
  const baseUrl = "https://verses.quran.foundation/";
  return `${baseUrl}${audioFileUrl}`;
};

/**
 * Fetches the audio URLs for a full Surah recitation or tafsir.
 * @param {number} reciterId - The ID of the reciter (ignored for tafsir).
 * @param {number} surahId - The ID of the Surah.
 * @param {string} trackType - Either "recitation" or "tafsir".
 * @returns {Promise<Array<string>>} - Array of audio file URLs.
 */
export const fetchFullSurahAudio = async (
  reciterId,
  surahId,
  trackType = "recitation"
) => {
  if (trackType === "tafsir") {
    // Get tafsir URLs from local data
    const tafsirUrls = getTafsirForChapter(surahId);

    if (tafsirUrls.length === 0) {
      throw new Error(`No tafsir audio found for Surah ${surahId}`);
    }

    return tafsirUrls;
  }

  // Handle recitation (existing logic)
  const data = await fetchFromLocalAPI(
    `/recitations/${reciterId}/by-chapter/${surahId}`,
    {
      params: {
        per_page: 500, // Get all verses at once
      },
    }
  );

  // Check if audio_file array exists and has content
  if (data.audio_file && data.audio_file.length > 0) {
    // Construct proper URLs based on the format returned by the API
    return data.audio_file.map((audioFile) => constructAudioUrl(audioFile.url));
  }

  throw new Error("No audio files found for this Surah and Reciter.");
};

/**
 * Fetches the list of available audio reciters.
 * @returns {Promise<Array<object>>} - A list of reciter objects.
 */
export const fetchReciters = async () => {
  const data = await fetchFromLocalAPI("/reciters");

  // Ensure the response structure is correctly handled
  if (data && data.recitations) {
    return data.recitations.map((reciter) => ({
      id: reciter.id,
      name: reciter.reciter_name,
      style: reciter.style,
    }));
  }

  return []; // Return empty array if the structure is not as expected
};

/**
 * Fetches details and verses for a single Surah.
 * @param {number|string} id - The ID of the Surah.
 * @returns {Promise<object>} - An object containing Surah info and its verses.
 */
export const fetchSurahById = async (id) => {
  const [surahData, versesData] = await Promise.all([
    fetchFromLocalAPI(`/chapters/${id}`),
    // Fetch verses with english translations (ID 131)
    fetchFromLocalAPI(
      `/verses/by-chapter/${id}?translations=131&fields=text_uthmani`
    ),
  ]);

  const surahInfo = {
    id: surahData.chapter.id,
    name_simple: surahData.chapter.name_simple,
    name_arabic: surahData.chapter.name_arabic,
    name_english: surahData.chapter.translated_name.name,
    name_translation: surahData.chapter.translated_name.name, // Fallback, consider a different field if available
    verses_count: surahData.chapter.verses_count,
    revelation_type: surahData.chapter.revelation_place,
  };

  const verses = versesData.verses.map((v) => ({
    id: v.verse_number,
    text_uthmani: v.text_uthmani,
    // Find the English translation from the translations array
    translation_english:
      v.translations.find((t) => t.language_name === "english")?.text ||
      "Translation not available.",
  }));

  return { ...surahInfo, verses };
};

export const signup = async (userData) => {
  return fetchFromLocalAPI("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
};

export const login = async (credentials) => {
  const data = await fetchFromLocalAPI("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  // Update the Zustand store on successful login
  if (data.token) {
    usePlayerStore.getState().login(data.token, data.user);
  }
  return data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const createOrder = async (amount) => {
  return fetchFromLocalAPI("/payment/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount }),
  });
};
