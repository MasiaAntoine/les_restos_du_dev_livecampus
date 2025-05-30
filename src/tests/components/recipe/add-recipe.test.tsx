import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AddRecipeComponent from '@/components/recipe/add-recipe'
import { ServicesContext } from '@/contexts/contexts'
import { AuthService } from '@/services/firebase/auth.service'
import { UserService } from '@/services/firebase/user.service'
import { FirebaseService } from '@/services/firebase/firebase.service'
import { IngredientsService } from '@/services/firebase/ingredients.service'
import { RecipesService } from '@/services/firebase/recipes.service'
import type { UserModel } from '@/models/User.model'

describe('AddRecipeComponent', () => {
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
  }

  const mockServices = {
    currentUser: mockCurrentUser,
    recipesService: mockRecipesService,
    authService: mockAuthService,
    userService: mockUserService,
    ingredientsService: mockIngredientsService,
  }

  const mockOnRecipeAdd = vi.fn()

  it('renders the add recipe button', () => {
    render(
      <ServicesContext.Provider value={mockServices}>
        <AddRecipeComponent onRecipeAdd={mockOnRecipeAdd} />
      </ServicesContext.Provider>
    )

    expect(screen.getByTestId('add-recipe-button')).toBeInTheDocument()
  })

  it('opens dialog when clicking the button', () => {
    render(
      <ServicesContext.Provider value={mockServices}>
        <AddRecipeComponent onRecipeAdd={mockOnRecipeAdd} />
      </ServicesContext.Provider>
    )

    fireEvent.click(screen.getByTestId('add-recipe-button'))
    expect(screen.getByText('Créer une nouvelle recette')).toBeInTheDocument()
  })

  it('calls onRecipeAdd with correct data when form is submitted', async () => {
    // Mock des ingrédients disponibles
    const mockIngredients = [
      { id: '1', name: 'Farine' },
      { id: '2', name: 'Sucre' },
      { id: '3', name: 'Beurre' },
    ]
    vi.spyOn(mockIngredientsService, 'getAllIngredients').mockResolvedValue(
      mockIngredients
    )

    render(
      <ServicesContext.Provider value={mockServices}>
        <AddRecipeComponent onRecipeAdd={mockOnRecipeAdd} />
      </ServicesContext.Provider>
    )

    // Ouvrir le dialog
    fireEvent.click(screen.getByTestId('add-recipe-button'))

    // Attendre que le formulaire soit chargé
    await waitFor(() => {
      expect(screen.getByTestId('recipe-name-input')).toBeInTheDocument()
    })

    // 1. Remplir le nom de la recette
    const nameInput = screen.getByTestId('recipe-name-input')
    fireEvent.change(nameInput, { target: { value: 'Tarte aux pommes' } })

    // 2. Sélectionner le temps de préparation
    const timeSelectTrigger = screen.getByTestId('recipe-time-select')
    fireEvent.click(timeSelectTrigger)
    const timeOption = screen.getByTestId('time-option-30')
    fireEvent.click(timeOption)

    // 3. Ajouter le premier ingrédient
    const addIngredientButton = screen.getByTestId('add-ingredient-button')
    fireEvent.click(addIngredientButton)

    // 4. Configurer le premier ingrédient
    // Sélectionner l'ingrédient
    const firstIngredientSelect = screen.getByTestId('ingredient-name-select-0')
    fireEvent.click(firstIngredientSelect)
    const firstIngredientOption = screen.getByTestId('ingredient-option-Farine')
    fireEvent.click(firstIngredientOption)

    // Définir la quantité
    const firstQuantityInput = screen.getByTestId('ingredient-quantity-input-0')
    fireEvent.change(firstQuantityInput, { target: { value: '250' } })

    // Sélectionner l'unité
    const firstUnitSelect = screen.getByTestId('ingredient-unit-select-0')
    fireEvent.click(firstUnitSelect)
    const firstUnitOption = screen.getByTestId('unit-option-g')
    fireEvent.click(firstUnitOption)

    // 5. Ajouter et configurer le deuxième ingrédient
    fireEvent.click(addIngredientButton)

    // Sélectionner l'ingrédient
    const secondIngredientSelect = screen.getByTestId(
      'ingredient-name-select-1'
    )
    fireEvent.click(secondIngredientSelect)
    const secondIngredientOption = screen.getByTestId('ingredient-option-Sucre')
    fireEvent.click(secondIngredientOption)

    // Définir la quantité
    const secondQuantityInput = screen.getByTestId(
      'ingredient-quantity-input-1'
    )
    fireEvent.change(secondQuantityInput, { target: { value: '100' } })

    // Sélectionner l'unité
    const secondUnitSelect = screen.getByTestId('ingredient-unit-select-1')
    fireEvent.click(secondUnitSelect)
    const secondUnitOption = screen.getByTestId('unit-option-g')
    fireEvent.click(secondUnitOption)

    // 6. Soumettre le formulaire
    const submitButton = screen.getByTestId('submit-edit-form')
    fireEvent.click(submitButton)

    // 7. Vérifier que onRecipeAdd a été appelé avec les bonnes données
    await waitFor(() => {
      expect(mockOnRecipeAdd).toHaveBeenCalledWith({
        title: 'Tarte aux pommes',
        author: 'Test User',
        cookTime: '30 minutes',
        id: expect.any(String),
        imageUrl:
          'https://www.lunariarecruitment.co.uk/wp-content/uploads/sites/93/2013/11/dummy-image-square.jpg',
        ingredients: [
          {
            ingredientId: '1',
            name: 'Farine',
            quantity: 250,
            unit: 'g',
          },
          {
            ingredientId: '2',
            name: 'Sucre',
            quantity: 100,
            unit: 'g',
          },
        ],
      })
    })
  })
})
