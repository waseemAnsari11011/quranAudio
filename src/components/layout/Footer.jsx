import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {currentYear} QuranAudio.in. All rights reserved.</p>
          <p className="mt-1">A humble effort to spread the word of Allah.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
