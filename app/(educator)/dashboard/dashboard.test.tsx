import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EducatorDashboard from './page';

// Mocking Prisma to isolate the UI test
vi.mock('../../../src/generated/prisma/client', () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    educatorStudent: {
      findMany: vi.fn().mockResolvedValue([]),
    },
  })),
}));

describe('EducatorDashboard', () => {
  it('renders the dashboard title correctly', async () => {
    // Note: Next.js Server Components require specific handling in tests
    const Result = await EducatorDashboard();
    render(Result);
    
    expect(screen.getByText('Educator Overview')).toBeDefined();
  });

  it('complies with basic accessibility requirements', async () => {
    const Result = await EducatorDashboard();
    render(Result);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeDefined();
  });
});