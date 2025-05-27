import { useContext, useState } from 'react';
import RecipeCard from './card-recipe';
import AddRecipe from './add-recipe';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ServicesContext } from '@/contexts/contexts.tsx';
import type { RecipeModel } from '@/models/Recipe.model.ts';

const recipes = [
  {
    id: '1',
    title: 'Recette 1',
    author: 'John Doe',
    cookTime: '10 minutes',
    imageUrl: 'https://via.placeholder.com/150',
    ingredients: [
      {
        ingredientId: '1a',
        name: 'Farine',
        quantity: 250,
        unit: 'g',
      },
      {
        ingredientId: '1b',
        name: 'Œufs',
        quantity: 2,
        unit: 'unite',
      },
    ],
  },
  {
    id: '2',
    title: 'Recette 2',
    author: 'Jane Smith',
    cookTime: '15 minutes',
    imageUrl: 'https://via.placeholder.com/150',
    ingredients: [
      {
        ingredientId: '2a',
        name: 'Lait',
        quantity: 500,
        unit: 'ml',
      },
      {
        ingredientId: '2b',
        name: 'Sucre',
        quantity: 100,
        unit: 'g',
      },
    ],
  },
  {
    id: '3',
    title: 'Recette 3',
    author: 'Alice Johnson',
    cookTime: '20 minutes',
    imageUrl: 'https://via.placeholder.com/150',
    ingredients: [
      {
        ingredientId: '3a',
        name: 'Beurre',
        quantity: 125,
        unit: 'g',
      },
      {
        ingredientId: '3b',
        name: 'Sel',
        quantity: 1,
        unit: 'pincee',
      },
    ],
  },
  {
    id: '4',
    title: 'Recette 4',
    author: 'Bob Wilson',
    cookTime: '25 minutes',
    imageUrl: 'https://via.placeholder.com/150',
    ingredients: [
      {
        ingredientId: '4a',
        name: 'Farine',
        quantity: 300,
        unit: 'g',
      },
      {
        ingredientId: '4b',
        name: 'Lait',
        quantity: 250,
        unit: 'ml',
      },
    ],
  },
];

export default function RecipeComponent() {
  const [recipesList, setRecipesList] = useState<RecipeModel[]>(recipes);
  const [isLoading, setIsLoading] = useState(false);
  const services = useContext(ServicesContext);
  const recipesService = services?.recipesService;

  const handleDeleteRecipe = (id: string) => {
    setRecipesList(recipesList.filter((recipe) => recipe.id !== id));
    console.log('appeler l\'API pour supprimer la recette avec l\'ID:', id);
  };

  const handleAddRecipe = (newRecipe: RecipeModel) => {
    setIsLoading(true);
    if (!services || !recipesService) {
      throw new Error('Services or recipesService not found');
    }
    if (!newRecipe) {
      throw new Error('Object recipe is empty or undefined');
    }
    setRecipesList([...recipesList, newRecipe]);

    recipesService.createRecipe(newRecipe)
      .then(() => setIsLoading(false));
  };

  const handleEditRecipe = (id: string, updatedRecipe: object) => {
    setRecipesList(
      recipesList.map((recipe) =>
        recipe.id === id ? { ...recipe, ...updatedRecipe } : recipe,
      ),
    );
    console.log('appeler l\'API Recette mise à jour:', updatedRecipe, isLoading);
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Mes Recettes</CardTitle>
          <CardDescription>Découvrez mes délicieuses recettes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <AddRecipe onRecipeAdd={handleAddRecipe}/>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recipesList.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onDelete={handleDeleteRecipe}
                onEdit={handleEditRecipe}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">© 2024 Les Restos du Dev</p>
        </CardFooter>
      </Card>
    </>
  );
}
