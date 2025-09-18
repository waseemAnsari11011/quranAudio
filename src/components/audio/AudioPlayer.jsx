"use client";
import React, { useRef, useEffect, useState } from "react";
import { usePlayerStore } from "../../lib/store";
import { useAllSurahs } from "../../lib/hooks";
import { formatTime, cn } from "../../lib/utils";
import ReciterSelect from "./ReciterSelect.jsx";

// --- Icon Components ---
const PlayIcon = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.748 1.295 2.538 0 3.286L7.279 20.99c-1.25.72-2.779-.217-2.779-1.643V5.653z"
      clipRule="evenodd"
    />
  </svg>
);

const PauseIcon = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M6.75 5.25a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75zm9 0a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75z"
      clipRule="evenodd"
    />
  </svg>
);

const NextIcon = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M5.25 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.748 1.295 2.538 0 3.286L8.029 20.99c-1.25.72-2.779-.217-2.779-1.643V5.653zM15.75 5.25a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75z" />
  </svg>
);

const PrevIcon = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M18.75 5.653c0-1.426-1.529-2.33-2.779-1.643L4.429 10.66c-1.295.748-1.295 2.538 0 3.286l11.54 6.647c1.25.72 2.779-.217 2.779-1.643V5.653zM8.25 5.25a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75z" />
  </svg>
);

const AudioPlayer = () => {
  const audioRef = useRef(null);
  const positionRestoredRef = useRef(false);
  const {
    isPlaying,
    currentSurahId,
    currentReciterId,
    audioUrls,
    currentAudioIndex,
    progress,
    playFullSurah,
    togglePlay,
    setProgress,
    setInitialLoad,
    isInitialLoad,
    trackType,
    playNextVerse,
    playPrevVerse,
    isLoading,
  } = usePlayerStore();

  // Calculate current audio URL from the store state
  const audioUrl = audioUrls[currentAudioIndex] || null;

  const { surahs, loading: surahsLoading } = useAllSurahs();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Handle audio URL changes (when switching between verses or reciters)
  useEffect(() => {
    if (audioRef.current && audioUrl) {
      positionRestoredRef.current = false;
      audioRef.current.load(); // Reload the audio element with new URL
    }
  }, [audioUrl]);

  // Handle play/pause state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((e) => console.error("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioUrl]);

  // Handle initial load position restoration (from localStorage)
  useEffect(() => {
    if (isInitialLoad && audioRef.current && audioUrl && progress > 0) {
      const timer = setTimeout(() => {
        if (audioRef.current && !positionRestoredRef.current) {
          audioRef.current.currentTime = progress;
          setCurrentTime(progress);
          setInitialLoad(false);
          positionRestoredRef.current = true;
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isInitialLoad, audioUrl, progress, setInitialLoad]);

  // Handle position restoration when changing reciters or loading new audio
  useEffect(() => {
    if (
      audioRef.current &&
      audioUrl &&
      !isInitialLoad &&
      !positionRestoredRef.current
    ) {
      const handleCanPlay = () => {
        if (audioRef.current && progress > 0 && !positionRestoredRef.current) {
          // Ensure the position is within the duration of the new audio
          const maxTime = audioRef.current.duration || 0;
          const timeToSet = Math.min(progress, maxTime - 0.1); // Leave 0.1s buffer

          if (timeToSet > 0) {
            audioRef.current.currentTime = timeToSet;
            setCurrentTime(timeToSet);
          }

          positionRestoredRef.current = true;
        }
      };

      const handleLoadedData = () => {
        handleCanPlay();
      };

      const handleLoadedMetadata = () => {
        handleCanPlay();
      };

      // Add multiple event listeners to catch different loading states
      audioRef.current.addEventListener("loadeddata", handleLoadedData);
      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioRef.current.addEventListener("canplay", handleCanPlay);

      // Try immediately in case the audio is already loaded
      if (audioRef.current.readyState >= 2) {
        // HAVE_CURRENT_DATA or greater
        handleCanPlay();
      }

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("loadeddata", handleLoadedData);
          audioRef.current.removeEventListener(
            "loadedmetadata",
            handleLoadedMetadata
          );
          audioRef.current.removeEventListener("canplay", handleCanPlay);
        }
      };
    }
  }, [audioUrl, progress, isInitialLoad]);

  // Reset position restored flag when audio index changes (new verse)
  useEffect(() => {
    positionRestoredRef.current = false;
  }, [currentAudioIndex]);

  const handleAudioEnded = () => {
    // Try to play next verse first
    const hasNextVerse = playNextVerse();
    // If no next verse, try to play next surah
    if (!hasNextVerse) {
      playNextSurah();
    }
  };

  const playNextSurah = () => {
    if (surahsLoading || !currentSurahId) return;

    const currentIndex = surahs.findIndex((s) => s.number === currentSurahId);
    if (currentIndex > -1 && currentIndex < surahs.length - 1) {
      const nextSurah = surahs[currentIndex + 1];
      playFullSurah(nextSurah.number, currentReciterId, trackType);
    }
  };

  const playPrevSurah = () => {
    if (surahsLoading || !currentSurahId) return;

    const currentIndex = surahs.findIndex((s) => s.number === currentSurahId);
    if (currentIndex > 0) {
      const prevSurah = surahs[currentIndex - 1];
      playFullSurah(prevSurah.number, currentReciterId, trackType);
    }
  };

  const handleModeToggle = (newType) => {
    if (currentSurahId) {
      playFullSurah(currentSurahId, currentReciterId, newType);
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current && !isLoading) {
      const newTime = audioRef.current.currentTime;
      setCurrentTime(newTime);
      setProgress(newTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    if (audioRef.current) {
      const newTime = Number(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(newTime);
    }
  };

  const handleAudioError = (e) => {
    console.error("Audio error:", e);
    // You might want to show a user-friendly error message here
  };

  const getCurrentTrackDetails = () => {
    if (surahsLoading || !currentSurahId) return { surahName: "Loading..." };

    const surah = surahs.find((s) => s.number === currentSurahId);
    const verseInfo =
      audioUrls.length > 1
        ? ` (${currentAudioIndex + 1}/${audioUrls.length})`
        : "";

    return {
      surahName: surah
        ? `${surah.englishName || surah.name}${verseInfo}`
        : "Unknown Surah",
    };
  };

  const { surahName } = getCurrentTrackDetails();

  if (!audioUrl) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg">
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={handleAudioEnded}
          onError={handleAudioError}
          key={audioUrl}
          preload="metadata"
        />

        {/* Loading indicator when switching reciters */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Loading new reciter...
              </p>
            </div>
          </div>
        )}

        {/* Mobile Layout */}
        <div className="block md:hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1 mr-2">
              <p className="font-bold text-gray-900 dark:text-white text-sm truncate">
                {surahName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {trackType}
              </p>
            </div>
            <div className="flex items-center space-x-1 bg-gray-200 dark:bg-gray-800 p-1 rounded-full text-xs">
              <button
                onClick={() => handleModeToggle("recitation")}
                className={cn(
                  "px-2 py-1 font-semibold rounded-full transition-colors",
                  trackType === "recitation"
                    ? "bg-green-600 text-white"
                    : "text-gray-700 dark:text-gray-300"
                )}
                disabled={isLoading}
              >
                Recite
              </button>
              <button
                onClick={() => handleModeToggle("tafsir")}
                className={cn(
                  "px-2 py-1 font-semibold rounded-full transition-colors",
                  trackType === "tafsir"
                    ? "bg-green-600 text-white"
                    : "text-gray-700 dark:text-gray-300"
                )}
                disabled={isLoading}
              >
                Tafsir
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-2">
            <button
              onClick={() => {
                // Try previous verse first, then previous surah
                if (!playPrevVerse()) {
                  playPrevSurah();
                }
              }}
              className="text-gray-600 dark:text-gray-400 disabled:opacity-50"
              disabled={isLoading}
            >
              <PrevIcon className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-green-600 text-white disabled:opacity-50"
              disabled={isLoading}
            >
              {isPlaying ? (
                <PauseIcon className="w-6 h-6" />
              ) : (
                <PlayIcon className="w-6 h-6" />
              )}
            </button>

            <button
              onClick={() => {
                // Try next verse first, then next surah
                if (!playNextVerse()) {
                  playNextSurah();
                }
              }}
              className="text-gray-600 dark:text-gray-400 disabled:opacity-50"
              disabled={isLoading}
            >
              <NextIcon className="w-5 h-5" />
            </button>

            <div className="flex-1">
              <ReciterSelect />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              disabled={isLoading}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-4">
          {/* Track Info */}
          <div className="w-1/3">
            <p className="font-bold text-gray-900 dark:text-white truncate">
              {surahName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {trackType}
            </p>
          </div>

          {/* Player Controls */}
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => {
                  if (!playPrevVerse()) {
                    playPrevSurah();
                  }
                }}
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                <PrevIcon />
              </button>

              <button
                onClick={togglePlay}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900 disabled:opacity-50"
                disabled={isLoading}
              >
                {isPlaying ? (
                  <PauseIcon className="w-8 h-8" />
                ) : (
                  <PlayIcon className="w-8 h-8" />
                )}
              </button>

              <button
                onClick={() => {
                  if (!playNextVerse()) {
                    playNextSurah();
                  }
                }}
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                <NextIcon />
              </button>
            </div>

            <div className="w-full flex items-center space-x-2 mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer range-sm"
                disabled={isLoading}
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Right side controls */}
          <div className="w-1/3 flex justify-end items-center gap-4">
            <ReciterSelect />
            <div className="flex items-center space-x-1 bg-gray-200 dark:bg-gray-800 p-1 rounded-full">
              <button
                onClick={() => handleModeToggle("recitation")}
                className={cn(
                  "px-3 py-1 text-sm font-semibold rounded-full transition-colors",
                  trackType === "recitation"
                    ? "bg-green-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                )}
                disabled={isLoading}
              >
                Recitation
              </button>
              <button
                onClick={() => handleModeToggle("tafsir")}
                className={cn(
                  "px-3 py-1 text-sm font-semibold rounded-full transition-colors",
                  trackType === "tafsir"
                    ? "bg-green-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                )}
                disabled={isLoading}
              >
                Tafsir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
