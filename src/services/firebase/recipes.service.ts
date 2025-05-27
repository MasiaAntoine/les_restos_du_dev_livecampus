import type { FirebaseService, QueryWhereElement } from '@/services/firebase/firebase.service.tsx';
import type { RecipePartModel } from '@/models/RecipePart.model.ts';
import type { RecipeModel } from '@/models/Recipe.model.ts';
import { uuidv4 } from 'zod/v4';

export class RecipesService {
  #fs: FirebaseService;

  constructor(fs: FirebaseService) {
    this.#fs = fs;
  }

  async #getRecipeIngredients(recipeId: string): Promise<RecipePartModel[]> {
    return await this.#fs.getAllDocuments<RecipePartModel>('RECIPES/' + recipeId + '/INGREDIENTS');
  }

  public async getAllRecipes(): Promise<RecipeModel[]> {
    const recipes: RecipeModel[] = await this.#fs.getAllDocuments<RecipeModel>('RECIPES');

    for (const recipe of recipes) {
      recipe.ingredients = await this.#getRecipeIngredients(recipe.id);
    }
    return recipes;
  }

  public async getRecipeById(id: string): Promise<RecipeModel | null> {
    const recipe: RecipeModel | undefined = await this.#fs.getDocument<RecipeModel>(`RECIPES/${id}`);
    if (!recipe) {
      return null;
    }
    recipe.ingredients = await this.#getRecipeIngredients(recipe.id);
    return recipe;
  }

  public async getRecipesByAuthor(author: string): Promise<RecipeModel[]> {
    const query: QueryWhereElement<RecipeModel> = {
      fieldName: 'author',
      operator: '==',
      value: author,
    };
    const recipes: RecipeModel[] = await this.#fs.getDocumentsWhere<RecipeModel>('RECIPES', [query], 'title');
    for (const recipe of recipes) {
      recipe.ingredients = await this.#getRecipeIngredients(recipe.id);
    }
    return recipes.filter((recipe: RecipeModel) => recipe.author === author);
  }

  public async createRecipe(recipe: RecipeModel) {
    const recipeId: string | null = uuidv4().format;
    if (recipeId === null) {
      throw new Error('Error generating recipe ID');
    }
    recipe.id = recipeId;
    await this.#fs.setDocument(`RECIPES/${recipe.id}`, recipe);

    for (const ingredient of recipe.ingredients) {
      const ingredientId: string | null = uuidv4().format;
      if (ingredientId === null) {
        throw new Error('Error generating ingredient ID');
      }
      ingredient.ingredientId = ingredientId;
      await this.#fs.setDocument(`RECIPES/${recipeId}/INGREDIENTS/${ingredientId}`, ingredient);
    }
  }

  public async updateRecipe(recipe: RecipeModel) {
    if (!recipe.id) {
      throw new Error('Recipe ID is required for update');
    }
    await this.#fs.setDocument(`RECIPES/${recipe.id}`, recipe);

    for (const ingredient of recipe.ingredients) {
      if (!ingredient.ingredientId) {
        throw new Error('Ingredient ID is required for update');
      }
      await this.#fs.setDocument(`RECIPES/${recipe.id}/INGREDIENTS/${ingredient.ingredientId}`, ingredient);
    }
  }
}