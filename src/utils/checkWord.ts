import React from "react";

export type letterStatus = "correct" | "misplaced" | "wrong";

export function checkWord(guess: string, target: string): letterStatus[] {
  guess = guess.toUpperCase();
  target = target.toUpperCase();

  if (guess.length < 5 || target.length < 5) {
    throw new Error("please make sure you inputed 5 letters");
  }

  const result: letterStatus[] = Array(guess.length).fill("wrong");
  const targetLetters = target.split("");

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === target[i]) {
      result[i] = "correct";
      targetLetters[i] = "";
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (result[i] === "correct") continue;

    const index = targetLetters.indexOf(guess[i]);
    if (index !== -1) {
      result[i] = "misplaced";
      targetLetters[index] = "";
    }
  }

  return result;
}
