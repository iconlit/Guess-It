import { useState, useEffect, useRef, useCallback } from "react";
import { useWordLogic } from "./useWordLogic";

interface UseTimerOptions {
  initialSeconds?: number;
  onExpire?: () => void;
  mode?: "countdown" | "stopwatch";
}

export default function useTimer({
  initialSeconds = 60,
  onExpire,
  mode = "countdown",
}: UseTimerOptions = {}) {
  const [timer, setTimer] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    lastTickRef.current = Date.now();
  }, [isRunning]);

  const pause = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(
    (newTime: number = initialSeconds) => {
      pause();
      setTimer(newTime);
    },
    [pause, initialSeconds]
  );

  const stop = useCallback(() => {
    pause();
    setTimer(initialSeconds);
  }, [pause, initialSeconds]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const last = lastTickRef.current ?? now;
      const delta = Math.floor((now - last) / 1000); // seconds passed
      if (delta <= 0) return;
      lastTickRef.current = now;

      setTimer((prev) => {
        const next = mode === "countdown" ? prev - delta : prev + delta;
        if (mode === "countdown" && next <= 0) {
          pause();
          onExpire?.();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode, pause, onExpire]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    timeLeft: mode === "countdown" ? timer : undefined,
    elapsed: mode === "stopwatch" ? timer : undefined,
    isRunning,
    start,
    pause,
    reset,
    stop,
  };
}
