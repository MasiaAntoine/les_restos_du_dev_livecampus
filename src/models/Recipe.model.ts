import { IngredientModel } from './Ingredient.model'

export interface RecipeModel {
  id: number
  title: string
  cookTime: string
  author: string
  imageUrl: string
  ingredients: IngredientModel[]
}
