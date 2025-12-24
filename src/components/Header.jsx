import React from "react";
import { RefreshCw, BarChart3, Sun, Moon } from "lucide-react";

export default function Header({ onReset, onOpenStats, mode, onToggleMode }) {
  return (
    <header className="flex flex-col sm:flex-row items-center sm:justify-between px-3 sm:px-4 py-3 border-b bg-white dark:bg-gray-800 shadow-sm">
      {/* Left section — title */}
      <div className="flex flex-col items-center sm:items-start mb-2 sm:mb-0">
        <h1 className="text-base sm:text-lg font-bold tracking-wide text-gray-900 dark:text-white">
          GUESS IT
        </h1>
        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Guess the word
        </span>
      </div>

      {/* Right section — controls */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Restart */}
        <button
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Restart Game"
          onClick={onReset}
        >
          <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 text-gray-900 dark:text-white" />
        </button>

        {/* Stats */}
        <button
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Show Stats"
          onClick={onOpenStats}
        >
          <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-900 dark:text-white" />
        </button>

        {/* Theme toggle */}
        <button
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Toggle Light/Dark"
          onClick={onToggleMode}
        >
          {mode === "light" ? (
            <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-900 dark:text-white" />
          ) : (
            <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-gray-900 dark:text-white" />
          )}
        </button>
      </div>
    </header>
  );
}
