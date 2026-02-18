import React, { useMemo } from 'react';
import { breakSentenceIntoSyllables } from '../../lib/utils/syllable-utils';

interface SyllableDisplayProps {
    text: string;
    enabled?: boolean;
    separator?: string;
    className?: string;
}

export const SyllableDisplay: React.FC<SyllableDisplayProps> = ({
    text,
    enabled = true,
    separator = '·',
    className = ''
}) => {
    const processedText = useMemo(() => {
        if (!enabled) return text;
        return breakSentenceIntoSyllables(text, separator);
    }, [text, enabled, separator]);

    return (
        <span className={`syllable-display ${className}`}>
            {processedText}
        </span>
    );
};
