import {
  type UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { FirebaseService } from './firebase.service.tsx';

export class AuthService {
  #firebaseService: FirebaseService;
  firebaseUser:  UserCredential | null = null;

  constructor(firebaseService: FirebaseService) {
    this.#firebaseService = firebaseService;
  }

  get connectedUserUid(): string | null {
    return this.firebaseUser?.user?.uid ?? null;
  }

  public async signIn(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(this.#firebaseService.getFireAuth(), email, password);
  }

  public async register(email: string, password: string): Promise<UserCredential> {
    return await createUserWithEmailAndPassword(this.#firebaseService.getFireAuth(), email, password);
  }
}