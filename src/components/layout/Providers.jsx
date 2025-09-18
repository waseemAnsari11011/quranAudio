/* File: src/components/layout/Providers.jsx */
"use client";

import AudioPlayer from "../audio/AudioPlayer";

export function Providers({ children }) {
  return (
    <>
      {children}
      <AudioPlayer />
      {/* This div acts as a spacer to prevent the audio player from overlapping content */}
      <div className="h-24 md:h-20"></div>
    </>
  );
}
