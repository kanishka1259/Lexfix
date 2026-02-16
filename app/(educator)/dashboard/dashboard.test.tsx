import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EducatorDashboard from './page';

import prisma from '../../../lib/prisma';

// Mock the prisma singleton from lib/prisma
vi.mock('../../../lib/prisma', () => ({
  default: {
    educatorStudent: {
      findMany: vi.fn().mockResolvedValue([
        { id: '1', studentId: 'student123', assignedAt: new Date(), competencyId: 'comp1' }
      ]),
    },
  },
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