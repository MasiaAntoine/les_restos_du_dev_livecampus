import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import RecipeComponent from '../../../components/recipe/recipe'
import { ServicesContext } from '@/contexts/contexts'
import { AuthService } from '@/services/firebase/auth.service'
import { UserService } from '@/services/firebase/user.service'
import { FirebaseService } from '@/services/firebase/firebase.service'
import { IngredientsService } from '@/services/firebase/ingredients.service'
import type { UserModel } from '@/models/User.model'
import type { RecipeModel } from '@/models/Recipe.model'
import type { RecipesService } from '@/services/firebase/recipes.service'

describe('RecipeComponent', () => {
  const mockRecipes: RecipeModel[] = [
    {
      id: '1',
      title: 'Test Recipe 1',
      cookTime: '30 minutes',
      author: 'Test User',
      imageUrl: 'test-url-1',
      ingredients: [],
    },
    {
      id: '2',
      title: 'Test Recipe 2',
      cookTime: '45 minutes',
      author: 'Test User',
      imageUrl: 'test-url-2',
      ingredients: [],
    },
  ]

  const mockFirebaseService = new FirebaseService()
  const mockUserService = new UserService(mockFirebaseService)
  const mockAuthService = new AuthService(
    mockFirebaseService,
    vi.fn(),
    mockUserService
  )
  const mockIngredientsService = new IngredientsService(mockFirebaseService)

  // Mock du RecipesService avec les méthodes nécessaires
  const mockRecipesService: Partial<RecipesService> = {
    getRecipesByAuthor: vi.fn().mockResolvedValue(mockRecipes),
    deleteRecipe: vi.fn().mockResolvedValue(undefined),
    createRecipe: vi.fn().mockResolvedValue(undefined),
    updateRecipe: vi.fn().mockResolvedValue(undefined),
    getAllRecipes: vi.fn().mockResolvedValue(mockRecipes),
    getRecipeById: vi.fn().mockResolvedValue(mockRecipes[0]),
  }

  const mockCurrentUser: UserModel = {
    uid: 'test-uid',
    email: 'test@example.com',
    displayName: 'Test User',
  }

  const mockServices = {
    currentUser: mockCurrentUser,
    recipesService: mockRecipesService as RecipesService,
    authService: mockAuthService,
    userService: mockUserService,
    ingredientsService: mockIngredientsService,
  }

  it('renders the recipe list title', () => {
    render(
      <ServicesContext.Provider value={mockServices}>
        <RecipeComponent />
      </ServicesContext.Provider>
    )

    expect(screen.getByText('Mes Recettes')).toBeInTheDocument()
  })

  it('loads and displays recipes', async () => {
    render(
      <ServicesContext.Provider value={mockServices}>
        <RecipeComponent />
      </ServicesContext.Provider>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Recipe 1')).toBeInTheDocument()
      expect(screen.getByText('Test Recipe 2')).toBeInTheDocument()
    })
  })

  it('shows loading state', () => {
    render(
      <ServicesContext.Provider value={mockServices}>
        <RecipeComponent />
      </ServicesContext.Provider>
    )

    // Vérifier que les cartes de chargement sont affichées
    const loadingCards = screen.getAllByTestId('loading-card')
    expect(loadingCards.length).toBeGreaterThan(0)
  })

  it('handles recipe deletion', async () => {
    render(
      <ServicesContext.Provider value={mockServices}>
        <RecipeComponent />
      </ServicesContext.Provider>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Recipe 1')).toBeInTheDocument()
    })

    // D'abord cliquer sur le bouton More
    const moreButton = screen.getAllByTestId('recipe-more-button')[0]
    fireEvent.click(moreButton)

    // Ensuite cliquer sur le bouton de suppression
    const deleteButton = screen.getAllByTestId('recipe-delete-button')[0]
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(mockRecipesService.deleteRecipe).toHaveBeenCalledWith('1')
    })
  })
})
