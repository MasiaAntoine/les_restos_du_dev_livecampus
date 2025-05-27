import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest'
import EditRecipe from '../components/recipe/edit-recipe'

const recipe = {
  id: 1,
  title: 'Pâtes Carbonara',
  cookTime: '30 min',
  ingredients: [
    {
      id: '1',
      name: 'Pâtes',
      quantity: 500,
      unit: 'g',
    },
    {
      id: '2',
      name: 'Lardons',
      quantity: 200,
      unit: 'g',
    },
  ],
}

describe('EditRecipe Component', () => {
  const mockOnRecipeEdit = vi.fn()

  beforeEach(() => {
    render(<EditRecipe recipe={recipe} onRecipeEdit={mockOnRecipeEdit} />)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Formulaire', () => {
    test('affiche le bouton Modifier', () => {
      expect(screen.getByTestId('recipe-edit-button')).toBeInTheDocument()
    })

    test('ouvre la boîte de dialogue au clic sur le bouton Modifier', () => {
      const editButton = screen.getByTestId('recipe-edit-button')
      fireEvent.click(editButton)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Modifier la recette')).toBeInTheDocument()
    })

    test('affiche les champs du formulaire avec les valeurs initiales', () => {
      const editButton = screen.getByTestId('recipe-edit-button')
      fireEvent.click(editButton)

      expect(screen.getByTestId('recipe-name-input')).toHaveValue(recipe.title)
      expect(screen.getByTestId('recipe-time-select')).toBeInTheDocument()
      expect(screen.getByText('Ingrédients')).toBeInTheDocument()
    })

    test("permet d'ajouter un nouvel ingrédient", () => {
      const editButton = screen.getByTestId('recipe-edit-button')
      fireEvent.click(editButton)

      const addButton = screen.getByTestId('add-ingredient-button')
      fireEvent.click(addButton)

      // Vérifie qu'un nouveau champ d'ingrédient est ajouté
      const ingredientFields = screen.getAllByTestId(
        /ingredient-name-select-\d+/
      )
      expect(ingredientFields.length).toBe(recipe.ingredients.length + 1)
    })

    test('permet de supprimer un ingrédient', () => {
      const editButton = screen.getByTestId('recipe-edit-button')
      fireEvent.click(editButton)

      const deleteButton = screen.getByTestId('remove-ingredient-button-0')
      fireEvent.click(deleteButton)

      // Vérifie qu'un ingrédient a été supprimé
      const ingredientFields = screen.getAllByTestId(
        /ingredient-name-select-\d+/
      )
      expect(ingredientFields.length).toBe(recipe.ingredients.length - 1)
    })

    // test('appelle onRecipeEdit avec les données mises à jour lors de la soumission', async () => {
    //   // Ouvre le formulaire
    //   const editButton = screen.getByTestId('recipe-edit-button')
    //   fireEvent.click(editButton)

    //   // Modifie les champs
    //   const nameInput = screen.getByTestId('recipe-name-input')
    //   fireEvent.change(nameInput, { target: { value: 'Nouvelle Recette' } })

    //   const timeSelect = screen.getByTestId('recipe-time-select')
    //   fireEvent.click(timeSelect)
    //   const timeOption = screen.getByTestId('time-option-15')
    //   fireEvent.click(timeOption)

    //   // Modifie un ingrédient
    //   const ingredientNameSelect = screen.getByTestId(
    //     'ingredient-name-select-0'
    //   )
    //   fireEvent.click(ingredientNameSelect)
    //   const ingredientOption = screen.getByTestId('ingredient-option-Farine')
    //   fireEvent.click(ingredientOption)

    //   const ingredientQuantityInput = screen.getByTestId(
    //     'ingredient-quantity-input-0'
    //   )
    //   fireEvent.change(ingredientQuantityInput, { target: { value: '300' } })

    //   const ingredientUnitSelect = screen.getByTestId(
    //     'ingredient-unit-select-0'
    //   )
    //   fireEvent.click(ingredientUnitSelect)
    //   const unitOption = screen.getByTestId('unit-option-kg')
    //   fireEvent.click(unitOption)

    //   // Soumet le formulaire
    //   const submitButton = screen.getByTestId('submit-edit-form')
    //   fireEvent.click(submitButton)

    //   expect(mockOnRecipeEdit).toHaveBeenCalledWith(recipe.id, {
    //     id: recipe.id,
    //     title: 'Nouvelle Recette',
    //     cookTime: '15 minutes',
    //     author: 'Utilisateur',
    //     imageUrl: 'https://via.placeholder.com/150',
    //     ingredients: [
    //       {
    //         id: expect.any(String),
    //         name: 'Farine',
    //         quantity: 300,
    //         unit: 'kg',
    //       },
    //     ],
    //   })
    // })
  })
})
