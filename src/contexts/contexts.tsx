import { createContext } from 'react';
import { AuthService } from '@/services/firebase/auth.service.tsx';
import { UserService } from '@/services/firebase/user.service.tsx';
import type { IngredientsService } from '@/services/firebase/ingredients.service.ts';
import type { RecipesService } from '@/services/firebase/recipes.service.ts';
import type { UserModel } from '@/models/User.model.ts';

export type Services = {
  authService: AuthService;
  userService: UserService;
  ingredientsService: IngredientsService;
  recipesService: RecipesService;
  currentUser: UserModel | null;
};

export const ServicesContext = createContext<Services | null>(null);
