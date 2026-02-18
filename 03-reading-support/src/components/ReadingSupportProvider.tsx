import React, { ReactNode } from 'react';
import { DyslexiaFontProvider } from './dyslexia-font/DyslexiaFontProvider';
import { ReadingPreferencesProvider } from './preferences/ReadingPreferencesProvider';
import { TTSProvider } from './tts/TTSProvider';

export const ReadingSupportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <DyslexiaFontProvider>
            <ReadingPreferencesProvider>
                <TTSProvider>
                    {children}
                </TTSProvider>
            </ReadingPreferencesProvider>
        </DyslexiaFontProvider>
    );
};
