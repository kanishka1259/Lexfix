import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type FontSize = 'small' | 'medium' | 'large' | 'extra-large';
type LineHeight = 'normal' | 'relaxed' | 'loose';

interface ReadingPreferencesContextType {
    fontSize: FontSize;
    lineHeight: LineHeight;
    setFontSize: (size: FontSize) => void;
    setLineHeight: (height: LineHeight) => void;
}

const ReadingPreferencesContext = createContext<ReadingPreferencesContextType | undefined>(undefined);

const FONT_SIZE_MAP: Record<FontSize, string> = {
    'small': '14px',
    'medium': '16px',
    'large': '20px',
    'extra-large': '24px',
};

const LINE_HEIGHT_MAP: Record<LineHeight, string> = {
    'normal': '1.5',
    'relaxed': '1.8',
    'loose': '2.2',
};

export const ReadingPreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [fontSize, setFontSize] = useState<FontSize>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('reading-font-size') as FontSize) || 'medium';
        }
        return 'medium';
    });

    const [lineHeight, setLineHeight] = useState<LineHeight>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('reading-line-height') as LineHeight) || 'normal';
        }
        return 'normal';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('reading-font-size', fontSize);
            localStorage.setItem('reading-line-height', lineHeight);

            const root = document.documentElement;
            root.style.setProperty('--reading-font-size', FONT_SIZE_MAP[fontSize]);
            root.style.setProperty('--reading-line-height', LINE_HEIGHT_MAP[lineHeight]);
        }
    }, [fontSize, lineHeight]);

    return (
        <ReadingPreferencesContext.Provider value={{ fontSize, lineHeight, setFontSize, setLineHeight }}>
            <div style={{
                fontSize: FONT_SIZE_MAP[fontSize],
                lineHeight: LINE_HEIGHT_MAP[lineHeight],
                transition: 'font-size 0.2s, line-height 0.2s'
            }}>
                {children}
            </div>
        </ReadingPreferencesContext.Provider>
    );
};

export const useReadingPreferences = () => {
    const context = useContext(ReadingPreferencesContext);
    if (context === undefined) {
        throw new Error('useReadingPreferences must be used within a ReadingPreferencesProvider');
    }
    return context;
};
