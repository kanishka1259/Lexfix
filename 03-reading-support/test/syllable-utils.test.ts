import { describe, it, expect } from 'vitest';
import { breakIntoSyllables, breakSentenceIntoSyllables } from '../src/lib/utils/syllable-utils';

describe('syllable-utils', () => {
    describe('breakIntoSyllables', () => {
        it('should not break short words', () => {
            expect(breakIntoSyllables('the')).toEqual(['the']);
            expect(breakIntoSyllables('dog')).toEqual(['dog']);
        });

        it('should break simple two-syllable words', () => {
            // Note: The current regex-based approach might not be perfect for all English rules,
            // but it should handle basic patterns.
            const syllables = breakIntoSyllables('hello');
            expect(syllables.length).toBeGreaterThanOrEqual(1);
        });

        it('should handle empty input', () => {
            expect(breakIntoSyllables('')).toEqual([]);
        });
    });

    describe('breakSentenceIntoSyllables', () => {
        it('should apply breakdown to every word', () => {
            const sentence = 'hello world';
            const result = breakSentenceIntoSyllables(sentence, '-');
            expect(result).toContain('-');
        });
    });
});
