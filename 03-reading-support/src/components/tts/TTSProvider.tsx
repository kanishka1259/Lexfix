import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TTSContextType {
    isSpeaking: boolean;
    speak: (text: string) => void;
    stop: () => void;
    pause: () => void;
    resume: () => void;
}

const TTSContext = createContext<TTSContextType | undefined>(undefined);

export const TTSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [synth, setSynth] = useState<SpeechSynthesis | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setSynth(window.speechSynthesis);
        }
    }, []);

    const speak = (text: string) => {
        if (!synth) return;
        synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        synth.speak(utterance);
    };

    const stop = () => {
        if (synth) {
            synth.cancel();
            setIsSpeaking(false);
        }
    };

    const pause = () => {
        if (synth) synth.pause();
    };

    const resume = () => {
        if (synth) synth.resume();
    };

    return (
        <TTSContext.Provider value={{ isSpeaking, speak, stop, pause, resume }}>
            {children}
        </TTSContext.Provider>
    );
};

export const useTTS = () => {
    const context = useContext(TTSContext);
    if (context === undefined) {
        throw new Error('useTTS must be used within a TTSProvider');
    }
    return context;
};
