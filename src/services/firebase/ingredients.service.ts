import type { IngredientModel } from '@/models/Ingredient.model.ts';
import type { FirebaseService } from '@/services/firebase/firebase.service.tsx';

export class IngredientsService {
  #fs: FirebaseService;

  constructor(fs: FirebaseService) {
    this.#fs = fs;
  }

  public async getAllIngredients(): Promise<IngredientModel[]> {
    return await this.#fs.getAllDocuments<IngredientModel>('INGREDIENTS');
  }

  public async getIngredientById(id: string): Promise<IngredientModel | null> {
    const ingredient: IngredientModel | undefined =  await this.#fs.getDocument<IngredientModel>(`INGREDIENTS/${id}`);
    if (!ingredient) {
      return null;
    }
    return ingredient;
  }
}