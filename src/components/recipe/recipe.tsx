import React, { useState } from 'react'
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

const recipes = [
  {
    id: 1,
    title: 'Recette 1',
    author: 'John Doe',
    cookTime: '10 minutes',
    imageUrl: 'https://via.placeholder.com/150',
    ingredients: [
      {
        id: '1a',
        name: 'Farine',
        quantity: 250,
        unit: 'g',
      },
      {
        id: '1b',
        name: 'Œufs',
        quantity: 2,
        unit: 'unite',
      },
    ],
  },
  {
    id: 2,
    title: 'Recette 2',
    author: 'Jane Smith',
    cookTime: '15 minutes',
    imageUrl: 'https://via.placeholder.com/150',
    ingredients: [
      {
        id: '2a',
        name: 'Lait',
        quantity: 500,
        unit: 'ml',
      },
      {
        id: '2b',
        name: 'Sucre',
        quantity: 100,
        unit: 'g',
      },
    ],
  },
  {
    id: 3,
    title: 'Recette 3',
    author: 'Alice Johnson',
    cookTime: '20 minutes',
    imageUrl: 'https://via.placeholder.com/150',
    ingredients: [
      {
        id: '3a',
        name: 'Beurre',
        quantity: 125,
        unit: 'g',
      },
      {
        id: '3b',
        name: 'Sel',
        quantity: 1,
        unit: 'pincee',
      },
    ],
  },
  {
    id: 4,
    title: 'Recette 4',
    author: 'Bob Wilson',
    cookTime: '25 minutes',
    imageUrl: 'https://via.placeholder.com/150',
    ingredients: [
      {
        id: '4a',
        name: 'Farine',
        quantity: 300,
        unit: 'g',
      },
      {
        id: '4b',
        name: 'Lait',
        quantity: 250,
        unit: 'ml',
      },
    ],
  },
]

export default function RecipeComponent() {
  const [recipesList, setRecipesList] = useState(recipes)

  const handleDeleteRecipe = (id: number) => {
    setRecipesList(recipesList.filter((recipe) => recipe.id !== id))
    console.log("appeler l'API pour supprimer la recette avec l'ID:", id)
  }

  const handleAddRecipe = (newRecipe: object) => {
    setRecipesList([...recipesList, newRecipe])
    console.log("appeler l'API Nouvelle recette ajoutée:", newRecipe)
  }

  const handleEditRecipe = (id: number, updatedRecipe: object) => {
    setRecipesList(
      recipesList.map((recipe) =>
        recipe.id === id ? { ...recipe, ...updatedRecipe } : recipe
      )
    )
    console.log("appeler l'API Recette mise à jour:", updatedRecipe)
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
            {recipesList.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                author={recipe.author}
                cookTime={recipe.cookTime}
                imageUrl={recipe.imageUrl}
                showDetailsButton={true}
                onDelete={handleDeleteRecipe}
                onEdit={handleEditRecipe}
                ingredients={recipe.ingredients}
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
