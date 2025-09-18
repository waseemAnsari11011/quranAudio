/* File: src/app/loading.jsx */
// quranaudio/src/app/loading.jsx

export default function Loading() {
  // This skeleton loader matches the structure of the SurahList and SurahCard components.
  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-48 mx-auto animate-pulse mb-4"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-md w-64 mx-auto animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800/50 p-4 rounded-lg shadow-sm animate-pulse"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            </div>
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-md mb-2"></div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
