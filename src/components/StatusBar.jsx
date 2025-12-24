import React from "react";

export default function StatusBar({
  status = "playing",
  attemptsLeft = 6,
  timeLeft,
  message,
  onReset = () => {},
}) {
  return (
    <div className="w-full flex justify-between items-center p-2 sm:p-4 bg-gray-200 dark:bg-gray-800 rounded-md mb-4">
      <div>
        Status: {status} | Attempts left: {attemptsLeft}
        {timeLeft !== undefined && <span> | Time: {timeLeft}s</span>}
      </div>
      {message && <div>{message}</div>}
      <button
        className="px-2 py-1 bg-gray-400 dark:bg-gray-600 rounded"
        onClick={onReset}
      >
        Reset
      </button>
    </div>
  );
}
