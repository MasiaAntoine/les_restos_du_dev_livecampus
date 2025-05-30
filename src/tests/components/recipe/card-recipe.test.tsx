import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest'
import RecipeCard from '../../../components/recipe/card-recipe'
import type { RecipeModel } from '@/models/Recipe.model.ts'

const mockRecipe: RecipeModel = {
  id: '1',
  title: 'Pâtes Carbonara',
  author: 'Chef John',
  cookTime: '30 min',
  imageUrl: '/images/carbonara.jpg',
  ingredients: [
    {
      ingredientId: '1',
      name: 'Pâtes',
      quantity: 500,
      unit: 'g',
    },
    {
      ingredientId: '2',
      name: 'Lardons',
      quantity: 200,
      unit: 'g',
    },
  ],
}

const handleDeleteRecipe = vi.fn()
const handleEditRecipe = vi.fn()

describe('RecipeCard Component avec showDetailsButton=false', () => {
  beforeEach(() => {
    render(
      <RecipeCard
        recipe={mockRecipe}
        onDelete={handleDeleteRecipe}
        onEdit={handleEditRecipe}
        showDetailsButton={false}
        isLoading={false}
      />
    )
  })

  afterEach(() => {
    cleanup()
  })

  describe('Auteur', () => {
    test("affiche le nom de l'auteur quand showDetailsButton est false", () => {
      expect(screen.getByTestId('recipe-author')).toBeInTheDocument()
    })
  })
})

describe('RecipeCard Component', () => {
  beforeEach(() => {
    render(
      <RecipeCard
        recipe={mockRecipe}
        onDelete={handleDeleteRecipe}
        onEdit={handleEditRecipe}
        showDetailsButton={true}
        isLoading={false}
      />
    )
  })

  afterEach(() => {
    cleanup()
  })

  describe('Titre', () => {
    test('affiche le titre de la recette', () => {
      expect(screen.getByTestId('recipe-title')).toBeInTheDocument()
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
      const moreButton = screen.getByTestId('recipe-more-button')
      fireEvent.click(moreButton)

      expect(screen.getByTestId('recipe-edit-button')).toBeInTheDocument()
      expect(screen.getByTestId('recipe-delete-button')).toBeInTheDocument()
    })

    test('appelle onDelete quand le bouton Supprimer est cliqué', () => {
      const moreButton = screen.getByTestId('recipe-more-button')
      fireEvent.click(moreButton)

      const deleteButton = screen.getByTestId('recipe-delete-button')
      fireEvent.click(deleteButton)

      expect(handleDeleteRecipe).toHaveBeenCalledWith(mockRecipe.id)
    })

    test("ouvre la boîte de dialogue d'édition quand le bouton Modifier est cliqué", () => {
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
      const moreButton = screen.getByTestId('recipe-more-button')
      fireEvent.click(moreButton)

      const editButton = screen.getByTestId('recipe-edit-button')
      fireEvent.click(editButton)

      // Vérifie que les ingrédients sont présents dans le formulaire
      mockRecipe.ingredients.forEach((_, index) => {
        expect(
          screen.getByTestId(`ingredient-name-select-${index}`)
        ).toBeInTheDocument()
      })
    })
  })
})
