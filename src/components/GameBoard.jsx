import React from "react";
import Row from "./Row";

export default function GameBoard({
  guesses = [],
  currentGuess = "",
  status = "playing",
  wordLength = 5,
  maxAttempts = 6,
}) {
  return (
    <div
      className="flex flex-col gap-1 sm:gap-2 md:gap-3 items-center justify-center mt-4 w-full max-w-[400px] mx-auto"
      role="grid"
      aria-label="Wordle game board"
    >
      {Array.from({ length: maxAttempts }).map((_, i) => {
        if (i < guesses.length) {
          const guess = guesses[i];
          return (
            <Row
              key={i}
              guess={guess.word}
              result={guess.result}
              wordLength={wordLength}
            />
          );
        }

        if (i === guesses.length && status === "playing") {
          return (
            <Row
              key={i}
              guess={currentGuess}
              isActive
              wordLength={wordLength}
            />
          );
        }

        // empty row
        return <Row key={i} wordLength={wordLength} />;
      })}
    </div>
  );
}
