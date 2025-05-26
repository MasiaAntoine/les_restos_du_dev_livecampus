import {
  type UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { FirebaseService} from './firebase.service';

export class AuthService {
  #firebaseService: FirebaseService;
  userCredential: UserCredential | null = null;

  constructor(firebaseService: FirebaseService) {
    this.#firebaseService = firebaseService;
  }

  public async signIn(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(this.#firebaseService.getFireAuth(), email, password);
  }

  public async register(email: string, password: string): Promise<UserCredential> {
    return await createUserWithEmailAndPassword(this.#firebaseService.getFireAuth(), email, password);
  }
}