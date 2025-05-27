import React from 'react'
import EditRecipe from './edit-recipe'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { Button } from '../ui/button'
import { MoreVertical } from 'lucide-react'
import type { RecipeModel } from '@/models/Recipe.model.ts'

interface RecipeCardProps {
  recipe: RecipeModel
  showDetailsButton?: boolean
  onDelete: (id: string) => void
  onEdit: (updatedRecipe: RecipeModel) => void
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
            <h3 className="text-lg font-bold text-white truncate">
              {recipe.title}
            </h3>
            {showDetailsButton && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 bg-white/10 hover:bg-white/20 rounded-md"
                  >
                    <MoreVertical className="h-4 w-4 text-white" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2 select-none">
                  <div className="space-y-2">
                    <EditRecipe recipe={recipe} onRecipeEdit={onEdit} />
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-500 hover:text-red-600"
                      onClick={handleDelete}
                    >
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {recipe.cookTime}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {recipe.author}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeCard
