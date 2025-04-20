# Vocabulary Mode

The Vocabulary mode is a special typing test mode that helps users practice typing words along with their definitions.

## How it Works

In Vocabulary mode:

1. Random words are selected from the WordNet database
2. Each word is paired with one of its definitions
3. The user types both the word and its definition, separated by a colon
4. Each test presents exactly 10 vocabulary words

## Implementation Details

- Words and definitions are fetched from the WordNet.js library
- Each vocabulary test consists of 10 words with definitions
- The format for each entry is: `word: definition`
- If a word cannot be fetched from WordNet (e.g., network issues), fallback text is provided
- No punctuation or number options are provided for this mode

## Adding Words

The words are randomly selected from the WordNet database. No configuration is needed from the user's side.

## Technical Notes

- The WordNet.js library is used to access a dictionary of words and definitions
- WordNet is initialized on demand when the user accesses the Vocabulary mode
- The implementation can handle cases where WordNet initialization fails
- Definitions are randomized if a word has multiple meanings

## Future Improvements

Potential future enhancements could include:
- Allowing users to specify word categories (e.g., nouns, verbs, etc.)
- Adding difficulty levels based on word complexity
- Creating a "practice difficult words" feature that saves challenging vocabulary 