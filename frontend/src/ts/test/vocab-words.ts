import * as Notifications from "../elements/notifications";

type WordDefinition = {
  word: string;
  definition: string;
};

// Backend API URL - Automatically detect if we're in development or production
const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");
const API_BASE_URL = isLocalhost ? "http://localhost:5005/vocab" : "/api/vocab";

export async function init(): Promise<void> {
  console.log("Vocabulary mode initialized, using API: " + API_BASE_URL);
}

export async function getRandomWordWithDefinition(): Promise<WordDefinition | null> {
  try {
    // Call backend API to get a random word with definition
    const response = await fetch(`${API_BASE_URL}/random`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch random word: ${response.status}`);
    }

    const data = (await response.json()) as WordDefinition;
    return data;
  } catch (e) {
    console.error("Error getting random word with definition", e);
    Notifications.add("Failed to get vocabulary word", -1);
    // Return a fallback word if the API fails
    return {
      word: "fallback",
      definition: "a word used when the vocabulary API is unavailable",
    };
  }
}

export async function getVocabWords(): Promise<string[]> {
  try {
    // Always get only 1 word for vocab mode tests to avoid repetition
    // Get a single random word with definition
    const wordDef = await getRandomWordWithDefinition();

    if (wordDef) {
      // Return the full word with its complete definition
      // Format it in a clean way for better readability when typing
      return [`${wordDef.word} - ${wordDef.definition}`];
    }

    throw new Error("Failed to get vocabulary words");
  } catch (e) {
    console.error("Error getting vocabulary words", e);
    Notifications.add("Failed to load vocabulary words", -1);

    // Fallback if API fails
    return ["vocabulary - a collection of words and their meanings"];
  }
}
