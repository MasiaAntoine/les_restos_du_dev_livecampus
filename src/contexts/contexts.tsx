import { createContext } from 'react';
import { AuthService } from '@/services/firebase/auth.service.ts';

export const AuthContext= createContext<AuthService | null>(null);
