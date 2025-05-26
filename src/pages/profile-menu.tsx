import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileComponent from "@/components/profile/profile";
import RecipeComponent from "@/components/recipe/recipe";

export default function MenuProfileComponent() {
  return (
    <>
      <div className="flex p-10 justify-center h-screen w-screen">
        <Tabs defaultValue="recipe" className="w-full">
          <TabsList>
            <TabsTrigger value="recipe">Recette</TabsTrigger>{" "}
            <TabsTrigger value="info-profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="recipe">
            <RecipeComponent />
          </TabsContent>
          <TabsContent value="info-profile">
            <ProfileComponent />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
