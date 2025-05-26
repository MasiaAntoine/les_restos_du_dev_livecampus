import React from "react";
import MenuProfileComponents from "@/components/ui/menu";
import RecipeCard from "./recipeCard";

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
      <Card>
        <CardHeader>
          <CardTitle>Recette</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <RecipeCard
            title="Recette 1"
            author="John Doe"
            cookTime="10 minutes"
            imageUrl="https://via.placeholder.com/150"
          />
          <RecipeCard
            title="Recette 2"
            author="Jane Smith"
            cookTime="15 minutes"
            imageUrl="https://via.placeholder.com/150"
          />
          <RecipeCard
            title="Recette 3"
            author="Alice Johnson"
            cookTime="20 minutes"
            imageUrl="https://via.placeholder.com/150"
          />
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </>
  );
}
