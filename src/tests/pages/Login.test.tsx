import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, test, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import LoginPage from '@/pages/login'
import { ServicesContext } from '@/contexts/contexts'

describe('LoginPage', () => {
  const setup = () => {
    const mockServices = {
      authService: {
        signIn: vi.fn(),
      },
      userService: {},
      recipesService: {},
    }

    return {
      mockServices,
      ...render(
        <ServicesContext.Provider value={mockServices}>
          <BrowserRouter>
            <LoginPage />
          </BrowserRouter>
        </ServicesContext.Provider>
      ),
    }
  }

  test("devrait afficher des messages d'erreur lors de la soumission d'un formulaire vide", async () => {
    setup()
    const submitButton = screen.getByRole('button', { name: /se connecter/i })
    fireEvent.click(submitButton)

    expect(
      await screen.findByText(/Veuillez entrer une adresse email valide/i)
    ).toBeInTheDocument()
    expect(
      await screen.findByText(
        /Le mot de passe doit contenir au moins 6 caractères/i
      )
    ).toBeInTheDocument()
  })

  test("devrait basculer la visibilité du mot de passe lors du clic sur l'icône œil", () => {
    setup()
    const passwordInput = screen.getByPlaceholderText('••••••••')
    expect(passwordInput).toHaveAttribute('type', 'password')

    const toggleButton = screen.getByRole('button', { name: '' })
    fireEvent.click(toggleButton)

    expect(passwordInput).toHaveAttribute('type', 'text')

    fireEvent.click(toggleButton)

    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('email vide', async () => {
    setup()
    const emailInput = screen.getByTestId('input-email')
    const submitButton = screen.getByTestId('login-submit')

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
    const submitButton = screen.getByTestId('login-submit')

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
    const submitButton = screen.getByTestId('login-submit')

    fireEvent.blur(emailInput)
    fireEvent.click(submitButton)
    await waitFor(() => {
      expect(emailInput).toHaveAttribute('data-error-email', '')
    })
  })

  test('Le mot de passe doit contenir au moins 6 caractères', async () => {
    setup()
    const passwordInput = screen.getByTestId('input-password')
    const submitButton = screen.getByTestId('login-submit')

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
    const submitButton = screen.getByTestId('login-submit')

    fireEvent.input(passwordInput, { target: { value: '123456' } })
    fireEvent.blur(passwordInput)
    fireEvent.click(submitButton)
    await waitFor(() => {
      expect(passwordInput).toHaveAttribute('data-error-password', '')
    })
  })
})
