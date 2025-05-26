import { initializeApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
// @ts-expect-error
import { firebaseConfig } from '/firebase.config';

export class FirebaseService {
  readonly #firebaseApp: FirebaseApp;
  readonly #fireStore: Firestore;
  readonly #fireAuth: Auth;

  private constructor() {
    this.#firebaseApp = initializeApp(firebaseConfig);
    this.#fireStore = getFirestore(this.#firebaseApp);
    this.#fireAuth = getAuth(this.#firebaseApp);
  }

  public getApp(): FirebaseApp {
    return this.#firebaseApp ? this.#firebaseApp : initializeApp(firebaseConfig);
  }

  public getFs(): Firestore {
    return this.#fireStore ? this.#fireStore : getFirestore(this.getApp());
  }

  public getFireAuth(): Auth {
    return this.#fireAuth ? this.#fireAuth : getAuth(this.getApp());
  }
}