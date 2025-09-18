import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { fetchFullSurahAudio } from "./api";

// Build audio URLs based on reciter and surah
const buildAudioUrls = async (reciterId, surahId, trackType) => {
  // Pass trackType to fetchFullSurahAudio
  return await fetchFullSurahAudio(reciterId, surahId, trackType);
};

export const usePlayerStore = create(
  persist(
    (set, get) => ({
      // State
      isPlaying: false,
      currentSurahId: null,
      currentReciterId: 7, // Default to Mishary Rashid Alafasy
      audioUrls: [], // Array of audio URLs for the current surah
      currentAudioIndex: 0, // Index of the currently playing audio file
      progress: 0,
      isInitialLoad: true,
      trackType: "recitation", // 'recitation' or 'tafsir'
      isLoading: false,

      // Actions
      playFullSurah: async (
        surahId,
        reciterId,
        trackType = "recitation",
        preservePosition = false
      ) => {
        const currentState = get();

        // If preservePosition is true, save current position
        const savedAudioIndex = preservePosition
          ? currentState.currentAudioIndex
          : 0;
        const savedProgress = preservePosition ? currentState.progress : 0;
        const wasPlaying = preservePosition ? currentState.isPlaying : false;

        // Set loading state immediately
        set({
          isLoading: true,
          isPlaying: false,
          currentSurahId: surahId,
          trackType,
          currentReciterId: reciterId,
          currentAudioIndex: savedAudioIndex,
          progress: savedProgress,
        });

        try {
          const urls = await buildAudioUrls(reciterId, surahId, trackType);
          console.log(`${trackType} urls for surah ${surahId}:`, urls);

          set({
            audioUrls: urls,
            isPlaying: preservePosition ? wasPlaying : true,
            isLoading: false,
          });
        } catch (error) {
          console.error(
            `Failed to play surah ${surahId} (${trackType}):`,
            error
          );
          set({
            audioUrls: [],
            isPlaying: false,
            isLoading: false,
          });
          throw error; // Re-throw to allow error handling in components
        }
      },

      // Play next verse/part in the current surah
      playNextVerse: () => {
        const { audioUrls, currentAudioIndex } = get();
        if (currentAudioIndex < audioUrls.length - 1) {
          set({
            currentAudioIndex: currentAudioIndex + 1,
            progress: 0,
            isPlaying: true,
          });
          return true; // Successfully moved to next verse/part
        }
        return false; // No more verses/parts
      },

      // Play previous verse/part in the current surah
      playPrevVerse: () => {
        const { currentAudioIndex } = get();
        if (currentAudioIndex > 0) {
          set({
            currentAudioIndex: currentAudioIndex - 1,
            progress: 0,
            isPlaying: true,
          });
          return true; // Successfully moved to previous verse/part
        }
        return false; // Already at first verse/part
      },

      togglePlay: () => {
        const { audioUrls, isLoading } = get();
        if (audioUrls.length === 0 || isLoading) return;
        set((state) => ({ isPlaying: !state.isPlaying }));
      },

      setCurrentReciterId: (reciterId) => {
        const {
          currentSurahId,
          trackType,
          currentReciterId: oldReciterId,
        } = get();

        // Only update if the reciter is actually changing
        if (reciterId === oldReciterId) return;

        set({ currentReciterId: reciterId });

        // If a surah is already playing and it's recitation mode,
        // fetch the new reciter's audio and preserve position
        if (currentSurahId && trackType === "recitation") {
          get().playFullSurah(currentSurahId, reciterId, trackType, true); // preservePosition = true
        }
      },

      pauseTrack: () => set({ isPlaying: false }),
      setProgress: (progress) => set({ progress }),
      setInitialLoad: (status) => set({ isInitialLoad: status }),

      clearPlayer: () => {
        set({
          isPlaying: false,
          currentSurahId: null,
          audioUrls: [],
          currentAudioIndex: 0,
          progress: 0,
          isLoading: false,
        });
      },
    }),
    {
      name: "quran-audio-player-storage",
      storage: createJSONStorage(() => {
        // Check if we're in the browser
        if (typeof window !== "undefined") {
          return localStorage;
        }
        // Return a no-op storage for server-side rendering
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({
        currentSurahId: state.currentSurahId,
        currentReciterId: state.currentReciterId,
        trackType: state.trackType,
        progress: state.progress,
        currentAudioIndex: state.currentAudioIndex,
      }), // Don't persist audioUrls as they can become stale
    }
  )
);
