/* File: src/lib/hooks.js */
import { useState, useEffect } from "react";
import { fetchSurahs } from "./api";

// --- Local Storage Hook ---
// Persists state in localStorage.
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    // Prevent build errors during server-side rendering
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// --- All Surahs Hook ---
// Fetches all surah data once and caches it for the session.
// Useful for the audio player to get next/prev surah info without re-fetching.
export function useAllSurahs() {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSurahsData = async () => {
      // Check if data is already cached in session storage
      const cachedSurahs = sessionStorage.getItem("allSurahs");
      if (cachedSurahs && cachedSurahs !== "undefined") {
        try {
          const parsedData = JSON.parse(cachedSurahs);
          // Ensure cached data is a valid array before using it
          if (Array.isArray(parsedData)) {
            setSurahs(parsedData);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error(
            "Failed to parse cached surahs, removing invalid data.",
            e
          );
          // Clear invalid cache item to allow for a fresh fetch
          sessionStorage.removeItem("allSurahs");
        }
      }

      try {
        setLoading(true);
        const data = await fetchSurahs();
        // Only set state and cache if data is a valid array
        if (Array.isArray(data)) {
          setSurahs(data);
          sessionStorage.setItem("allSurahs", JSON.stringify(data));
        } else {
          // If the API fails or returns non-array data, throw an error
          throw new Error("Invalid data format received for surahs.");
        }
      } catch (err) {
        setError("Failed to load Surah list.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSurahsData();
  }, []);

  return { surahs, loading, error };
}
