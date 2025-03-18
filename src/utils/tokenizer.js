// First, you'll need to install the js-tiktoken library:
// npm install js-tiktoken

// Create a new file src/utils/tokenizer.js
import { get_encoding, encoding_for_model } from "js-tiktoken";

/**
 * Count tokens using OpenAI's tiktoken tokenizer
 * @param {string} text - The text to tokenize
 * @param {string} model - OpenAI model name (default: 'gpt-4o')
 * @returns {number} - Token count
 */
export const countTokens = (text, model = "gpt-4o") => {
  if (!text) return 0;

  try {
    // Get the encoding for the specified model
    const enc = encoding_for_model(model);

    // Encode the text and get token count
    const tokens = enc.encode(text);
    const count = tokens.length;

    // Free resources
    enc.free();

    return count;
  } catch (error) {
    console.error("Error counting tokens:", error);
    // Fallback to the base encoding if model-specific encoding fails
    try {
      const enc = get_encoding("cl100k_base"); // Base encoding used by most recent models
      const tokens = enc.encode(text);
      const count = tokens.length;
      enc.free();
      return count;
    } catch (fallbackError) {
      console.error("Fallback encoding failed:", fallbackError);
      // Last resort - use rough approximation
      return Math.ceil(text.length / 4);
    }
  }
};

/**
 * Get token counts for both original and optimized text
 * @param {string} originalText - Original text
 * @param {string} optimizedText - Optimized text
 * @returns {Object} - Token counts and reduction percentage
 */
export const compareTokenCounts = (originalText, optimizedText) => {
  const originalCount = countTokens(originalText);
  const optimizedCount = countTokens(optimizedText);

  const reduction =
    originalCount > 0
      ? ((originalCount - optimizedCount) / originalCount) * 100
      : 0;

  return {
    originalCount,
    optimizedCount,
    reduction,
  };
};
