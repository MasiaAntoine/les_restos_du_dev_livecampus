'use client'

import { useContext, useEffect, useState, useCallback } from 'react' // Ajoutez useCallback aux imports
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
import {
  type FormData,
  formSchema,
  preparationTimes,
  truncateText,
  unites,
} from './recipe-form.constants'

interface RecipeFormProps {
  onSubmit: (values: FormData) => void
  defaultValues?: FormData
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
    mode: 'onChange',
  })

  const handleFormChange = useCallback(() => {
    console.log('Valeurs du formulaire mises à jour:', form.getValues())
    console.log('Erreurs du formulaire:', form.formState.errors)
  }, [form])

  useEffect(() => {
    const subscription = form.watch(handleFormChange)
    return () => subscription.unsubscribe()
  }, [form, handleFormChange])

  useEffect(() => {
    const loadIngredients = async () => {
      if (services && ingredientService) {
        try {
          const ingredients = await ingredientService.getAllIngredients()
          setAvailableIngredients(ingredients)
        } catch (error) {
          console.error('Erreur lors du chargement des ingrédients:', error)
        }
      }
    }

    loadIngredients()
  }, [services, ingredientService])

  const addIngredient = () => {
    const newIngredient = {
      ingredientId: '',
      name: '',
      quantity: 0,
      unit: '',
    }

    const currentIngredients = form.getValues('ingredients') || []
    form.setValue('ingredients', [...currentIngredients, newIngredient])
  }

  const removeIngredient = (indexToRemove: number) => {
    const currentIngredients = form.getValues('ingredients')
    form.setValue(
      'ingredients',
      currentIngredients.filter((_, index) => index !== indexToRemove)
    )
  }

  const getAvailableIngredientsForSelect = (currentIndex: number) => {
    const selectedIngredients = form.watch('ingredients')
    return availableIngredients.filter((ingredient) => {
      return !selectedIngredients.some(
        (selected, index) =>
          selected.name === ingredient.name && index !== currentIndex
      )
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault()

          const currentValues = form.getValues()
          const cleanedIngredients = currentValues.ingredients.map(
            (ingredient) => ({
              ingredientId: ingredient.ingredientId || '',
              name: ingredient.name || '',
              quantity: ingredient.quantity || 0,
              unit: ingredient.unit || '',
            })
          )

          const cleanedValues = {
            ...currentValues,
            name: currentValues.name || '',
            preparationTime: currentValues.preparationTime || '0',
            ingredients: cleanedIngredients,
          }

          form.handleSubmit(() => {
            onSubmit(cleanedValues)
          })(e)
        }}
        className="space-y-6"
      >
        {/* Champ Nom */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la recette</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Tarte aux pommes"
                  {...field}
                  data-testid="recipe-name-input"
                />
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
              <Select
                onValueChange={(value) => {
                  console.log('Temps de préparation sélectionné:', value)
                  field.onChange(value)
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger
                    className="w-full"
                    data-testid="recipe-time-select"
                  >
                    <SelectValue placeholder="Sélectionner le temps de préparation" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent data-testid="recipe-time-select-content">
                  {preparationTimes.map((time) => (
                    <SelectItem
                      key={time.value}
                      value={time.value}
                      data-testid={`time-option-${time.value}`}
                    >
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
            <Button
              type="button"
              onClick={addIngredient}
              data-testid="add-ingredient-button"
            >
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
                            <SelectTrigger
                              className="w-full"
                              data-testid={`ingredient-name-select-${index}`}
                            >
                              <SelectValue placeholder="Sélectionner un ingrédient" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent data-testid="add-ingredient-name-select-content">
                            {getAvailableIngredientsForSelect(index).map(
                              (ing, optionIndex) => (
                                <SelectItem
                                  key={
                                    ing.id
                                      ? `ingredient-${ing.id}`
                                      : `ingredient-new-${optionIndex}-${fieldId}`
                                  }
                                  value={ing.name}
                                  data-testid={`ingredient-option-${ing.name}`}
                                >
                                  {truncateText(ing.name)}
                                </SelectItem>
                              )
                            )}
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
                            data-testid={`ingredient-quantity-input-${index}`}
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
                            <SelectTrigger
                              className="w-full"
                              data-testid={`ingredient-unit-select-${index}`}
                            >
                              <SelectValue placeholder="Unité" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {unites.map((unite) => (
                              <SelectItem
                                key={`unit-option-${unite.value}-${fieldId}`}
                                value={unite.value}
                                data-testid={`unit-option-${unite.value}`}
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
                    data-testid={`remove-ingredient-button-${index}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        </div>

        <Button type="submit" className="w-full" data-testid="submit-edit-form">
          Enregistrer
        </Button>
      </form>
    </Form>
  )
}
