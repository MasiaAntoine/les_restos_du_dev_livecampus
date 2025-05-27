import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import App from '../App'
import { FirebaseService } from '@/services/firebase/firebase.service.tsx'
import { AuthService } from '@/services/firebase/auth.service.tsx'
import { UserService } from '@/services/firebase/user.service.tsx'

// Mock des services Firebase
vi.mock('@/services/firebase/firebase.service.tsx', () => ({
  FirebaseService: vi.fn().mockImplementation(() => ({
    initialize: vi.fn(),
    getApp: vi.fn(),
  })),
}))

vi.mock('@/services/firebase/auth.service.tsx', () => ({
  AuthService: vi.fn().mockImplementation(() => ({
    signIn: vi.fn(),
    signOut: vi.fn(),
    getCurrentUser: vi.fn(),
  })),
}))

vi.mock('@/services/firebase/user.service.tsx', () => ({
  UserService: vi.fn().mockImplementation(() => ({
    getUser: vi.fn(),
    updateUser: vi.fn(),
  })),
}))

// Mock du Router
vi.mock('../router', () => ({
  default: () => <div>Router Content</div>,
}))

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("devrait se charger et afficher l'application", () => {
    // ARRANGE
    render(<App />)

    // ASSERT
    expect(document.body).toBeTruthy()
  })

  test('devrait initialiser les services Firebase', () => {
    // ARRANGE
    render(<App />)

    // ASSERT
    expect(FirebaseService).toHaveBeenCalledTimes(1)
    expect(AuthService).toHaveBeenCalledTimes(1)
    expect(UserService).toHaveBeenCalledTimes(1)
  })

  test('devrait fournir les services via le contexte', () => {
    // ARRANGE
    render(<App />)

    // ASSERT
    const contextProvider = screen.getByTestId('services-context')
    expect(contextProvider).toBeInTheDocument()
  })

  test('devrait maintenir les références des services entre les rendus', () => {
    // ARRANGE
    const { rerender } = render(<App />)
    const initialFirebaseService =
      vi.mocked(FirebaseService).mock.results[0].value
    const initialAuthService = vi.mocked(AuthService).mock.results[0].value
    const initialUserService = vi.mocked(UserService).mock.results[0].value

    // ACT
    rerender(<App />)

    // ASSERT
    expect(FirebaseService).toHaveBeenCalledTimes(1)
    expect(AuthService).toHaveBeenCalledTimes(1)
    expect(UserService).toHaveBeenCalledTimes(1)
    expect(vi.mocked(FirebaseService).mock.results[0].value).toBe(
      initialFirebaseService
    )
    expect(vi.mocked(AuthService).mock.results[0].value).toBe(
      initialAuthService
    )
    expect(vi.mocked(UserService).mock.results[0].value).toBe(
      initialUserService
    )
  })
})

test("charge et affiche l'application", () => {
  // ARRANGE
  render(<App />)

  // ASSERT
  expect(screen.getByTestId('services-context')).toBeInTheDocument()
})

test('affiche le contenu du router', () => {
  // ARRANGE
  render(<App />)

  // ASSERT
  expect(screen.getByText('Router Content')).toBeInTheDocument()
})
