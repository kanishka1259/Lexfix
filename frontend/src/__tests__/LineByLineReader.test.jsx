import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import LineByLineReader from '../pages/student/LineByLineReader.jsx'

const assignment = {
  _id: 'a1',
  title: 'reading task',
  sentences: ['first', 'second']
}

describe('LineByLineReader', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    global.window.speechSynthesis.speak = vi.fn()
    global.fetch = vi.fn((url, opts) => {
      if (url.includes('/api/assignments/')) {
        return Promise.resolve({ json: () => Promise.resolve(assignment) })
      }
      if (url.includes('/api/submissions')) {
        return Promise.resolve({ json: () => Promise.resolve({ ok: true }) })
      }
      return Promise.resolve({ json: () => Promise.resolve({}) })
    })
  })

  const renderWithRoute = (id = 'a1') => {
    render(
      <MemoryRouter initialEntries={[`/student/read/${id}`]}>
        <Routes>
          <Route path="/student/read/:assignmentId" element={<LineByLineReader />} />
          <Route path="/student-dashboard" element={<div>student dashboard</div>} />
        </Routes>
      </MemoryRouter>
    )
  }

  it('loads assignment and speaks first sentence', async () => {
    renderWithRoute()
    expect(screen.getByText(/Loading/i)).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText(/reading task/i)).toBeInTheDocument())
    expect(screen.getByText('first')).toBeInTheDocument()
    // Auto speak when sentence changes
    expect(global.window.speechSynthesis.speak).toHaveBeenCalled()
  })

  it('advances and completes, navigating to dashboard', async () => {
    renderWithRoute()
    await waitFor(() => expect(screen.getByText('first')).toBeInTheDocument())
    // Next sentence
    screen.getByText(/Next Sentence/i).click()
    await waitFor(() => expect(screen.getByText('second')).toBeInTheDocument())
    // Finish
    screen.getByText(/I've finished reading/i).click()
    await waitFor(() => expect(screen.getByText(/student dashboard/i)).toBeInTheDocument())
  })
})
