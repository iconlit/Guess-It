import { useEffect, useState, useCallback } from "react";
import { checkWord } from "@/utils/checkWord";
import { getRandomWord } from "@/utils/getRandomWord";
import { saveProgress, loadProgress, clearProgress } from "@/utils/storage";

type LetterState = "correct" | "misplaced" | "wrong" | undefined;
type GameStatus = "loading" | "playing" | "won" | "lost";

interface Guess {
  word: string;
  result: string[];
}

interface ProgressData {
  target: string;
  guesses: Guess[];
  status: GameStatus;
}

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

export function useWordLogic() {
  const [target, setTarget] = useState<string>("");
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [status, setStatus] = useState<GameStatus>("loading");
  const [letterStates, setLetterStates] = useState<Record<string, LetterState>>(
    {}
  );

  useEffect(() => {
    async function init() {
      setStatus("loading");

      const saved = loadProgress<ProgressData>();
      if (saved && saved.target && saved.guesses) {
        setTarget(saved.target);
        setGuesses(saved.guesses);
        setStatus(saved.status ?? "playing");
      } else {
        const newTarget = await getRandomWord();
        setTarget(newTarget);
        setStatus("playing");
      }
    }
    init();
  }, []);

  const updateLetterStates = useCallback((guess: string, result: string[]) => {
    setLetterStates((prev) => {
      const next = { ...prev };
      const priority = {
        correct: 3,
        misplaced: 2,
        wrong: 1,
        undefined: 0,
      } as const;

      for (let i = 0; i < guess.length; i++) {
        const letter = guess[i];
        const newState = result[i] as LetterState;
        const oldState = next[letter];

        const newVal = priority[newState ?? "undefined"];
        const oldVal = priority[oldState ?? "undefined"];

        if (newVal > oldVal) {
          next[letter] = newState;
        }
      }
      return next;
    });
  }, []);

  const onKey = useCallback(
    (key: string) => {
      if (status !== "playing") return;

      if (key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1));
        return;
      }

      if (key === "ENTER") {
        if (currentGuess.length !== WORD_LENGTH) return; // ignore incomplete words

        const result = checkWord(currentGuess, target);
        const newGuesses = [...guesses, { word: currentGuess, result }];
        setGuesses(newGuesses);
        updateLetterStates(currentGuess, result);

        if (currentGuess.toUpperCase() === target.toUpperCase()) {
          setStatus("won");
          saveProgress({ target, guesses: newGuesses, status: "won" });
          return;
        }

        if (newGuesses.length >= MAX_ATTEMPTS) {
          setStatus("lost");
          saveProgress({ target, guesses: newGuesses, status: "lost" });
          return;
        }

        setCurrentGuess("");
        saveProgress({ target, guesses: newGuesses, status: "playing" });
        return;
      }

      if (/^[A-Z]$/i.test(key) && currentGuess.length < WORD_LENGTH) {
        setCurrentGuess((prev) => prev + key.toUpperCase());
      }
    },
    [status, currentGuess, target, guesses, updateLetterStates]
  );

  const resetGame = useCallback(async (mode: "random" | "daily" = "random") => {
    clearProgress();
    setGuesses([]);
    setCurrentGuess("");
    setLetterStates({});
    setStatus("loading");

    const newTarget =
      mode === "daily" ? await getRandomWord() : await getRandomWord();
    setTarget(newTarget);
    setStatus("playing");
  }, []);

  // --- Optional: reveal target for debug ---
  const revealTarget = useCallback(() => target, [target]);

  return {
    target,
    guesses,
    currentGuess,
    status,
    letterStates,
    onKey,
    resetGame,
    revealTarget,
  };
}
