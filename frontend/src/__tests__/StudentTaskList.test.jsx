import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import StudentTaskList from '../pages/student/StudentTaskList.jsx'

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { name: 'student2', disability: 'adhd' } })
}))

const mockAssignments = [
  { _id: 'a1', title: 'reading1', description: 'desc1', sentences: ['x', 'y'], submissionStatus: 'in-progress' },
  { _id: 'a2', title: 'reading2', description: 'desc2', sentences: ['x'], submissionStatus: 'completed', completedAt: Date.now() },
]

const mockSubmissions = [
  { assignment: { _id: 'a2' }, timeSpent: 125, breaksTaken: 2 },
]

describe('StudentTaskList', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    global.fetch = vi.fn((url) => {
      if (url.includes('/api/assignments/my-assignments')) {
        return Promise.resolve({ json: () => Promise.resolve(mockAssignments) })
      }
      if (url.includes('/api/submissions/my-submissions')) {
        return Promise.resolve({ json: () => Promise.resolve(mockSubmissions) })
      }
      return Promise.resolve({ json: () => Promise.resolve({}) })
    })
  })

  it('shows stats and sections correctly', async () => {
    render(
      <MemoryRouter>
        <StudentTaskList />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getAllByText(/Pending/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/Completed/i).length).toBeGreaterThan(0)
    })

    expect(screen.getByText('👋 Hi, student2!')).toBeInTheDocument()
    expect(screen.getByText(/ADHD learning hub/i)).toBeInTheDocument()

    const pendingCard = screen.getAllByText('Pending')[0].closest('.stat-card')
    const completedCard = screen.getAllByText('Completed')[0].closest('.stat-card')
    const sentencesCard = screen.getAllByText('Sentences')[0].closest('.stat-card')
    const timeCard = screen.getAllByText('Time Spent')[0].closest('.stat-card')
    const breaksCard = screen.getAllByText('Breaks')[0].closest('.stat-card')

    await waitFor(() => {
      expect(pendingCard.querySelector('.stat-number').textContent.trim()).toBe('1')
      expect(completedCard.querySelector('.stat-number').textContent.trim()).toBe('1')
      expect(sentencesCard.querySelector('.stat-number').textContent.trim()).toBe('3')
      expect(timeCard.querySelector('.stat-number').textContent.trim()).toMatch(/2m/i)
      expect(breaksCard.querySelector('.stat-number').textContent.trim()).toBe('2')
    })

    // Completed section visible
    expect(screen.getByText(/Completed Activities/i)).toBeInTheDocument()
    expect(screen.getByText(/Read Again/i)).toBeInTheDocument()
  })
})
