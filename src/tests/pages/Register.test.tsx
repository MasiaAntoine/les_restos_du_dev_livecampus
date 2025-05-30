import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, test, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import RegisterPage from '@/pages/register'
import { ServicesContext } from '@/contexts/contexts'
import { toast } from 'sonner'

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('RegisterPage', () => {
  const setup = () => {
    const mockServices = {
      authService: {
        register: vi.fn(),
      },
      userService: {},
      recipesService: {},
    }

    return {
      mockServices,
      ...render(
        <ServicesContext.Provider value={mockServices}>
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

  test('devrait valider correctement le champ mot de passe', async () => {
    setup()
    const passwordInput = screen.getByTestId('input-password')
    const submitButton = screen.getByTestId('register-submit')

    fireEvent.input(passwordInput, { target: { value: '123456' } })
    fireEvent.blur(passwordInput)
    fireEvent.click(submitButton)
    await waitFor(() => {
      expect(passwordInput).toHaveAttribute('data-error-password', '')
    })
  })
})
