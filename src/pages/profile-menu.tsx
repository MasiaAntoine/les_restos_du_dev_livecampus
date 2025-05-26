import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileComponent from "@/components/profile/profile";
import RecipeComponent from "@/components/recipe/recipe";

export default function MenuProfileComponent() {
  return (
    <>
      <div className="flex p-10 justify-center h-screen w-screen">
        <Tabs defaultValue="info-profile" className="w-full">
          <TabsList>
            <TabsTrigger value="info-profile">Profile</TabsTrigger>
            <TabsTrigger value="recipe">Recette</TabsTrigger>
          </TabsList>

          <TabsContent value="info-profile">
            <ProfileComponent />
          </TabsContent>
          <TabsContent value="recipe">
            <RecipeComponent />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
