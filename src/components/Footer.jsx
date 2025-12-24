// src/components/Footer.jsx
import React from "react";

export default function Footer({ getShareText }) {
  const handleShare = async () => {
    const text = getShareText ? getShareText() : "";
    if (!text) return;

    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        alert("Copied result to clipboard!");
      } catch (err) {
        console.error("Clipboard write failed", err);
      }
    } else {
      alert("Sharing not supported in this browser.");
    }
  };

  return (
    <footer className="flex flex-col items-center justify-center py-3 text-xs text-gray-500 dark:text-gray-400 gap-1">
      <div>© 2025 SLYBOT GUESS IT</div>
      <div className="flex gap-2">
        {getShareText && (
          <button
            onClick={handleShare}
            className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-sm text-xs hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Share result
          </button>
        )}
        <a
          href="/privacy"
          className="hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy
        </a>
        <a
          href="/about"
          className="hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          About
        </a>
      </div>
    </footer>
  );
}
