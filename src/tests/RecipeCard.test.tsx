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
  ingredients: [],
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

    test('affiche un message dans la console quand Modifier est cliqué', () => {
      const consoleSpy = vi.spyOn(console, 'log')
      render(<RecipeCard {...recipe} showDetailsButton={true} />)

      const moreButton = screen.getByTestId('recipe-more-button')
      fireEvent.click(moreButton)

      const editButton = screen.getByTestId('recipe-edit-button')
      fireEvent.click(editButton)

      expect(consoleSpy).toHaveBeenCalledWith('Modifier la recette:', {
        title: recipe.title,
        author: recipe.author,
        cookTime: recipe.cookTime,
      })

      consoleSpy.mockRestore()
    })
  })

  // describe('Gestion des erreurs', () => {
  // test('affiche une image par défaut quand imageUrl est invalide', () => {
  //   render(<RecipeCard {...recipe} imageUrl="invalid-url" />)
  //   const images = screen.getAllByRole('img')
  //   const targetImage = images.find(
  //     (img) => img.getAttribute('src') === 'invalid-url'
  //   )
  //   expect(targetImage).toBeInTheDocument()
  //   expect(targetImage).toHaveAttribute(
  //     'alt',
  //     expect.stringMatching(/pâtes carbonara/i)
  //   )
  // })
  // })
})
