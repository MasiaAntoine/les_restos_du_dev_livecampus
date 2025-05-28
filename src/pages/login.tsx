'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Link, type NavigateFunction, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import logo from '@/assets/logo200-200.webp'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { useContext, useState } from 'react'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ServicesContext, type Services } from '@/contexts/contexts.tsx'
import type { AuthService } from '@/services/firebase/auth.service.tsx'
import type { UserService } from '@/services/firebase/user.service'
import type { RecipesService } from '@/services/firebase/recipes.service.ts'

const formSchema = z.object({
  email: z.string().email({
    message: 'Veuillez entrer une adresse email valide.',
  }),
  password: z.string().min(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères.',
  }),
})

export default function LoginPage() {
  const services: Services | null = useContext(ServicesContext)
  const authService: AuthService | undefined = services?.authService
  const userService: UserService | undefined = services?.userService
  const recipesService: RecipesService | undefined = services?.recipesService
  const navigate: NavigateFunction = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!authService || !userService) {
      return
    }
    try {
      console.log(await recipesService?.getAllRecipes())
      await authService.signIn(values.email, values.password)
      toast.success('Connexion réussie')
      navigate('/profile')
    } catch (error) {
      console.log(error)
      toast.error('Erreur lors de la connexion')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <img
            src={logo}
            alt="Les Restos du Dev"
            className="mx-auto size-50 w-auto mb-4 rounded-full"
          />
          <h1 className="text-2xl font-bold">Connexion</h1>
          <p className="mt-2 text-sm text-gray-600">
            Ou{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              créez un nouveau compte
            </Link>
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-3"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Mot de passe oublié?
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Se connecter
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
