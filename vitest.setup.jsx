import React from 'react';
import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
    cleanup();
});

// Mocking icons with strings to avoid JSX parsing issues in the mock itself
vi.mock('lucide-react', () => ({
    Brain: () => 'Brain',
    Coffee: () => 'Coffee',
    Award: () => 'Award',
    Zap: () => 'Zap',
    ChevronRight: () => 'ChevronRight',
    BookOpen: () => 'BookOpen',
    Users: () => 'Users',
    BarChart: () => 'BarChart',
    Mic: () => 'Mic',
    Gamepad2: () => 'Gamepad2',
    Settings: () => 'Settings',
}));
