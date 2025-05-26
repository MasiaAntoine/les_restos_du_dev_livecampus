import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileComponent from "@/components/profile";
import RecipeComponent from "@/components/recipe";

export default function MenuProfileComponent() {
  return (
    <>
      <div className="flex p-10 justify-center h-screen w-screen">
        <Tabs defaultValue="info-profile" className="w-[400px]">
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
