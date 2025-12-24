import { useEffect, useState, useCallback } from "react";
import { checkWord } from "@/utils/checkWord";
import { getRandomWord } from "@/utils/getRandomWord";
import { saveProgress, loadProgress, clearProgress } from "@/utils/storage";

/* ================= TYPES ================= */

export type LetterState = "correct" | "misplaced" | "wrong" | undefined;
export type GameStatus = "loading" | "playing" | "won" | "lost";

export interface Guess {
  word: string;
  result: string[];
}

interface ProgressData {
  target: string;
  guesses: Guess[];
  status: GameStatus;
}

export type OnKeyHandler = (key: string) => void;

interface UseWordLogicReturn {
  target: string;
  guesses: Guess[];
  currentGuess: string;
  status: GameStatus;
  letterStates: Record<string, LetterState>;
  onKey: OnKeyHandler;
  resetGame: (mode?: "random" | "daily") => Promise<void>;
  revealTarget: () => string;
}

/* ================= CONSTANTS ================= */

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

/* ================= HOOK ================= */

export function useWordLogic(): UseWordLogicReturn {
  const [target, setTarget] = useState("");
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [status, setStatus] = useState<GameStatus>("loading");
  const [letterStates, setLetterStates] = useState<Record<string, LetterState>>(
    {}
  );

  /* ========== INIT / LOAD ========== */
  useEffect(() => {
    async function init() {
      setStatus("loading");

      const saved = loadProgress<ProgressData>();
      if (saved?.target && saved.guesses) {
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

  /* ========== LETTER STATE PRIORITY ========== */
  const updateLetterStates = useCallback((guess: string, result: string[]) => {
    setLetterStates((prev) => {
      const next = { ...prev };

      const priority: Record<NonNullable<LetterState>, number> = {
        correct: 3,
        misplaced: 2,
        wrong: 1,
      };

      for (let i = 0; i < guess.length; i++) {
        const letter = guess[i];
        const newState = result[i] as LetterState;

        if (!newState) continue;

        const oldState = next[letter];
        if (!oldState || priority[newState] > priority[oldState]) {
          next[letter] = newState;
        }
      }

      return next;
    });
  }, []);

  /* ========== KEY HANDLER (FULLY TYPED) ========== */
  const onKey: OnKeyHandler = useCallback(
    (key) => {
      if (status !== "playing") return;

      if (key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1));
        return;
      }

      if (key === "ENTER") {
        if (currentGuess.length !== WORD_LENGTH) return;

        const result = checkWord(currentGuess, target);
        const nextGuesses = [...guesses, { word: currentGuess, result }];

        setGuesses(nextGuesses);
        updateLetterStates(currentGuess, result);

        if (currentGuess === target) {
          setStatus("won");
          saveProgress({ target, guesses: nextGuesses, status: "won" });
          return;
        }

        if (nextGuesses.length >= MAX_ATTEMPTS) {
          setStatus("lost");
          saveProgress({ target, guesses: nextGuesses, status: "lost" });
          return;
        }

        setCurrentGuess("");
        saveProgress({ target, guesses: nextGuesses, status: "playing" });
        return;
      }

      if (/^[A-Z]$/i.test(key) && currentGuess.length < WORD_LENGTH) {
        setCurrentGuess((prev) => prev + key.toUpperCase());
      }
    },
    [status, currentGuess, target, guesses, updateLetterStates]
  );

  /* ========== RESET GAME ========== */
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

  /* ========== DEBUG ========== */
  const revealTarget = useCallback(() => target, [target]);

  /* ========== RETURN ========== */
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
