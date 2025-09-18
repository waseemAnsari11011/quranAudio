/* File: src/components/audio/ReciterSelect.jsx */
"use client";
import React, { useState, useEffect } from "react";
import { fetchReciters } from "@/lib/api";
import { usePlayerStore } from "@/lib/store";

const ReciterSelect = () => {
  const [reciters, setReciters] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentReciterId, setCurrentReciterId } = usePlayerStore();

  useEffect(() => {
    const loadReciters = async () => {
      try {
        setLoading(true);
        const data = await fetchReciters();
        setReciters(data);
        // If no reciter is selected or the current one doesn't exist, set default
        if (!currentReciterId || !data.find((r) => r.id === currentReciterId)) {
          const defaultReciter = data.find((r) => r.id === 7) || data[0];
          if (defaultReciter) {
            setCurrentReciterId(defaultReciter.id);
          }
        }
      } catch (error) {
        console.error("Failed to load reciters list:", error);
        // Set fallback reciters if API fails
        const fallbackReciters = [
          { id: 7, name: "Mishary Rashid Alafasy", style: "Murattal" },
          { id: 1, name: "Abdul Basit Abdul Samad", style: "Murattal" },
          { id: 2, name: "Abdullah Basfar", style: "Murattal" },
        ];
        setReciters(fallbackReciters);
        if (!currentReciterId) {
          setCurrentReciterId(7);
        }
      } finally {
        setLoading(false);
      }
    };

    loadReciters();
  }, [currentReciterId, setCurrentReciterId]);

  const handleReciterChange = (e) => {
    const reciterId = parseInt(e.target.value, 10);
    setCurrentReciterId(reciterId);
  };

  if (loading) {
    return (
      <select
        disabled
        className="w-48 max-w-full pl-3 pr-8 py-2 text-sm border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        <option>Loading...</option>
      </select>
    );
  }

  return (
    <select
      id="reciter"
      name="reciter"
      value={currentReciterId}
      onChange={handleReciterChange}
      className="w-48 max-w-full pl-3 pr-8 py-2 text-sm border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
    >
      {reciters.map((reciter) => (
        <option key={reciter.id} value={reciter.id}>
          {reciter.name}
        </option>
      ))}
    </select>
  );
};

export default ReciterSelect;
