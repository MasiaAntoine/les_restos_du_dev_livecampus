import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, test, expect, vi } from 'vitest'
import type { Mock } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import LoginPage from '@/pages/login'
import { ServicesContext, type Services } from '@/contexts/contexts'
import { toast } from 'sonner'

// Définition du type pour les membres privés
type PrivateMembers = {
  '#firebaseService': unknown
  '#userService': unknown
  '#setcurrentUser': Mock
}

type MockedUserService = Omit<Services['userService'], '#firebaseService'> & {
  '#firebaseService'?: unknown
}

type MockedRecipesService = Omit<Services['recipesService'], '#fs'> & {
  '#fs'?: unknown
}

type MockedIngredientsService = Omit<Services['ingredientsService'], '#fs'> & {
  '#fs'?: unknown
}

type MockedAuthService = {
  [P in keyof Services['authService']]: Services['authService'][P] extends Function
    ? Mock
    : Services['authService'][P]
} & PrivateMembers

type MockServices = {
  authService: MockedAuthService
  userService: MockedUserService
  recipesService: MockedRecipesService
  ingredientsService: MockedIngredientsService
  currentUser: Services['currentUser']
}

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('LoginPage', () => {
  const setup = () => {
    const mockServices: MockServices = {
      authService: {
        signIn: vi.fn(),
        signOut: vi.fn(),
        register: vi.fn(),
        '#firebaseService': {},
        '#userService': {},
        '#setcurrentUser': vi.fn(),
      },
      userService: {
        getUserByUid: vi.fn(),
        createUser: vi.fn(),
      },
      recipesService: {
        getAllRecipes: vi.fn(),
        getRecipeById: vi.fn(),
        getRecipesByAuthor: vi.fn(),
        createRecipe: vi.fn(),
        updateRecipe: vi.fn(),
        deleteRecipe: vi.fn(),
      },
      ingredientsService: {
        getAllIngredients: vi.fn(),
        getIngredientById: vi.fn(),
      },
      currentUser: null,
    }

    return {
      mockServices,
      ...render(
        <ServicesContext.Provider value={mockServices as unknown as Services}>
          <BrowserRouter>
            <LoginPage />
          </BrowserRouter>
        </ServicesContext.Provider>
      ),
    }
  }

  test("devrait afficher des messages d'erreur lors de la soumission d'un formulaire vide", async () => {
    setup()
    const submitButton = screen.getByTestId('login-submit')
    const emailInput = screen.getByTestId('input-email')
    const passwordInput = screen.getByTestId('input-password')
    fireEvent.blur(emailInput)
    fireEvent.blur(passwordInput)
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(emailInput).toHaveAttribute(
        'data-error-email',
        'Veuillez entrer une adresse email valide.'
      )
      expect(passwordInput).toHaveAttribute(
        'data-error-password',
        'Le mot de passe doit contenir au moins 6 caractères.'
      )
    })
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

  test('devrait gérer une connexion réussie', async () => {
    const { mockServices } = setup()
    const emailInput = screen.getByTestId('input-email')
    const passwordInput = screen.getByTestId('input-password')
    const submitButton = screen.getByTestId('login-submit')

    ;(mockServices.authService.signIn as Mock).mockResolvedValueOnce({})
    ;(mockServices.recipesService.getAllRecipes as Mock).mockResolvedValueOnce(
      []
    )

    fireEvent.input(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.input(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockServices.authService.signIn).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      )
      expect(toast.success).toHaveBeenCalledWith('Connexion réussie')
    })
  })

  test('devrait gérer une erreur de connexion', async () => {
    const { mockServices } = setup()
    const emailInput = screen.getByTestId('input-email')
    const passwordInput = screen.getByTestId('input-password')
    const submitButton = screen.getByTestId('login-submit')

    mockServices.authService.signIn.mockRejectedValueOnce(
      new Error('Erreur de connexion')
    )
    mockServices.recipesService.getAllRecipes = vi
      .fn()
      .mockResolvedValueOnce([])

    fireEvent.input(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.input(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockServices.authService.signIn).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      )
      expect(toast.error).toHaveBeenCalledWith('Erreur lors de la connexion')
    })
  })

  test('ne devrait pas procéder si les services ne sont pas disponibles', async () => {
    vi.clearAllMocks()

    render(
      <ServicesContext.Provider value={null}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </ServicesContext.Provider>
    )

    const emailInput = screen.getByTestId('input-email')
    const passwordInput = screen.getByTestId('input-password')
    const submitButton = screen.getByTestId('login-submit')

    fireEvent.input(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.input(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(toast.success).not.toHaveBeenCalled()
      expect(toast.error).not.toHaveBeenCalled()
    })
  })
})
