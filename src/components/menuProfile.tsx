import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecipeCard from "./recipeCard";

export default function MenuProfilePage() {
  return (
    <>
      <Tabs defaultValue="profile" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="recipe">Recette</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          Ici les informations du profil
        </TabsContent>
        <TabsContent value="recipe">


        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customers also purchased</h2>

            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              
              <RecipeCard title="Recette 1" author="John Doe" cookTime="10 minutes" imageUrl="https://via.placeholder.com/150" />
              <RecipeCard title="Recette 2" author="Jane Smith" cookTime="15 minutes" imageUrl="https://via.placeholder.com/150" />
              <RecipeCard title="Recette 3" author="Alice Johnson" cookTime="20 minutes" imageUrl="https://via.placeholder.com/150" />

            </div>
          </div>
        </div>

        </TabsContent>
      </Tabs>
    </>
  );
}
