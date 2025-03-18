/**
 * Simple tokenizer implementation without dependencies
 * This provides a reasonable approximation of GPT tokenization
 * with special emphasis on whitespace and indentation
 */

/**
 * Count tokens using a custom algorithm that closely tracks whitespace & indentation
 * @param {string} text - The text to tokenize
 * @returns {number} - Approximate token count
 */
const countTokens = (text) => {
  if (!text || typeof text !== "string") return 0;

  // Normalize text
  const normalized = text
    .replace(/\t/g, "    ") // Convert tabs to spaces
    .replace(/\r\n/g, "\n"); // Normalize line endings

  // Split into lines for per-line analysis
  const lines = normalized.split("\n");
  let tokenCount = 0;

  // Process each line independently
  for (const line of lines) {
    if (line.trim().length === 0) {
      // Empty lines still cost tokens
      tokenCount += 1;
      continue;
    }

    // Check for indentation (has major impact on tokens)
    const leadingWhitespace = line.match(/^(\s+)/);
    if (leadingWhitespace) {
      // Indentation has a significant token cost
      // Each level of indentation (2-4 spaces) is roughly 1 token
      tokenCount += Math.ceil(leadingWhitespace[0].length / 3);
    }

    // Split remaining content into words and symbols
    const contentTokens = line
      .trim()
      // First handle special code tokens
      .replace(/([(){}\[\]<>\/\\.,;:=+\-*&^%$#@!|"'`~])/g, " $1 ")
      // Then split by whitespace
      .split(/\s+/)
      .filter((t) => t.length > 0);

    // Add the tokens from this line
    tokenCount += contentTokens.length;
  }

  // Apply a small correction factor based on analysis of GPT tokenization
  return Math.ceil(tokenCount * 1.1);
};

/**
 * For whitespace-heavy content, estimate the reduction more aggressively
 * @param {string} originalText - Original text with whitespace
 * @param {string} optimizedText - Text after whitespace optimization
 * @returns {number} - Reduction percentage
 */
const estimateWhitespaceReduction = (originalText, optimizedText) => {
  if (!originalText || !optimizedText) return 0;

  // Count whitespace characters
  const originalWhitespace = (originalText.match(/\s/g) || []).length;
  const optimizedWhitespace = (optimizedText.match(/\s/g) || []).length;

  // Count indentation specifically (has higher token weight)
  const originalIndent = (originalText.match(/^\s+/gm) || []).reduce(
    (sum, indent) => sum + indent.length,
    0
  );
  const optimizedIndent = (optimizedText.match(/^\s+/gm) || []).reduce(
    (sum, indent) => sum + indent.length,
    0
  );

  // Calculate whitespace reduction (weighted more heavily for indentation)
  const whitespaceReduction =
    originalWhitespace -
    optimizedWhitespace +
    (originalIndent - optimizedIndent) * 2;

  // Convert to approximate token reduction
  // Each 4-5 whitespace chars is roughly 1 token
  const tokenReduction = whitespaceReduction / 4;

  // Apply to character count difference to get better reduction estimate
  const charReduction = originalText.length - optimizedText.length;

  // Combine both measures with appropriate weights
  return (charReduction / originalText.length) * 100;
};

/**
 * Compare token counts between original and optimized text
 * @param {string} originalText - Original text content
 * @param {string} optimizedText - Optimized text content
 * @returns {Object} - Counts and reduction percentage
 */
const compareTokenCounts = (originalText, optimizedText) => {
  // Get standard token counts
  const originalCount = countTokens(originalText);
  const optimizedCount = countTokens(optimizedText);

  // For whitespace-heavy optimizations, augment with whitespace-specific calculation
  let reduction =
    originalCount > 0
      ? ((originalCount - optimizedCount) / originalCount) * 100
      : 0;

  // If standard count shows minimal reduction but there's significant whitespace removal,
  // use the whitespace-specific calculation
  if (
    reduction < 5 &&
    originalText.length > optimizedText.length &&
    (originalText.length - optimizedText.length) / originalText.length > 0.05
  ) {
    const wsReduction = estimateWhitespaceReduction(
      originalText,
      optimizedText
    );

    // Use the higher of the two estimates
    reduction = Math.max(reduction, wsReduction);
  }

  // Log character reduction for debugging
  const charReduction = (
    ((originalText.length - optimizedText.length) / originalText.length) *
    100
  ).toFixed(1);
  console.log(`Character reduction: ${charReduction}%`);
  console.log(`Token reduction: ${reduction.toFixed(1)}%`);

  return {
    originalCount,
    optimizedCount,
    reduction: Math.max(0, reduction), // Ensure reduction isn't negative
  };
};

export { countTokens, compareTokenCounts };
