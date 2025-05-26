import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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

// Schéma pour un ingrédient
const ingredientSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Le nom de l'ingrédient est requis" }),
  type: z.string().min(1, { message: 'Le type est requis' }),
  quantity: z.number().min(0, { message: 'La quantité doit être positive' }),
  unit: z.string().min(1, { message: "L'unité est requise" }),
})

// Schéma du formulaire
const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Le nom de la recette doit contenir au moins 2 caractères.',
  }),
  ingredients: z.array(ingredientSchema).min(1, {
    message: 'Ajoutez au moins un ingrédient',
  }),
})

export default function AddRecipeComponent() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      ingredients: [],
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
    // Ici vous pourrez ajouter la logique pour sauvegarder la recette
  }

  const addIngredient = () => {
    const currentIngredients = form.getValues('ingredients')
    form.setValue('ingredients', [
      ...currentIngredients,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: '',
        type: '',
        quantity: 0,
        unit: '',
      },
    ])
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mb-4">Créer une recette</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle recette</DialogTitle>
          <DialogDescription>
            Remplissez le formulaire pour ajouter une nouvelle recette.
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
                  <FormMessage />
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

              {form.watch('ingredients').map((_, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 mb-4">
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.unit`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unité</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full">
              Créer la recette
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
