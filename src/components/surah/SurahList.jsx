"use client";
import React, { useState, useEffect } from "react";
import SurahCard from "./SurahCard.jsx";
import { fetchSurahs } from "@/lib/api.js";

// Skeleton component for loading state that matches the new SurahCard UI
const SurahCardSkeleton = () => (
  <div className="bg-gray-800/50 p-4 rounded-lg shadow-md animate-pulse">
    <div className="flex items-center justify-between space-x-4">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 w-16 h-16 bg-gray-700 rounded-xl transform rotate-45"></div>
        <div>
          <div className="h-6 bg-gray-700 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-24"></div>
        </div>
      </div>
      <div className="text-right">
        <div className="h-8 bg-gray-700 rounded w-28 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-16"></div>
      </div>
    </div>
  </div>
);

const SurahList = () => {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSurahs = async () => {
      try {
        setLoading(true);
        const data = await fetchSurahs();
        setSurahs(data);
      } catch (err) {
        console.error("Failed to load Surahs:", err);
        setError("Could not load the list of Surahs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadSurahs();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <SurahCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {surahs.map((surah) => (
        <SurahCard key={surah.number} surah={surah} />
      ))}
    </div>
  );
};

export default SurahList;
