import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest'
import RecipeCard from '../components/recipe/card-recipe'

const recipe = {
  id: 1,
  title: 'Pâtes Carbonara',
  author: 'Chef John',
  cookTime: '30 min',
  imageUrl: '/images/carbonara.jpg',
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
  onDelete: vi.fn(),
  onEdit: vi.fn(),
}

describe('RecipeCard Component', () => {
  beforeEach(() => {
    render(<RecipeCard {...recipe} />)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Titre', () => {
    test('affiche le titre de la recette', () => {
      expect(screen.getByTestId('recipe-title')).toBeInTheDocument()
    })
  })

  describe('Auteur', () => {
    test("affiche le nom de l'auteur", () => {
      expect(screen.getByTestId('recipe-author')).toBeInTheDocument()
    })
  })

  describe('Temps de cuisson', () => {
    test('affiche le temps de cuisson', () => {
      expect(screen.getByTestId('recipe-cook-time')).toBeInTheDocument()
    })
  })

  describe('Image', () => {
    test("affiche l'image de la recette", () => {
      const img = screen.getByRole('img')
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('src', '/images/carbonara.jpg')
      expect(img).toHaveAttribute(
        'alt',
        expect.stringMatching(/pâtes carbonara/i)
      )
    })
  })

  describe("Boutons d'action", () => {
    test("n'affiche pas les boutons d'action par défaut", () => {
      expect(screen.queryByTestId('recipe-edit-button')).not.toBeInTheDocument()
      expect(
        screen.queryByTestId('recipe-delete-button')
      ).not.toBeInTheDocument()
    })

    test("affiche les boutons d'action quand showDetailsButton est true", () => {
      render(<RecipeCard {...recipe} showDetailsButton={true} />)
      const moreButton = screen.getByTestId('recipe-more-button')
      fireEvent.click(moreButton)

      expect(screen.getByTestId('recipe-edit-button')).toBeInTheDocument()
      expect(screen.getByTestId('recipe-delete-button')).toBeInTheDocument()
    })

    test('appelle onDelete quand le bouton Supprimer est cliqué', () => {
      const handleDelete = vi.fn()
      render(
        <RecipeCard
          {...recipe}
          showDetailsButton={true}
          onDelete={handleDelete}
        />
      )

      const moreButton = screen.getByTestId('recipe-more-button')
      fireEvent.click(moreButton)

      const deleteButton = screen.getByTestId('recipe-delete-button')
      fireEvent.click(deleteButton)

      expect(handleDelete).toHaveBeenCalledWith(recipe.id)
    })

    test("ouvre la boîte de dialogue d'édition quand le bouton Modifier est cliqué", () => {
      render(<RecipeCard {...recipe} showDetailsButton={true} />)

      const moreButton = screen.getByTestId('recipe-more-button')
      fireEvent.click(moreButton)

      const editButton = screen.getByTestId('recipe-edit-button')
      fireEvent.click(editButton)

      // Vérifie que la boîte de dialogue est ouverte
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Modifier la recette')).toBeInTheDocument()
    })
  })

  describe('Gestion des ingrédients', () => {
    test('passe les ingrédients au composant EditRecipe', () => {
      render(<RecipeCard {...recipe} showDetailsButton={true} />)

      const moreButton = screen.getByTestId('recipe-more-button')
      fireEvent.click(moreButton)

      const editButton = screen.getByTestId('recipe-edit-button')
      fireEvent.click(editButton)

      // Vérifie que les ingrédients sont présents dans le formulaire
      recipe.ingredients.forEach((_, index) => {
        expect(
          screen.getByTestId(`ingredient-name-select-${index}`)
        ).toBeInTheDocument()
      })
    })

    // test('appelle onEdit avec les ingrédients mis à jour', () => {
    //   const handleEdit = vi.fn()
    //   render(
    //     <RecipeCard {...recipe} showDetailsButton={true} onEdit={handleEdit} />
    //   )

    //   const moreButton = screen.getByTestId('recipe-more-button')
    //   fireEvent.click(moreButton)

    //   const editButton = screen.getByTestId('recipe-edit-button')
    //   fireEvent.click(editButton)

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

    //   expect(handleEdit).toHaveBeenCalledWith(
    //     recipe.id,
    //     expect.objectContaining({
    //       id: recipe.id,
    //       title: recipe.title,
    //       cookTime: expect.stringMatching(/\d+ minutes/),
    //       author: 'Utilisateur',
    //       imageUrl: 'https://via.placeholder.com/150',
    //       ingredients: expect.arrayContaining([
    //         expect.objectContaining({
    //           id: expect.any(String),
    //           name: 'Farine',
    //           quantity: 300,
    //           unit: 'kg',
    //         }),
    //       ]),
    //     })
    //   )
    // })
  })
})
