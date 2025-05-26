import React from "react";
import MenuProfileComponents from "@/components/ui/menu";
import RecipeCard from "./recipeCard";
import AddRecipe from "./add-recipe";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RecipeComponent() {
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Nos Recettes</CardTitle>
          <CardDescription>Découvrez nos délicieuses recettes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <AddRecipe />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <RecipeCard
              title="Recette 1"
              author="John Doe"
              cookTime="10 minutes"
              imageUrl="https://via.placeholder.com/150"
              showDetailsButton={true}
            />
            <RecipeCard
              title="Recette 2"
              author="Jane Smith"
              cookTime="15 minutes"
              imageUrl="https://via.placeholder.com/150"
              showDetailsButton={true}
            />
            <RecipeCard
              title="Recette 3"
              author="Alice Johnson"
              cookTime="20 minutes"
              imageUrl="https://via.placeholder.com/150"
              showDetailsButton={true}
            />
            <RecipeCard
              title="Recette 4"
              author="Bob Wilson"
              cookTime="25 minutes"
              imageUrl="https://via.placeholder.com/150"
              showDetailsButton={true}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">© 2024 Les Restos du Dev</p>
        </CardFooter>
      </Card>
    </>
  );
}
