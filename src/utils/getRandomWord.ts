const WORDS_URL = "/JSON/Words.json";

async function loadWords(): Promise<string[]> {
  try {
    const res = await fetch(WORDS_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const words = Array.isArray(data) ? data : data.words;
    if (!Array.isArray(words) || words.length === 0) {
      throw new Error("invalid or empty word list");
    }

    return words.map((w) => w.toUpperCase());
  } catch (err) {
    console.error("failed to load word:", err);
    return [];
  }
}

export async function getRandomWord(): Promise<string> {
  const words = await loadWords();
  if (words.length === 0) {
    throw new Error("no words available");
  }
  const index = Math.floor(Math.random() * words.length);
  return words[index];
}
