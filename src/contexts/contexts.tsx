import { createContext } from 'react';
import { AuthService } from '@/services/firebase/auth.service.tsx';
import { UserService } from '@/services/firebase/user.service.tsx';

export type Services = {
  authService: AuthService;
  userService: UserService;
};

export const ServicesContext = createContext<Services | null>(null);
