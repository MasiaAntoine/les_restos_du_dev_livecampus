import { useContext, useEffect, useState } from 'react'
import RecipeCard from './card-recipe'
import AddRecipe from './add-recipe'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ServicesContext } from '@/contexts/contexts.tsx'
import type { RecipeModel } from '@/models/Recipe.model.ts'

export default function RecipeComponent() {
  const [recipesList, setRecipesList] = useState<RecipeModel[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const services = useContext(ServicesContext)
  const currentUser = services?.currentUser
  const recipesService = services?.recipesService

  useEffect(() => {
    if (services && recipesService && currentUser && currentUser.displayName) {
      setIsLoading(true)
      recipesService
        .getRecipesByAuthor(currentUser.displayName)
        .then((recipes: RecipeModel[]) => {
          setRecipesList(recipes)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error('Erreur lors du chargement des recettes:', error)
          setIsLoading(false)
        })
    }
  }, [services, recipesService, currentUser])

  const handleDeleteRecipe = (id: string) => {
    setRecipesList(recipesList.filter((recipe) => recipe.id !== id))
    console.log("appeler l'API pour supprimer la recette avec l'ID:", id)
  }

  const handleAddRecipe = (newRecipe: RecipeModel) => {
    setIsLoading(true)
    if (!services || !recipesService) {
      throw new Error('Services or recipesService not found')
    }
    if (!newRecipe) {
      throw new Error('Object recipe is empty or undefined')
    }
    setRecipesList([...recipesList, newRecipe])

    recipesService.createRecipe(newRecipe).then(() => setIsLoading(false))
  }

  const handleEditRecipe = (id: string, updatedRecipe: object) => {
    setRecipesList(
      recipesList.map((recipe) =>
        recipe.id === id ? { ...recipe, ...updatedRecipe } : recipe
      )
    )
    console.log("appeler l'API Recette mise à jour:", updatedRecipe, isLoading)
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Mes Recettes</CardTitle>
          <CardDescription>Découvrez mes délicieuses recettes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <AddRecipe onRecipeAdd={handleAddRecipe} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading
              ? Array(4)
                  .fill(null)
                  .map((_, index) => (
                    <RecipeCard
                      key={`loading-${index}`}
                      recipe={{} as RecipeModel}
                      onDelete={() => {}}
                      onEdit={() => {}}
                      isLoading={true}
                    />
                  ))
              : recipesList.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onDelete={handleDeleteRecipe}
                    onEdit={handleEditRecipe}
                    showDetailsButton={true}
                    isLoading={false}
                  />
                ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">© 2024 Les Restos du Dev</p>
        </CardFooter>
      </Card>
    </>
  )
}
