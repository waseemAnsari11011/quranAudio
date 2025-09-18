// quranaudio/src/app/not-found.jsx
import Link from "next/link";
import { BookOpen, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full -mt-16">
      <BookOpen className="h-20 w-20 text-sky-400 mb-6" strokeWidth={1.5} />
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        The page you are looking for does not exist. It might have been moved or
        deleted.
      </p>
      <Link href="/">
        <span className="inline-flex items-center px-6 py-3 bg-sky-500 text-white font-semibold rounded-lg shadow-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors">
          <Home className="h-5 w-5 mr-2" />
          Return to Homepage
        </span>
      </Link>
    </div>
  );
}
