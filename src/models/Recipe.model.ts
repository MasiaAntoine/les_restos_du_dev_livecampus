import type { RecipePartModel } from '@/models/RecipePart.model.ts';

export interface RecipeModel {
  id: string;
  title: string;
  cookTime: string;
  author: string;
  imageUrl: string;
  ingredients: RecipePartModel[];
}
