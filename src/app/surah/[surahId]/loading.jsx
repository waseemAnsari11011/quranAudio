import React from "react";

// This is a Next.js convention for creating a loading UI for a specific route.
// This component will be automatically shown while the data for the SurahPage is loading.
export default function LoadingSurahPage() {
  return (
    <div className="animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white dark:bg-gray-800/50 rounded-lg p-6 mb-8">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      </div>

      {/* Verse List Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800/50 rounded-lg p-4"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-md mr-4"></div>
              <div className="flex-1 space-y-3">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
