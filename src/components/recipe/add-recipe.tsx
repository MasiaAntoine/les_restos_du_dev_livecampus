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
import RecipeForm, { FormData } from './recipe-form'

export default function AddRecipeComponent({
  onRecipeAdd,
}: {
  onRecipeAdd: (recipe: RecipeModel) => void
}) {
  const services = useContext(ServicesContext)
  const currentUser = services?.currentUser
  const [open, setOpen] = useState(false)

  const handleSubmit = (values: FormData) => {
    console.log('AddRecipe handleSubmit appelé avec:', values)
    const recipeId = uuid()
    try {
      const newRecipe: RecipeModel = {
        id: recipeId,
        title: values.name,
        cookTime: `${values.preparationTime} minutes`,
        author: currentUser?.displayName || 'Anonyme',
        imageUrl: 'https://via.placeholder.com/150',
        ingredients: values.ingredients,
      }
      console.log('Nouvelle recette créée:', newRecipe)
      onRecipeAdd(newRecipe)
      setOpen(false)
    } catch (error) {
      console.error('Erreur lors de la création de la recette:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4">Créer une recette</Button>
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
