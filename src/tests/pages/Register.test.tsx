import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, test, expect, vi } from 'vitest'
import type { Mock } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import RegisterPage from '@/pages/register'
import { ServicesContext, type Services } from '@/contexts/contexts'

type MockedClass<T> = {
  [P in keyof T]: T[P] extends Function ? Mock : T[P]
}

type MockServices = {
  authService: MockedClass<Services['authService']>
  userService: Services['userService']
  recipesService: Services['recipesService']
  ingredientsService: Services['ingredientsService']
  currentUser: Services['currentUser']
}

describe('RegisterPage', () => {
  const setup = () => {
    const mockServices = {
      authService: {
        register: vi.fn(),
        signOut: vi.fn(),
        signIn: vi.fn(),
        '#firebaseService': {},
        '#userService': {},
        '#setcurrentUser': vi.fn(),
      },
      userService: {},
      recipesService: {},
      ingredientsService: {},
      currentUser: null,
    } as unknown as MockServices

    return {
      mockServices,
      ...render(
        <ServicesContext.Provider value={mockServices as unknown as Services}>
          <BrowserRouter>
            <RegisterPage />
          </BrowserRouter>
        </ServicesContext.Provider>
      ),
    }
  }

  test("devrait afficher des messages d'erreur lors de la soumission d'un formulaire vide", async () => {
    setup()
    const submitButton = screen.getByTestId('register-submit')

    const usernameInput = screen.getByTestId('input-username')
    const emailInput = screen.getByTestId('input-email')
    const passwordInput = screen.getByTestId('input-password')
    const confirmPasswordInput = screen.getByTestId('input-confirm-password')

    fireEvent.blur(emailInput)
    fireEvent.blur(usernameInput)
    fireEvent.blur(passwordInput)
    fireEvent.blur(confirmPasswordInput)

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(emailInput).toHaveAttribute(
        'data-error-email',
        'Veuillez entrer une adresse email valide.'
      )
      expect(usernameInput).toHaveAttribute(
        'data-error-username',
        "Le nom d'utilisateur doit contenir au moins 2 caractères."
      )
      expect(passwordInput).toHaveAttribute(
        'data-error-password',
        'Le mot de passe doit contenir au moins 6 caractères.'
      )
      expect(confirmPasswordInput).toHaveAttribute(
        'data-error-confirm-password',
        ''
      )
    })
  })

  test('username invalide', async () => {
    setup()
    const submitButton = screen.getByTestId('register-submit')
    const usernameInput = screen.getByTestId('input-username')

    fireEvent.blur(usernameInput)
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(usernameInput).toHaveAttribute(
        'data-error-username',
        "Le nom d'utilisateur doit contenir au moins 2 caractères."
      )
    })
  })

  test('username valide', async () => {
    setup()
    const submitButton = screen.getByTestId('register-submit')
    const usernameInput = screen.getByTestId('input-username')

    fireEvent.change(usernameInput, { target: { value: 'validUsername' } })
    fireEvent.blur(usernameInput)
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(usernameInput).toHaveAttribute('data-error-username', '')
    })
  })

  test('email vide', async () => {
    setup()
    const emailInput = screen.getByTestId('input-email')
    const submitButton = screen.getByTestId('register-submit')

    fireEvent.click(submitButton)
    await waitFor(() => {
      expect(emailInput).toHaveAttribute(
        'data-error-email',
        'Veuillez entrer une adresse email valide.'
      )
    })
  })

  test('email invalide', async () => {
    setup()
    const emailInput = screen.getByTestId('input-email')
    const submitButton = screen.getByTestId('register-submit')

    fireEvent.input(emailInput, { target: { value: 'test@failed' } })
    fireEvent.blur(emailInput)
    fireEvent.click(submitButton)
    await waitFor(() => {
      expect(emailInput).toHaveAttribute(
        'data-error-email',
        'Veuillez entrer une adresse email valide.'
      )
    })
  })

  test('email valide', async () => {
    setup()
    const emailInput = screen.getByTestId('input-email')
    const submitButton = screen.getByTestId('register-submit')

    fireEvent.blur(emailInput)
    fireEvent.click(submitButton)
    await waitFor(() => {
      expect(emailInput).toHaveAttribute('data-error-email', '')
    })
  })

  test('Le mot de passe doit contenir au moins 6 caractères', async () => {
    setup()
    const passwordInput = screen.getByTestId('input-password')
    const submitButton = screen.getByTestId('register-submit')

    fireEvent.input(passwordInput, { target: { value: '' } })
    fireEvent.blur(passwordInput)
    fireEvent.click(submitButton)
    await waitFor(() => {
      expect(passwordInput).toHaveAttribute(
        'data-error-password',
        'Le mot de passe doit contenir au moins 6 caractères.'
      )
    })

    fireEvent.input(passwordInput, { target: { value: '12345' } })
    fireEvent.blur(passwordInput)
    fireEvent.click(submitButton)
    await waitFor(() => {
      expect(passwordInput).toHaveAttribute(
        'data-error-password',
        'Le mot de passe doit contenir au moins 6 caractères.'
      )
    })
  })

  test('devrait valider la correspondance des mots de passe', async () => {
    setup()
    const passwordInput = screen.getByTestId('input-password')
    const confirmPasswordInput = screen.getByTestId('input-confirm-password')
    const submitButton = screen.getByTestId('register-submit')

    fireEvent.input(passwordInput, { target: { value: '123456' } })
    fireEvent.input(confirmPasswordInput, { target: { value: '1234567' } })
    fireEvent.blur(confirmPasswordInput)
    fireEvent.click(submitButton)
    await waitFor(() => {
      expect(confirmPasswordInput).toHaveAttribute(
        'data-error-confirm-password',
        'Les mots de passe ne correspondent pas'
      )
    })

    fireEvent.input(passwordInput, { target: { value: '123456' } })
    fireEvent.input(confirmPasswordInput, { target: { value: '123456' } })
    fireEvent.blur(confirmPasswordInput)
    fireEvent.click(submitButton)
    await waitFor(() => {
      expect(confirmPasswordInput).toHaveAttribute(
        'data-error-confirm-password',
        ''
      )
    })
  })

  test('devrait gérer une inscription réussie', async () => {
    const { mockServices } = setup()
    const usernameInput = screen.getByTestId('input-username')
    const emailInput = screen.getByTestId('input-email')
    const passwordInput = screen.getByTestId('input-password')
    const confirmPasswordInput = screen.getByTestId('input-confirm-password')
    const submitButton = screen.getByTestId('register-submit')

    mockServices.authService.register.mockResolvedValueOnce({})

    // Remplir les champs
    fireEvent.input(usernameInput, { target: { value: 'testuser' } })
    fireEvent.input(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.input(passwordInput, { target: { value: 'password123' } })
    fireEvent.input(confirmPasswordInput, {
      target: { value: 'password123' },
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockServices.authService.register).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        'testuser'
      )
    })
  })
})
