import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TTSProvider, useTTS } from '../src/components/tts/TTSProvider';

// Mock SpeechSynthesis
const mockSpeak = vi.fn();
const mockCancel = vi.fn();
const mockPause = vi.fn();
const mockResume = vi.fn();

global.window.speechSynthesis = {
    speak: mockSpeak,
    cancel: mockCancel,
    pause: mockPause,
    resume: mockResume,
    getVoices: () => [],
};

global.SpeechSynthesisUtterance = vi.fn().mockImplementation((text) => ({
    text,
    onstart: null,
    onend: null,
    onerror: null,
}));

const TestComponent = () => {
    const { speak, stop, isSpeaking } = useTTS();
    return (
        <div>
            <div data-testid="status">{isSpeaking ? 'speaking' : 'idle'}</div>
            <button onClick={() => speak('Hello World')}>Speak</button>
            <button onClick={stop}>Stop</button>
        </div>
    );
};

describe('TTSProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('provides TTS functionality to children', () => {
        render(
            <TTSProvider>
                <TestComponent />
            </TTSProvider>
        );

        expect(screen.getByTestId('status')).toHaveTextContent('idle');
    });

    it('calls speechSynthesis.speak when speak is called', () => {
        render(
            <TTSProvider>
                <TestComponent />
            </TTSProvider>
        );

        fireEvent.click(screen.getByText('Speak'));

        expect(mockCancel).toHaveBeenCalled();
        expect(mockSpeak).toHaveBeenCalled();
    });

    it('calls speechSynthesis.cancel when stop is called', () => {
        render(
            <TTSProvider>
                <TestComponent />
            </TTSProvider>
        );

        fireEvent.click(screen.getByText('Stop'));

        expect(mockCancel).toHaveBeenCalled();
    });
});
