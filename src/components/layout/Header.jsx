import React from "react";

const Header = () => {
  return (
    <header className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a
              href="/"
              className="text-2xl font-bold text-green-600 dark:text-green-500"
            >
              QuranAudio.in
            </a>
          </div>
          <div className="flex items-center space-x-4">
            {/* Future navigation links can go here */}
            {/* <a href="/about" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500 transition-colors">About</a> */}
            {/* <a href="/reciters" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500 transition-colors">Reciters</a> */}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
