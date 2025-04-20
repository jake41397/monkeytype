import Logger from "./logger";
import wordnet from "wordnet";

type WordNetDefinition = {
  glossary: string;
  [key: string]: unknown;
};

type WordDefinition = {
  word: string;
  definition: string;
};

// Use dynamic import to avoid issues if the module isn't installed
let initialized = false;
let wordList: string[] = [];

/**
 * Initialize WordNet database
 */
async function initWordNet(): Promise<boolean> {
  if (initialized) return true;

  try {
    // Initialize WordNet with default location
    await (wordnet as { init(): Promise<void> }).init();

    // Get all available words and cache them
    const result = await (wordnet as { list(): Promise<string[]> }).list();
    wordList = result;

    if (wordList.length === 0) {
      Logger.error("WordNet initialization failed: No words found in database");
      return false;
    }

    Logger.info(
      `WordNet initialized successfully with ${wordList.length} words`
    );
    initialized = true;
    return true;
  } catch (error) {
    Logger.error(`Failed to initialize WordNet: ${error}`);
    return false;
  }
}

/**
 * Get a random word with its complete definition from WordNet
 */
export async function getRandomWordFromWordNet(): Promise<WordDefinition | null> {
  try {
    if (!initialized) {
      const success = await initWordNet();
      if (!success) {
        return null;
      }
    }
    // Get a random word from the cached list
    const randomIndex = Math.floor(Math.random() * wordList.length);
    const randomWord = wordList[randomIndex];

    // Handle null/undefined/empty word cases
    if (
      randomWord === null ||
      randomWord === undefined ||
      randomWord === "" ||
      randomWord.length === 0
    ) {
      Logger.error("Got empty random word from WordNet");
      return null;
    }

    // Lookup the definition
    const definitions = await (
      wordnet as {
        lookup(word: string): Promise<WordNetDefinition[]>;
      }
    ).lookup(randomWord);

    if (Array.isArray(definitions) && definitions.length > 0) {
      // Use the first definition
      const def = definitions[0];

      // Ensure def exists and has glossary property
      if (def && typeof def.glossary === "string") {
        return {
          word: randomWord,
          // Return the full glossary without truncation
          definition: def.glossary,
        };
      }
    }

    return null;
  } catch (error) {
    Logger.error(`Error in getRandomWordFromWordNet: ${error}`);
    return null;
  }
}

export default {
  initWordNet,
  getRandomWordFromWordNet,
};
