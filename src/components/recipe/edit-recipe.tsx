'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import type { RecipeModel } from '@/models/Recipe.model.ts';

// Schéma pour un ingrédient (même que dans add-recipe)
const ingredientSchema = z.object({
  ingredientId: z.string(),
  name: z.string().min(1, { message: 'Le nom de l\'ingrédient est requis' }),
  quantity: z.number().min(0, { message: 'La quantité doit être positive' }),
  unit: z.string().min(1, { message: 'L\'unité est requise' }),
});

// Schéma du formulaire (même que dans add-recipe)
const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Le nom de la recette doit contenir au moins 2 caractères.',
  }),
  preparationTime: z.string().min(1, {
    message: 'Le temps de préparation est requis',
  }),
  ingredients: z.array(ingredientSchema).min(1, {
    message: 'Ajoutez au moins un ingrédient',
  }),
});

const ingredients = [
  { name: 'Farine' },
  { name: 'Sucre' },
  { name: 'Œufs' },
  { name: 'Lait' },
  { name: 'Beurre' },
  { name: 'Sel' },
] as const;

const unites = [
  { value: 'g', label: 'Grammes' },
  { value: 'kg', label: 'Kilogrammes' },
  { value: 'ml', label: 'Millilitres' },
  { value: 'l', label: 'Litres' },
  { value: 'cs', label: 'Cuillère à soupe' },
  { value: 'cc', label: 'Cuillère à café' },
  { value: 'pincee', label: 'Pincée' },
  { value: 'unite', label: 'Unité' },
] as const;

const preparationTimes = Array.from({ length: 40 }, (_, i) => ({
  value: String((i + 1) * 5),
  label: `${(i + 1) * 5} min`,
}));

interface EditRecipeProps {
  recipe: RecipeModel,
  onRecipeEdit: (id: string, updatedRecipe: RecipeModel) => void
}

export default function EditRecipeComponent({
                                              recipe,
                                              onRecipeEdit,
                                            }: EditRecipeProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: recipe.title,
      preparationTime: recipe.cookTime.split(' ')[0], // Extrait le nombre de minutes
      ingredients: recipe.ingredients,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const updatedRecipe = {
      id: recipe.id,
      title: values.name,
      cookTime: `${values.preparationTime} minutes`,
      author: 'Utilisateur', // À remplacer par l'utilisateur connecté
      imageUrl: 'https://via.placeholder.com/150',
      ingredients: values.ingredients,
    };

    onRecipeEdit(recipe.id, updatedRecipe);
    setOpen(false);
  };

  const addIngredient = () => {
    const currentIngredients = form.getValues('ingredients');
    form.setValue('ingredients', [
      ...currentIngredients,
      {
        ingredientId: Math.random().toString(36).substr(2, 9),
        name: '',
        quantity: 0,
        unit: '',
      },
    ]);
  };

  const removeIngredient = (indexToRemove: number) => {
    const currentIngredients = form.getValues('ingredients');
    form.setValue(
      'ingredients',
      currentIngredients.filter((_, index) => index !== indexToRemove),
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start ">
          Modifier
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Modifier la recette</DialogTitle>
          <DialogDescription>
            Modifiez les informations de la recette.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la recette</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Tarte aux pommes" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preparationTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temps de préparation</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner le temps de préparation"/>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {preparationTimes.map((time) => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Ingrédients</h3>
                <Button type="button" onClick={addIngredient}>
                  Ajouter un ingrédient
                </Button>
              </div>

              <div className="h-[50vh] overflow-y-auto">
                {form.watch('ingredients').map((_, index) => (
                  <div key={index} className="flex gap-4 mb-4 items-center">
                    <FormField
                      control={form.control}
                      name={`ingredients.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Ingrédient"/>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ingredients.map((ingredient) => (
                                <SelectItem
                                  key={ingredient.name}
                                  value={ingredient.name}
                                >
                                  {ingredient.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage/>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`ingredients.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantité</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`ingredients.${index}.unit`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unité</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Unité"/>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {unites.map((unite) => (
                                <SelectItem
                                  key={unite.value}
                                  value={unite.value}
                                >
                                  {unite.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage/>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-4"
                      onClick={() => removeIngredient(index)}
                    >
                      <Trash2 className="size-4 text-red-500"/>
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full">
              Enregistrer les modifications
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
