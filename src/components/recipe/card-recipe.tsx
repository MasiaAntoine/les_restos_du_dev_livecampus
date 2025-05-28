import React from 'react'
import EditRecipe from './edit-recipe'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { Button } from '../ui/button'
import { MoreVertical, Clock, User, Trash2 } from 'lucide-react'
import type { RecipeModel } from '@/models/Recipe.model.ts'

interface RecipeCardProps {
  recipe: RecipeModel
  showDetailsButton?: boolean
  onDelete: (id: string) => void
  onEdit: (recipe: RecipeModel) => void
  isLoading?: boolean
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  showDetailsButton = false,
  onDelete,
  onEdit,
  isLoading = false,
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onDelete) {
      onDelete(recipe.id)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full rounded-lg overflow-hidden border bg-white shadow-lg animate-pulse">
        <div className="relative aspect-[4/3] w-full bg-gray-200" />
        <div className="p-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full rounded-lg overflow-hidden border bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative aspect-[4/3] w-full bg-gray-100">
        <img
          src={recipe.imageUrl}
          alt={`Recette: ${recipe.title}`}
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex items-center justify-between">
            <h3
              className="text-lg font-bold text-white truncate"
              data-testid="recipe-title"
            >
              {title}
            </h3>
            {showDetailsButton && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 bg-white/10 hover:bg-white/20 rounded-md"
                    data-testid="recipe-more-button"
                  >
                    <MoreVertical className="h-4 w-4 text-white" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2 select-none">
                  <div className="space-y-2">
                    <EditRecipe
                      recipe={recipe}
                      onRecipeEdit={onEdit}
                      className="w-full justify-start flex items-center gap-2 hover:text-blue-600"
                    />
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-500 hover:text-red-600 flex items-center gap-2"
                      onClick={handleDelete}
                      data-testid="recipe-delete-button"
                    >
                      <Trash2 className="h-4 w-4" />
                      Supprimer
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {recipe.cookTime}
            </span>
          </div>
          {!showDetailsButton && (
            <div className="flex items-center space-x-2">
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {recipe.author}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecipeCard
