import { initializeApp, type FirebaseApp } from 'firebase/app';
import { doc, Firestore, getDoc, setDoc, getFirestore, type DocumentData } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
// @ts-expect-error
import { firebaseConfig } from '/firebase.config';

export class FirebaseService {
  readonly #firebaseApp: FirebaseApp;
  readonly #fireStore: Firestore;
  readonly #fireAuth: Auth;

  constructor() {
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

  public async getDocument<T extends DocumentData = DocumentData>(path: string): Promise<T | undefined> {
    const docSnapshot = await getDoc(doc(getFirestore(), path));
    return docSnapshot.data() as T;
  }

  public async setDocument<T extends DocumentData = DocumentData>(path: string, data: T): Promise<void> {
    const docRef = doc(this.getFs(), path);
    return setDoc(docRef, data);
  }
}