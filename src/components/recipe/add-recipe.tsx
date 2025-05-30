'use client'

import { useContext, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { ServicesContext } from '@/contexts/contexts.tsx'
import type { RecipeModel } from '@/models/Recipe.model.ts'
import { v4 as uuid } from 'uuid'
import RecipeForm from './recipe-form'
import type { FormData } from '@/components/recipe/recipe-form.constants.ts'

export default function AddRecipeComponent({
  onRecipeAdd,
}: {
  onRecipeAdd: (recipe: RecipeModel) => void
}) {
  const services = useContext(ServicesContext)
  const currentUser = services?.currentUser
  const [open, setOpen] = useState(false)

  const handleSubmit = (values: FormData) => {
    console.log(
      'AddRecipe handleSubmit appelé avec:',
      JSON.stringify(values, null, 2)
    )
    const recipeId = uuid()
    try {
      const newRecipe: RecipeModel = {
        id: recipeId,
        title: values.name || 'Sans titre',
        cookTime: `${values.preparationTime || '0'} minutes`,
        author: currentUser?.displayName || 'Anonyme',
        imageUrl:
          'https://www.lunariarecruitment.co.uk/wp-content/uploads/sites/93/2013/11/dummy-image-square.jpg',
        ingredients: values.ingredients.map((ing) => ({
          ...ing,
          ingredientId: ing.ingredientId || '',
          name: ing.name || '',
          quantity: ing.quantity || 0,
          unit: ing.unit || '',
        })),
      }
      console.log(
        'Nouvelle recette (nettoyée):',
        JSON.stringify(newRecipe, null, 2)
      )
      onRecipeAdd(newRecipe)
      setOpen(false)
    } catch (error) {
      console.error('Erreur lors de la création de la recette:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4" data-testid="add-recipe-button">
          Créer une recette
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle recette</DialogTitle>
          <DialogDescription>
            Remplissez le formulaire pour ajouter une nouvelle recette.
          </DialogDescription>
        </DialogHeader>
        <RecipeForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}
