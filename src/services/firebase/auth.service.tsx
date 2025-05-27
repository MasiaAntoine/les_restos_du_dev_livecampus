import {
  type UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, type UserInfo,
} from 'firebase/auth';
import { FirebaseService } from './firebase.service.tsx';

export class AuthService {
  #firebaseService: FirebaseService;
  readonly #setcurrentUser: (user: UserInfo | null) => void;

  constructor(firebaseService: FirebaseService, setCurrentUser: (user: UserInfo | null) => void) {
    this.#firebaseService = firebaseService;
    this.#setcurrentUser = setCurrentUser;
  }

  public async signIn(email: string, password: string): Promise<UserCredential> {
    const userCredential: UserCredential = await signInWithEmailAndPassword(this.#firebaseService.getFireAuth(), email, password);
    this.#setcurrentUser(userCredential.user);
    return userCredential;
  }

  public async register(email: string, password: string): Promise<UserCredential> {
    return await createUserWithEmailAndPassword(this.#firebaseService.getFireAuth(), email, password);
  }
}