import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import './OpenDyslexic.css';

type FontType = 'default' | 'opendyslexic';

interface DyslexiaFontContextType {
  font: FontType;
  setFont: (font: FontType) => void;
  toggleFont: () => void;
}

const DyslexiaFontContext = createContext<DyslexiaFontContextType | undefined>(undefined);

export const DyslexiaFontProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [font, setFont] = useState<FontType>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dyslexia-font');
      return (saved as FontType) || 'default';
    }
    return 'default';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dyslexia-font', font);
      if (font === 'opendyslexic') {
        document.body.classList.add('font-open-dyslexic');
      } else {
        document.body.classList.remove('font-open-dyslexic');
      }
    }
  }, [font]);

  const toggleFont = () => {
    setFont((prev) => (prev === 'default' ? 'opendyslexic' : 'default'));
  };

  return (
    <DyslexiaFontContext.Provider value={{ font, setFont, toggleFont }}>
      {children}
    </DyslexiaFontContext.Provider>
  );
};

export const useDyslexiaFontContext = () => {
  const context = useContext(DyslexiaFontContext);
  if (context === undefined) {
    throw new Error('useDyslexiaFontContext must be used within a DyslexiaFontProvider');
  }
  return context;
};
