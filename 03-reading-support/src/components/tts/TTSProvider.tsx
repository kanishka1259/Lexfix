import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TTSContextType {
    isSpeaking: boolean;
    rate: number;
    pitch: number;
    setRate: (rate: number) => void;
    setPitch: (pitch: number) => void;
    speak: (text: string) => void;
    stop: () => void;
    pause: () => void;
    resume: () => void;
}

const TTSContext = createContext<TTSContextType | undefined>(undefined);

export const TTSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);
    const [synth, setSynth] = useState<SpeechSynthesis | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setSynth(window.speechSynthesis);
            const savedRate = localStorage.getItem('tts-rate');
            const savedPitch = localStorage.getItem('tts-pitch');
            if (savedRate) setRate(parseFloat(savedRate));
            if (savedPitch) setPitch(parseFloat(savedPitch));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('tts-rate', rate.toString());
        localStorage.setItem('tts-pitch', pitch.toString());
    }, [rate, pitch]);

    const speak = (text: string) => {
        if (!synth) return;
        synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.pitch = pitch;
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
        <TTSContext.Provider value={{ isSpeaking, rate, pitch, setRate, setPitch, speak, stop, pause, resume }}>
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
