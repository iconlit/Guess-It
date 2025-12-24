import React, { useState } from "react";
import Tile from "./Tile";

export default function Rules() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Button to open rules */}
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1 bg-blue-500 text-white rounded mb-2"
      >
        How to Play
      </button>

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-lg max-w-md w-full shadow-lg relative">
            <h2 className="text-xl font-bold mb-4">How to Play Wordle</h2>

            <p className="mb-2">
              Guess the <strong>5-letter word</strong> in 6 attempts.
            </p>

            <p className="mb-2">
              After each guess, the tiles will change color:
            </p>

            <div className="flex gap-1 mb-2">
              <Tile letter="W" status="correct" reveal />
              <Tile letter="O" />
              <Tile letter="R" />
              <Tile letter="D" />
              <Tile letter="S" />
            </div>
            <p className="mb-2">
              <strong>Green</strong> = Correct letter in correct spot
            </p>

            <div className="flex gap-1 mb-2">
              <Tile letter="W" />
              <Tile letter="O" status="misplaced" reveal />
              <Tile letter="R" />
              <Tile letter="D" />
              <Tile letter="S" />
            </div>
            <p className="mb-2">
              <strong>Yellow</strong> = Correct letter, wrong spot
            </p>

            <div className="flex gap-1 mb-4">
              <Tile letter="W" />
              <Tile letter="O" />
              <Tile letter="R" />
              <Tile letter="D" status="wrong" reveal />
              <Tile letter="S" />
            </div>
            <p className="mb-4">
              <strong>Gray</strong> = Letter not in the word
            </p>

            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
