# 03-Reading-Support

**Owner:** Member C
**Epic:** Epic 3 (Dyslexia-Friendly Reading Support)

## Responsibilities

- Dyslexia Font Integrations
- Text-to-Speech (TTS) Components
- Syllable Breakdown Logic
- Reading Preference Settings

## Usage

### 1. Setup Provider
Wrap your application with the `ReadingSupportProvider`:

```tsx
import { ReadingSupportProvider } from './src/components/ReadingSupportProvider';

function App() {
  return (
    <ReadingSupportProvider>
      <MainContent />
    </ReadingSupportProvider>
  );
}
```

### 2. Reading Settings
Add the `ReadingSettings` component to your settings page:

```tsx
import { ReadingSettings } from './src/components/preferences/ReadingSettings';
```

### 3. Syllable Breakdown
Use the `SyllableDisplay` component to enhance readability:

```tsx
import { SyllableDisplay } from './src/components/test/SyllableDisplay';

<SyllableDisplay text="Information Processing" enabled={true} />
```
