/**
 * Simple syllable breakdown utility for English.
 * This uses a basic regex-based approach for demonstration.
 */
export const breakIntoSyllables = (word: string): string[] => {
    if (!word) return [];
    if (word.length <= 3) return [word];

    // Basic regex for English syllables (vowel-consonant clusters)
    // This is a simplified version for Epic 3
    const syllableRegex = /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*(?=[aeiouy]))?/gi;
    const syllables = word.match(syllableRegex);

    if (!syllables) return [word];

    // Handle trailing consonants
    const matchedLength = syllables.join('').length;
    if (matchedLength < word.length) {
        syllables[syllables.length - 1] += word.substring(matchedLength);
    }

    return syllables;
};

/**
 * Breaks a full sentence into syllables, preserving spaces.
 */
export const breakSentenceIntoSyllables = (text: string, separator: string = '·'): string => {
    return text
        .split(/\s+/)
        .map(word => breakIntoSyllables(word).join(separator))
        .join(' ');
};
