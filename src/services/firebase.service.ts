import { initializeApp } from 'firebase/app'
import type { FirebaseApp } from 'firebase/app'
import type { DocumentData, DocumentSnapshot } from 'firebase/firestore'
import { Firestore, getFirestore, doc, getDoc } from 'firebase/firestore'
import type { Auth, UserCredential } from 'firebase/auth'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { firebaseConfig } from 'firebase.config.ts';


let firebaseApp: FirebaseApp | undefined
let firestore: Firestore | undefined
let fireAuth: Auth | undefined

export function getApp(): FirebaseApp {
    firebaseApp = firebaseApp ? firebaseApp : initializeApp(firebaseConfig)

    return firebaseApp
}

export function getFs(): Firestore {
    firestore = firestore ? firestore : getFirestore(getApp())

    return firestore
}

export function getFireAuth(): Auth {
    fireAuth = fireAuth ? fireAuth : getAuth(getApp())

    return fireAuth
}

export function signIn(
    email: string,
    password: string
): Promise<UserCredential> {
    return signInWithEmailAndPassword(getFireAuth(), email, password)
}

export async function getDocument<T extends DocumentData = DocumentData>(
    path: string
): Promise<T | undefined> {
    const docSnapshot: DocumentSnapshot = await getDoc(
        doc(getFirestore(), path)
    )

    return docSnapshot.data() as T
}
