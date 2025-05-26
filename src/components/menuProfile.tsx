import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        <TabsContent value="recipe">ici les recettes de cuisines</TabsContent>
      </Tabs>
    </>
  );
}
