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

  test('devrait valider correctement le champ email', async () => {
    setup()
    const emailInput = screen.getByPlaceholderText('john@example.com')
    const submitButton = screen.getByRole('button', { name: /se connecter/i })

    fireEvent.input(emailInput, { target: { value: '' } })
    fireEvent.blur(emailInput)
    fireEvent.click(submitButton)
    expect(
      await screen.findByText(/Veuillez entrer une adresse email valide/i)
    ).toBeInTheDocument()

    fireEvent.input(emailInput, { target: { value: 'emailinvalide' } })
    fireEvent.blur(emailInput)
    fireEvent.click(submitButton)
    expect(
      await screen.findByText(/Veuillez entrer une adresse email valide/i)
    ).toBeInTheDocument()

    fireEvent.input(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.blur(emailInput)
    await waitFor(() => {
      expect(
        screen.queryByText(/Veuillez entrer une adresse email valide/i)
      ).not.toBeInTheDocument()
    })
  })

  test('devrait valider correctement le champ mot de passe', async () => {
    setup()
    const passwordInput = screen.getByPlaceholderText('••••••••')
    const submitButton = screen.getByRole('button', { name: /se connecter/i })

    fireEvent.input(passwordInput, { target: { value: '' } })
    fireEvent.blur(passwordInput)
    fireEvent.click(submitButton)
    expect(
      await screen.findByText(
        /Le mot de passe doit contenir au moins 6 caractères/i
      )
    ).toBeInTheDocument()

    fireEvent.input(passwordInput, { target: { value: '12345' } })
    fireEvent.blur(passwordInput)
    fireEvent.click(submitButton)
    expect(
      await screen.findByText(
        /Le mot de passe doit contenir au moins 6 caractères/i
      )
    ).toBeInTheDocument()

    fireEvent.input(passwordInput, { target: { value: '123456' } })
    fireEvent.blur(passwordInput)
    await waitFor(() => {
      expect(
        screen.queryByText(
          /Le mot de passe doit contenir au moins 6 caractères/i
        )
      ).not.toBeInTheDocument()
    })
  })
})
