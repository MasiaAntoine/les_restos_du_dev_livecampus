import type {
  FirebaseService,
  QueryWhereElement,
} from '@/services/firebase/firebase.service.tsx';
import type { RecipeModel } from '@/models/Recipe.model.ts';

export class RecipesService {
  #fs: FirebaseService;

  constructor(fs: FirebaseService) {
    this.#fs = fs;
  }

  public async getAllRecipes(): Promise<RecipeModel[]> {
    const recipes: RecipeModel[] = await this.#fs.getAllDocuments<RecipeModel>(
      'RECIPES',
    );
    return recipes;
  }

  public async getRecipeById(id: string): Promise<RecipeModel | null> {
    const recipe: RecipeModel | undefined =
      await this.#fs.getDocument<RecipeModel>(`RECIPES/${id}`);
    if (!recipe) {
      return null;
    }
    return recipe;
  }

  public async getRecipesByAuthor(author: string): Promise<RecipeModel[]> {
    const query: QueryWhereElement<RecipeModel> = {
      fieldName: 'author',
      operator: '==',
      value: author,
    };
    const recipes: RecipeModel[] =
      await this.#fs.getDocumentsWhere<RecipeModel>('RECIPES', [query], 'title');
    return recipes.filter((recipe: RecipeModel) => recipe.author === author);
  }

  public async createRecipe(recipe: RecipeModel) {
    await this.#fs.setDocument(`RECIPES/${recipe.id}`, recipe);
  }

  public async updateRecipe(recipe: RecipeModel) {
    if (!recipe.id) {
      throw new Error('Recipe ID is required for update');
    }
    await this.#fs.setDocument(`RECIPES/${recipe.id}`, recipe);
  }

  public async deleteRecipe(id: string) {
    if (!id) {
      throw new Error('Recipe ID is required for deletion');
    }
    await this.#fs.deleteDocument(`RECIPES/${id}`);
  }
}
