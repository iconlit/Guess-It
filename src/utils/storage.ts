const PROGRESS_KEY = "guess-it_progress_v1";

export function saveProgress<T>(data: T): boolean {
  try {
    const json = JSON.stringify(data);
    localStorage.setItem(PROGRESS_KEY, json);
    return true;
  } catch (err) {
    console.error("failed to save progress:", err);
    return false;
  }
}

export function loadProgress<T>(): T | null {
  try {
    const json = localStorage.getItem(PROGRESS_KEY);
    if (!json) return null;
    return JSON.parse(json) as T;
  } catch (err) {
    console.error("failed to load progress", err);
    return null;
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(PROGRESS_KEY);
  } catch (err) {
    console.error("failed to clear progress", err);
  }
}
