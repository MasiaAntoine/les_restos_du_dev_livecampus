import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type UserCredential,
} from 'firebase/auth'
import { FirebaseService } from './firebase.service.tsx'
import type { UserService } from '@/services/firebase/user.service.tsx'
import type { UserModel } from '@/models/User.model.ts'

export class AuthService {
  #firebaseService: FirebaseService
  #userService: UserService
  readonly #setcurrentUser: (user: UserModel | null) => void

  constructor(
    firebaseService: FirebaseService,
    setCurrentUser: (user: UserModel | null) => void,
    userService: UserService
  ) {
    this.#firebaseService = firebaseService
    this.#userService = userService
    this.#setcurrentUser = setCurrentUser
  }

  public async signOut(): Promise<void> {
    try {
      await signOut(this.#firebaseService.getFireAuth())
      this.#setcurrentUser(null)
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      throw error
    }
  }

  public async signIn(email: string, password: string): Promise<boolean> {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      this.#firebaseService.getFireAuth(),
      email,
      password
    )
    const user = await this.#userService.getUserByUid(userCredential.user.uid)
    if (!user) {
      throw new Error('User not found')
    }
    this.#setcurrentUser(user)
    return true
  }

  public async register(
    email: string,
    password: string,
    displayName: string
  ): Promise<boolean> {
    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(
          this.#firebaseService.getFireAuth(),
          email,
          password
        )
      const user: UserModel = {
        uid: userCredential.user.uid,
        email: email,
        displayName: displayName,
      }
      return this.#userService.createUser(user).then(() => {
        this.#setcurrentUser(user)
        return true
      })
    } catch (error) {
      console.error('Error during registration:', error)
      return false
    }
  }
}
