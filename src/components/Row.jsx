import React from "react";
import Tile from "./Tile";

export default function Row({
  guess = "",
  result = [],
  isActive = false,
  wordLength = 5,
}) {
  const letters = guess.toUpperCase().split("");
  // pad with empty tiles
  while (letters.length < wordLength) letters.push("");

  return (
    <div className="flex gap-1 sm:gap-2 md:gap-3 justify-center w-full max-w-[350px] mx-auto">
      {letters.map((letter, i) => (
        <Tile
          key={i}
          letter={letter}
          status={result[i]}
          reveal={!!result[i]} // flip animation if result exists
        />
      ))}
    </div>
  );
}
