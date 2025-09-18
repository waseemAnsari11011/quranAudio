/* File: src/components/surah/SurahCard.jsx */
"use client";
import React from "react";
import { usePlayerStore } from "@/lib/store";

const SurahCard = ({ surah }) => {
  const { playFullSurah, currentReciterId, trackType } = usePlayerStore();

  if (!surah) return null;

  const handleClick = (e) => {
    e.preventDefault();
    // Play the surah directly when clicked
    playFullSurah(surah.number, currentReciterId, trackType);
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer block bg-gray-800 hover:bg-gray-700 p-4 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-700 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      <div className="flex items-center justify-between space-x-4">
        {/* Left Side: Surah Number */}
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-gray-700 transform rotate-45 rounded-xl">
            <span className="transform -rotate-45 text-white font-bold text-xl">
              {surah.number}
            </span>
          </div>
          {/* Middle: English Name and Translation */}
          <div>
            <p className="text-lg font-bold text-white group-hover:text-green-400 transition-colors">
              {surah.englishName}
            </p>
            <p className="text-sm text-gray-400">{surah.revelationType}</p>
          </div>
        </div>
        {/* Right Side: Arabic Name and Ayah Count */}
        <div className="text-right">
          <p
            className="text-2xl font-medium text-gray-200"
            style={{ fontFamily: "'Noto Naskh Arabic', serif" }}
          >
            {surah.name_arabic || surah.name}
          </p>
          <p className="text-sm text-gray-400">{surah.numberOfAyahs} Ayahs</p>
        </div>
      </div>
    </div>
  );
};

export default SurahCard;
