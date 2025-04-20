import { Request, Response } from "express";
import Logger from "../../utils/logger";
import * as wordnetUtils from "../../utils/wordnet";

type WordDefinition = {
  word: string;
  definition: string;
};

// Sample vocabulary for fallback - includes words from all letters of the alphabet
const fallbackVocabulary: WordDefinition[] = [
  // A
  { word: "abate", definition: "to reduce in amount, degree, or intensity" },
  { word: "aberrant", definition: "deviating from the usual or natural type" },
  // B
  {
    word: "benevolent",
    definition: "characterized by or expressing goodwill or kindly feelings",
  },
  {
    word: "brevity",
    definition: "concise and exact use of words in writing or speech",
  },
  // C
  { word: "cacophony", definition: "a harsh, discordant mixture of sounds" },
  { word: "cognizant", definition: "aware or having knowledge of something" },
  // D
  { word: "diligent", definition: "showing persistent and hardworking effort" },
  {
    word: "duality",
    definition: "an instance of opposition or contrast between two concepts",
  },
  // E
  { word: "ephemeral", definition: "lasting for a very short time" },
  {
    word: "eloquent",
    definition: "fluent or persuasive in speaking or writing",
  },
  // F
  {
    word: "fallacy",
    definition: "a mistaken belief, especially one based on unsound argument",
  },
  { word: "fortitude", definition: "courage in pain or adversity" },
  // G
  { word: "gratuitous", definition: "done without good reason; uncalled for" },
  { word: "gregarious", definition: "fond of company; sociable" },
  // H
  {
    word: "harbinger",
    definition:
      "a person or thing that announces or signals the approach of another",
  },
  {
    word: "hypothesis",
    definition:
      "a supposition or proposed explanation made on limited evidence",
  },
  // I
  { word: "imminent", definition: "about to happen" },
  { word: "incessant", definition: "continuing without pause or interruption" },
  // J
  {
    word: "juxtapose",
    definition: "to place or deal with close together for contrasting effect",
  },
  {
    word: "jubilant",
    definition: "feeling or expressing great happiness and triumph",
  },
  // K
  {
    word: "kaleidoscope",
    definition: "a constantly changing pattern or sequence of elements",
  },
  { word: "kinship", definition: "blood relationship or family connection" },
  // L
  {
    word: "lethargic",
    definition: "affected by lethargy; sluggish and apathetic",
  },
  { word: "luminous", definition: "giving off light; bright or shining" },
  // M
  {
    word: "meticulous",
    definition: "showing great attention to detail; very careful and precise",
  },
  { word: "mundane", definition: "lacking interest or excitement; dull" },
  // N
  { word: "nefarious", definition: "extremely wicked or villainous" },
  { word: "nostalgia", definition: "a sentimental longing for the past" },
  // O
  { word: "obsolete", definition: "no longer produced or used; out of date" },
  { word: "omniscient", definition: "knowing everything" },
  // P
  { word: "persistent", definition: "continuing firmly despite difficulty" },
  {
    word: "prudent",
    definition: "acting with or showing care and thought for the future",
  },
  // Q
  {
    word: "quintessential",
    definition: "representing the most perfect example of a quality",
  },
  {
    word: "quixotic",
    definition: "exceedingly idealistic; unrealistic and impractical",
  },
  // R
  {
    word: "resilient",
    definition:
      "able to withstand or recover quickly from difficult conditions",
  },
  { word: "ruminate", definition: "think deeply about something" },
  // S
  {
    word: "serendipity",
    definition:
      "the occurrence and development of events by chance in a happy or beneficial way",
  },
  {
    word: "superfluous",
    definition: "unnecessary, especially through being more than enough",
  },
  // T
  {
    word: "tenacious",
    definition:
      "tending to keep a firm hold of something; clinging or adhering closely",
  },
  {
    word: "transient",
    definition: "lasting only for a short time; impermanent",
  },
  // U
  { word: "ubiquitous", definition: "present, appearing, or found everywhere" },
  {
    word: "utilitarian",
    definition: "designed to be useful or practical rather than attractive",
  },
  // V
  { word: "verbose", definition: "using or containing more words than needed" },
  {
    word: "vicarious",
    definition:
      "experienced in the imagination through the feelings or actions of another person",
  },
  // W
  {
    word: "whimsical",
    definition:
      "playfully quaint or fanciful, especially in an appealing and amusing way",
  },
  {
    word: "wistful",
    definition: "having or showing a feeling of vague or regretful longing",
  },
  // X
  {
    word: "xenophobia",
    definition: "dislike of or prejudice against people from other countries",
  },
  {
    word: "xeric",
    definition: "characterized by or adapted to an extremely dry habitat",
  },
  // Y
  {
    word: "yearn",
    definition: "to long for something, typically something unattainable",
  },
  {
    word: "yielding",
    definition: "inclined to give way to pressure; not hard or rigid",
  },
  // Z
  {
    word: "zealous",
    definition:
      "having or showing great energy or enthusiasm in pursuit of an objective",
  },
  {
    word: "zenith",
    definition: "the highest point reached by a celestial or other object",
  },
];

/**
 * Get a random vocabulary word with definition from our fallback list
 */
function getRandomWordDefinition(): WordDefinition {
  // Ensure the array is not empty before accessing
  if (fallbackVocabulary.length === 0) {
    // Return a default word if the vocabulary list is empty
    return {
      word: "default",
      definition: "a standard word used when no vocabulary is available",
    };
  }

  // Use simple Math.random() for consistent behavior in both Node.js and browser
  const randomIndex = Math.floor(Math.random() * fallbackVocabulary.length);

  // Guarantee a return value even if randomIndex is out of bounds
  return (
    fallbackVocabulary[randomIndex] || {
      word: "fallback",
      definition: "a backup word used when vocabulary selection fails",
    }
  );
}

/**
 * Get a random vocabulary word with definition
 */
export async function getRandomWord(
  req: Request,
  res: Response
): Promise<void> {
  try {
    // First try to get a word from WordNet
    const wordNetResult = await wordnetUtils.getRandomWordFromWordNet();

    if (wordNetResult) {
      // If we successfully got a word from WordNet, return it
      res.json(wordNetResult);
    } else {
      // Fall back to our hard-coded vocabulary if WordNet fails
      Logger.warning(
        "WordNet failed to return a word, using fallback vocabulary"
      );
      const wordDef = getRandomWordDefinition();
      res.json(wordDef);
    }
  } catch (error) {
    Logger.error(`Error in getRandomWord: ${error}`);
    res.status(500).json({ message: "Failed to get random word" });
  }
}

/**
 * Get multiple vocabulary words with definitions
 */
export async function getVocabWords(
  req: Request,
  res: Response
): Promise<void> {
  try {
    // Use bracket notation to access the count parameter
    const countParam = req.query["count"] as string | undefined;
    // Handle the case when countParam is undefined, null, or empty string
    const count =
      countParam !== undefined && countParam !== null && countParam !== ""
        ? parseInt(countParam, 10)
        : 1; // Default to 1 instead of 10
    const limitedCount = Math.min(count, 50); // Limit to 50 words max

    const words: WordDefinition[] = [];

    for (let i = 0; i < limitedCount; i++) {
      // Try to get a word from WordNet first
      const wordNetResult = await wordnetUtils.getRandomWordFromWordNet();

      if (wordNetResult && !words.some((w) => w.word === wordNetResult.word)) {
        // If we got a unique word from WordNet, add it
        words.push(wordNetResult);
      } else {
        // If WordNet failed or returned a duplicate, use fallback
        let wordDef: WordDefinition;
        do {
          wordDef = getRandomWordDefinition();
        } while (words.some((w) => w.word === wordDef.word));

        words.push(wordDef);
      }
    }

    res.json(words);
  } catch (error) {
    Logger.error(`Error in getVocabWords: ${error}`);
    res.status(500).json({ message: "Failed to get vocabulary words" });
  }
}
