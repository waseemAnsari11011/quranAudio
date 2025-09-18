/* File: src/lib/utils.js */
/**
 * @file utils.js
 * @description Utility functions for general-purpose tasks.
 */

/**
 * Formats a given number of seconds into a MM:SS time string.
 * @param {number} seconds - The total seconds.
 * @returns {string} The formatted time string (e.g., "05:21").
 */
export const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};

/**
 * A simple utility to conditionally join class names.
 * Useful for building dynamic class strings in components.
 * @param  {...any} classes - A list of classes (strings, booleans). Falsy values are ignored.
 * @returns {string} A single string of joined class names.
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};
