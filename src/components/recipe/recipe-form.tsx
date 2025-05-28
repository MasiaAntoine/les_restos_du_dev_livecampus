'use client'

import { useContext, useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '../ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Trash2 } from 'lucide-react'
import type { IngredientModel } from '@/models/Ingredient.model.ts'
import { ServicesContext } from '@/contexts/contexts.tsx'

// Schémas et constantes communes
export const ingredientSchema = z.object({
  ingredientId: z.string(),
  name: z.string().min(1, { message: "Le nom de l'ingrédient est requis" }),
  quantity: z.number().min(0, { message: 'La quantité doit être positive' }),
  unit: z.string().min(1, { message: "L'unité est requise" }),
})

export const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Le nom de la recette doit contenir au moins 2 caractères.',
  }),
  preparationTime: z.string().min(1, {
    message: 'Le temps de préparation est requis',
  }),
  ingredients: z.array(ingredientSchema).min(1, {
    message: 'Ajoutez au moins un ingrédient',
  }),
})

export const unites = [
  { value: 'g', label: 'Grammes' },
  { value: 'kg', label: 'Kilogrammes' },
  { value: 'ml', label: 'Millilitres' },
  { value: 'l', label: 'Litres' },
  { value: 'cs', label: 'Cuillère à soupe' },
  { value: 'cc', label: 'Cuillère à café' },
  { value: 'pincee', label: 'Pincée' },
  { value: 'unite', label: 'Unité' },
] as const

export const preparationTimes = Array.from({ length: 40 }, (_, i) => ({
  value: String((i + 1) * 5),
  label: `${(i + 1) * 5} min`,
}))

export type FormData = z.infer<typeof formSchema>

interface RecipeFormProps {
  onSubmit: (values: FormData) => void
  defaultValues?: FormData
}

const truncateText = (text: string, maxLength: number = 10) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

export default function RecipeForm({
  onSubmit,
  defaultValues,
}: RecipeFormProps) {
  const services = useContext(ServicesContext)
  const ingredientService = services?.ingredientsService
  const [availableIngredients, setAvailableIngredients] = useState<
    IngredientModel[]
  >([])

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      name: '',
      preparationTime: '',
      ingredients: [],
    },
  })

  useEffect(() => {
    if (services && ingredientService) {
      ingredientService
        .getAllIngredients()
        .then((ingredients: IngredientModel[]) =>
          setAvailableIngredients(ingredients)
        )
    }
  }, [services, ingredientService])

  const addIngredient = () => {
    const currentIngredients = form.getValues('ingredients')
    form.setValue('ingredients', [
      ...currentIngredients,
      {
        ingredientId: Math.random().toString(36).substr(2, 9),
        name: '',
        quantity: 0,
        unit: '',
      },
    ])
  }

  const removeIngredient = (indexToRemove: number) => {
    const currentIngredients = form.getValues('ingredients')
    form.setValue(
      'ingredients',
      currentIngredients.filter((_, index) => index !== indexToRemove)
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Champ Nom */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la recette</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Tarte aux pommes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Temps de préparation */}
        <FormField
          control={form.control}
          name="preparationTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Temps de préparation</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner le temps de préparation" />
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
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Section Ingrédients */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Ingrédients</h3>
            <Button type="button" onClick={addIngredient}>
              Ajouter un ingrédient
            </Button>
          </div>

          <div className="h-[50vh] overflow-y-auto">
            {form.watch('ingredients').map((ingredient, index) => {
              const fieldId = ingredient.ingredientId
              return (
                <div
                  key={`ingredient-${fieldId}`}
                  className="flex gap-2 mb-4 items-center"
                >
                  {/* Sélection de l'ingrédient */}
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select
                          onValueChange={(value) => {
                            const selectedIngredient =
                              availableIngredients.find(
                                (ing) => ing.name === value
                              )
                            if (selectedIngredient) {
                              form.setValue(
                                `ingredients.${index}.ingredientId`,
                                selectedIngredient.id
                              )
                              field.onChange(value)
                            }
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Sélectionner un ingrédient" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableIngredients.map((ing, optionIndex) => (
                              <SelectItem
                                key={
                                  ing.id
                                    ? `ingredient-${ing.id}`
                                    : `ingredient-new-${optionIndex}-${fieldId}`
                                }
                                value={ing.name}
                              >
                                {truncateText(ing.name)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Quantité */}
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Quantité"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => {
                              const value =
                                e.target.value === ''
                                  ? 0
                                  : parseFloat(e.target.value)
                              field.onChange(value)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Unité */}
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.unit`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Unité" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {unites.map((unite) => (
                              <SelectItem
                                key={`unit-option-${unite.value}-${fieldId}`}
                                value={unite.value}
                              >
                                {truncateText(unite.label)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Bouton de suppression */}
                  <Button
                    type="button"
                    variant="ghost"
                    className="p-2"
                    onClick={() => removeIngredient(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        </div>

        <Button type="submit" className="w-full">
          Enregistrer
        </Button>
      </form>
    </Form>
  )
}
