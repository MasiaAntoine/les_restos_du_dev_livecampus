'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Link, type NavigateFunction, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useContext } from 'react';
import { ServicesContext, type Services } from '@/contexts/contexts.tsx';
import type { AuthService } from '@/services/firebase/auth.service.tsx';
import type { UserCredential } from 'firebase/auth';
import type { UserService } from '@/services/firebase/user.service.tsx';
import type { UserModel } from '@/models/User.model.tsx';

const formSchema = z
  .object({
    username: z.string().min(2, {
      message: 'Le nom d\'utilisateur doit contenir au moins 2 caractères.',
    }),
    email: z.string().email({
      message: 'Veuillez entrer une adresse email valide.',
    }),
    password: z.string().min(6, {
      message: 'Le mot de passe doit contenir au moins 6 caractères.',
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export default function RegisterPage() {
  const services: Services | null = useContext(ServicesContext);
  const authService: AuthService | undefined = services?.authService;
  const userService: UserService | undefined = services?.userService;
  const navigate:  NavigateFunction = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!authService || !userService) {
      return;
    }
    try {
      const userCred: UserCredential = await authService.register(
        values.email,
        values.password,
      );
      if (userCred.user) {
        const userData: UserModel = {
          uid: userCred.user.uid,
          displayName: values.username,
          email: values.email,
        }
        await userService.createUser(userData).then(() => navigate('/profile'));
      }
    } catch (error) {
      console.error('Erreur lors de la création du compte:', error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <img
            src={logo}
            alt="Les Restos du Dev"
            className="mx-auto size-50 w-auto mb-4 rounded-full"
          />
          <h1 className="text-2xl font-bold">Créer un compte</h1>
          <p className="mt-2 text-sm text-gray-600">
            Ou{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              connectez-vous à votre compte
            </Link>
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom d'utilisateur</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

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
                  <FormMessage/>
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
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              S'inscrire
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
