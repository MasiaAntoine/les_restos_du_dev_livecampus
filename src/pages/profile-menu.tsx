import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProfileComponent from '@/components/profile/profile'
import RecipeComponent from '@/components/recipe/recipe'
import logo from '@/assets/logo.png'

export default function MenuProfileComponent() {
  return (
    <>
      <div className="flex p-10 justify-center h-screen w-screen">
        <Tabs defaultValue="recipe" className="w-full">
          <div className="flex items-end justify-between">
            <TabsList>
              <TabsTrigger value="recipe">Recette</TabsTrigger>{' '}
              <TabsTrigger value="info-profile">Profile</TabsTrigger>
            </TabsList>

            <img
              src={logo}
              alt="Les Restos du Dev"
              className="size-26 rounded-full"
            />
          </div>

          <TabsContent value="recipe">
            <RecipeComponent />
          </TabsContent>
          <TabsContent value="info-profile">
            <ProfileComponent />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
