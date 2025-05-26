import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfilePage() {
  return (
    <>
      <div className="flex justify-center w-screen h-screen p-10">
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="recipe">Recette</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            Ici les informations du profil
          </TabsContent>
          <TabsContent value="recipe">ici les recettes de cuisines</TabsContent>
        </Tabs>
      </div>
    </>
  );
}
