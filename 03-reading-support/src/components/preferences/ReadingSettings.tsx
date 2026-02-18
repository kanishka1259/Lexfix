import React from 'react';
import { useReadingPreferences } from './ReadingPreferencesProvider';

export const ReadingSettings: React.FC = () => {
    const { fontSize, setFontSize, lineHeight, setLineHeight } = useReadingPreferences();

    return (
        <div style={{ padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
            <h3>Reading Settings</h3>

            <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Font Size:</label>
                <select
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value as any)}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
                >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="extra-large">Extra Large</option>
                </select>
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Line Spacing:</label>
                <select
                    value={lineHeight}
                    onChange={(e) => setLineHeight(e.target.value as any)}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
                >
                    <option value="normal">Normal</option>
                    <option value="relaxed">Relaxed</option>
                    <option value="loose">Loose</option>
                </select>
            </div>
        </div>
    );
};
