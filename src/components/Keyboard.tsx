"use client";
import React from "react";

interface KeyboardProps {
  onKey: (key: string) => void;
  letterStates: Record<string, "correct" | "misplaced" | "wrong" | undefined>;
}

export default function Keyboard({ onKey, letterStates }: KeyboardProps) {
  const rows: string[][] = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
  ];

  const getKeyClass = (key: string) => {
    const state = letterStates[key];
    switch (state) {
      case "correct":
        return "bg-green-500 text-white";
      case "misplaced":
        return "bg-yellow-400 text-white";
      case "wrong":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-200 text-gray-900";
    }
  };

  const isWideKey = (key: string) => key === "ENTER" || key === "BACKSPACE";

  return (
    <div className="w-full max-w-[520px] mx-auto mt-4 flex flex-col gap-2 px-1 sm:px-2 select-none">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center gap-[0.3rem] sm:gap-2">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKey(key)}
              className={`
                flex items-center justify-center
                ${isWideKey(key) ? "flex-[1.5]" : "flex-1"}
                h-9 sm:h-11 md:h-12
                rounded-md font-bold
                text-[0.65rem] sm:text-sm md:text-base
                ${getKeyClass(key)}
                active:scale-95 transition
              `}
              aria-label={key}
            >
              {key === "BACKSPACE" ? "⌫" : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
