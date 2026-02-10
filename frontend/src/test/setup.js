import { afterEach, vi, expect } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

// Cleanup DOM after each test
afterEach(() => {
  cleanup()
})

// Mock fetch by default; individual tests can override
if (!global.fetch) {
  global.fetch = vi.fn()
}

// Mock Web Speech API
if (!global.window.speechSynthesis) {
  global.window.speechSynthesis = {
    speak: vi.fn(),
    cancel: vi.fn(),
  }
}

if (!global.window.SpeechSynthesisUtterance) {
  global.window.SpeechSynthesisUtterance = function (text) {
    this.text = text
    this.rate = 1
    this.pitch = 1
    this.onend = () => {}
  }
}
