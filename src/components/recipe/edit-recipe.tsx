'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { Pencil } from 'lucide-react'
import type { RecipeModel } from '@/models/Recipe.model.ts'
import RecipeForm, { FormData } from './recipe-form'

interface EditRecipeProps {
  recipe: RecipeModel
  onRecipeEdit: (recipe: RecipeModel) => void
  className?: string
}

const EditRecipe: React.FC<EditRecipeProps> = ({
  recipe,
  onRecipeEdit,
  className,
}) => {
  const [open, setOpen] = useState(false)

  const defaultValues: FormData = {
    name: recipe.title,
    preparationTime: recipe.cookTime.split(' ')[0],
    ingredients: recipe.ingredients.map((ingredient) => ({
      ingredientId: ingredient.ingredientId,
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
    })),
  }

  const handleSubmit = (values: FormData) => {
    const updatedRecipe: RecipeModel = {
      ...recipe,
      title: values.name,
      cookTime: `${values.preparationTime} minutes`,
      ingredients: values.ingredients,
    }

    onRecipeEdit(updatedRecipe)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={className}
          data-testid="recipe-edit-button"
        >
          <Pencil className="h-4 w-4" />
          Modifier
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Modifier la recette</DialogTitle>
          <DialogDescription>
            Modifiez les informations de la recette.
          </DialogDescription>
        </DialogHeader>
        <RecipeForm onSubmit={handleSubmit} defaultValues={defaultValues} />
      </DialogContent>
    </Dialog>
  )
}

export default EditRecipe
