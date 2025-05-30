import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ProfileComponent from '@/components/profile/profile'
import { ServicesContext } from '@/contexts/contexts'
import { AuthService } from '@/services/firebase/auth.service'
import { UserService } from '@/services/firebase/user.service'
import { FirebaseService } from '@/services/firebase/firebase.service'
import { IngredientsService } from '@/services/firebase/ingredients.service'
import { RecipesService } from '@/services/firebase/recipes.service'
import type { UserModel } from '@/models/User.model'
import { BrowserRouter } from 'react-router-dom'

// Mock de react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

// Mock de sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('ProfileComponent', () => {
  const mockFirebaseService = new FirebaseService()
  const mockUserService = new UserService(mockFirebaseService)
  const mockAuthService = new AuthService(
    mockFirebaseService,
    vi.fn(),
    mockUserService
  )
  const mockIngredientsService = new IngredientsService(mockFirebaseService)
  const mockRecipesService = new RecipesService(mockFirebaseService)

  const mockCurrentUser: UserModel = {
    uid: 'test-uid',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'https://example.com/photo.jpg',
  }

  const mockServices = {
    currentUser: mockCurrentUser,
    recipesService: mockRecipesService,
    authService: mockAuthService,
    userService: mockUserService,
    ingredientsService: mockIngredientsService,
  }

  const renderProfile = () => {
    return render(
      <BrowserRouter>
        <ServicesContext.Provider value={mockServices}>
          <ProfileComponent />
        </ServicesContext.Provider>
      </BrowserRouter>
    )
  }

  it("affiche les informations de l'utilisateur", () => {
    renderProfile()

    // Vérifier le nom d'utilisateur
    expect(screen.getByTestId('display-name')).toHaveTextContent('Test User')
    expect(screen.getByTestId('display-name-info')).toHaveTextContent(
      'Test User'
    )

    // Vérifier l'email
    expect(screen.getByTestId('email')).toHaveTextContent('test@example.com')
    expect(screen.getByTestId('email-info')).toHaveTextContent(
      'test@example.com'
    )

    // Vérifier l'avatar
    const avatar = screen.getByTestId('avatar')
    expect(avatar).toBeInTheDocument()
  })

  it('affiche les valeurs par défaut quand les informations sont manquantes', () => {
    const userWithoutInfo: UserModel = {
      uid: 'test-uid',
      email: '',
      displayName: '',
    }

    render(
      <BrowserRouter>
        <ServicesContext.Provider
          value={{
            ...mockServices,
            currentUser: userWithoutInfo,
          }}
        >
          <ProfileComponent />
        </ServicesContext.Provider>
      </BrowserRouter>
    )

    // Vérifier les valeurs par défaut
    expect(screen.getByTestId('display-name')).toHaveTextContent('Utilisateur')
    expect(screen.getByTestId('display-name-info')).toHaveTextContent(
      'Non défini'
    )
    expect(screen.getByTestId('email')).toHaveTextContent('')
    expect(screen.getByTestId('email-info')).toHaveTextContent('Non défini')
  })

  it('gère la déconnexion avec succès', async () => {
    const mockSignOut = vi.fn().mockResolvedValue(undefined)
    mockAuthService.signOut = mockSignOut

    renderProfile()

    // Cliquer sur le bouton de déconnexion
    const logoutButton = screen.getByTestId('logout-button')
    fireEvent.click(logoutButton)

    // Vérifier que signOut a été appelé
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled()
    })
  })

  it('gère les erreurs de déconnexion', async () => {
    const mockSignOut = vi
      .fn()
      .mockRejectedValue(new Error('Erreur de déconnexion'))
    mockAuthService.signOut = mockSignOut

    renderProfile()

    // Cliquer sur le bouton de déconnexion
    const logoutButton = screen.getByTestId('logout-button')
    fireEvent.click(logoutButton)

    // Vérifier que l'erreur est gérée
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled()
    })
  })
})
