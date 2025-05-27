import type { FirebaseService, QueryWhereElement } from '@/services/firebase/firebase.service.tsx';
import type { RecipePartModel } from '@/models/RecipePart.model.ts';
import type { RecipeModel } from '@/models/Recipe.model.ts';

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
    }
    const recipes: RecipeModel[] = await this.#fs.getDocumentsWhere<RecipeModel>('RECIPES', [query], 'title');
    for (const recipe of recipes) {
      recipe.ingredients = await this.#getRecipeIngredients(recipe.id);
    }
    return recipes.filter((recipe: RecipeModel) => recipe.author === author);
  }
}