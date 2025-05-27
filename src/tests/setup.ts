import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Nettoie après chaque test
afterEach(() => {
  cleanup()
})
