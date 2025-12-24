import React from "react";

export default function Tile({ letter, status, reveal }) {
  const base =
    "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-2 border-gray-400 flex items-center justify-center font-bold text-xl sm:text-2xl md:text-3xl uppercase";

  let statusClass = "";
  if (status === "correct")
    statusClass = "bg-green-500 text-white border-green-500";
  if (status === "misplaced")
    statusClass = "bg-yellow-400 text-white border-yellow-400";
  if (status === "wrong")
    statusClass = "bg-gray-500 text-white border-gray-500";

  return (
    <div
      className={`${base} ${statusClass} ${
        reveal ? "animate-flip" : ""
      } transition-all duration-300`}
      aria-label={letter ? `${letter} ${status || "empty"}` : "empty"}
    >
      {letter || ""}
    </div>
  );
}
