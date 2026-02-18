import React from 'react';
import { useDyslexiaFont } from '../../lib/hooks/useDyslexiaFont';

export const FontTestComponent: React.FC = () => {
    const { font, toggleFont } = useDyslexiaFont();

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Font Integration Test</h2>
            <p>Current Font: <strong>{font}</strong></p>
            <button
                onClick={toggleFont}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px'
                }}
            >
                Toggle Dyslexia Font
            </button>
            <div style={{ marginTop: '20px' }}>
                <p>This text will change font style when you click the button above.</p>
                <p>The OpenDyslexic font is designed to help readers with dyslexia by giving more weight to the bottom of the characters.</p>
            </div>
        </div>
    );
};
