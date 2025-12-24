"use client";

import React, { useEffect } from "react";
import Header from "../components/Header";
import StatusBar from "../components/StatusBar";
import GameBoard from "../components/GameBoard";
import Keyboard from "../components/Keyboard";
import Footer from "../components/Footer";
import { useWordLogic } from "../hooks/useWordLogic";
import Rules from "../components/Rules";

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

export default function App() {
  const {
    guesses = [],
    currentGuess = "",
    status = "loading",
    letterStates = {},
    onKey = () => {},
    resetGame = () => {},
  } = useWordLogic();

  const attemptsLeft = MAX_ATTEMPTS - guesses.length;

  // ⌨️ Global keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key === "BACKSPACE" || key === "ENTER" || /^[A-Z]$/.test(key)) {
        e.preventDefault();
        onKey(key);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onKey]);

  // 📤 Generate shareable emoji grid
  const getShareText = () => {
    if (!guesses.length) return "";
    return guesses
      .map((g) =>
        g.result
          .map((r: string) =>
            r === "correct" ? "🟩" : r === "present" ? "🟨" : "⬛"
          )
          .join("")
      )
      .join("\n");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-50 transition-colors duration-300">
      {/* 🧱 Header */}
      <Header
        onReset={() => resetGame("random")}
        onOpenStats={() => alert("Stats modal coming soon!")}
        mode="light"
        onToggleMode={() => alert("Toggle mode")}
      />

      {/* 📊 Status Bar */}
      <div className="w-full max-w-md mt-4">
        <StatusBar
          status={status}
          attemptsLeft={attemptsLeft}
          timeLeft={undefined}
          message={undefined}
          onReset={() => resetGame("random")}
        />
      </div>

      {/* 🎯 Game Board */}
      <main className="flex-1 flex items-center justify-center w-full px-2 sm:px-4 mt-4">
        {status === "loading" ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 dark:border-gray-100"></div>
          </div>
        ) : (
          <GameBoard
            guesses={guesses}
            currentGuess={currentGuess}
            status={status}
            wordLength={WORD_LENGTH}
            maxAttempts={MAX_ATTEMPTS}
          />
        )}
      </main>

      {/* ⌨️ On-screen Keyboard */}
      <div className="w-full max-w-md mb-6 px-2">
        <Keyboard
          onKey={onKey as (key: string) => void}
          letterStates={letterStates}
        />
      </div>

      <Rules />

      {/* 📱 Footer */}
      <Footer getShareText={getShareText} />
    </div>
  );
}
