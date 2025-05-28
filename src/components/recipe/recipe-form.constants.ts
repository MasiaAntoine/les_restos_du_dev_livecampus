import { z } from 'zod'

export const ingredientSchema = z.object({
  ingredientId: z.string().optional(), // Rendre le champ optionnel
  name: z.string().min(1, { message: "Le nom de l'ingrédient est requis" }),
  quantity: z.number().min(0, { message: 'La quantité doit être positive' }),
  unit: z.string().min(1, { message: "L'unité est requise" }),
})

export const formSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  preparationTime: z.string().min(1, 'Le temps de préparation est requis'),
  ingredients: z.array(
    z.object({
      ingredientId: z.string().optional(),
      name: z.string().min(1, 'Le nom est requis'),
      quantity: z.number().min(0, 'La quantité doit être positive'),
      unit: z.string().min(1, "L'unité est requise"),
    })
  ),
})

// Utilisons une seule définition de FormData basée sur le schema Zod
export type FormData = z.infer<typeof formSchema>

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

export const truncateText = (text: string, maxLength: number = 10) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}
