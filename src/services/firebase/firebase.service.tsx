import { initializeApp, type FirebaseApp } from 'firebase/app'
import {
  Firestore,
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  collection,
  query,
  where,
  orderBy,
  type DocumentData,
  type WhereFilterOp,
  type OrderByDirection,
  type Query,
  DocumentSnapshot,
  DocumentReference,
  CollectionReference,
  QuerySnapshot,
} from 'firebase/firestore'
import { getAuth, type Auth } from 'firebase/auth'
import { firebaseConfig } from '@/config/firebase.config'

export type QueryWhereElement<T> = {
  fieldName: keyof T
  operator: WhereFilterOp
  value: unknown
}
type Order<T> = {
  fieldName: keyof T
  direction: OrderByDirection
}

export class FirebaseService {
  readonly #firebaseApp: FirebaseApp
  readonly #fireStore: Firestore
  readonly #fireAuth: Auth

  constructor() {
    this.#firebaseApp = initializeApp(firebaseConfig)
    this.#fireStore = getFirestore(this.#firebaseApp)
    this.#fireAuth = getAuth(this.#firebaseApp)
  }

  public getApp(): FirebaseApp {
    return this.#firebaseApp ? this.#firebaseApp : initializeApp(firebaseConfig)
  }

  public getFs(): Firestore {
    return this.#fireStore ? this.#fireStore : getFirestore(this.getApp())
  }

  public getFireAuth(): Auth {
    return this.#fireAuth ? this.#fireAuth : getAuth(this.getApp())
  }

  public async getDocument<T extends DocumentData = DocumentData>(
    path: string
  ): Promise<T | undefined> {
    const docSnapshot: DocumentSnapshot = await getDoc(
      doc(getFirestore(), path)
    )
    return docSnapshot.data() as T
  }

  public async setDocument<T extends DocumentData = DocumentData>(
    path: string,
    data: T
  ): Promise<void> {
    const docRef: DocumentReference = doc(this.getFs(), path)
    return setDoc(docRef, data)
  }

  public async deleteDocument(path: string): Promise<void> {
    const docRef: DocumentReference = doc(this.getFs(), path)
    return setDoc(docRef, {}, { merge: true })
  }

  public async getAllDocuments<T>(collectionName: string): Promise<T[]> {
    const c: CollectionReference = collection(getFirestore(), collectionName)
    const querySnapshot: QuerySnapshot = await getDocs(c)
    return querySnapshot.docs.map((d) => d.data() as T)
  }

  public async getDocumentsWhere<T>(
    collectionName: string,
    queryWhere: QueryWhereElement<T>[] = [],
    order?: keyof T | Order<T>
  ): Promise<T[]> {
    const c: CollectionReference = collection(getFirestore(), collectionName)
    const q: Query = this.constructQuery(c, queryWhere, order)
    const querySnapshot: QuerySnapshot = await getDocs(q)
    return querySnapshot.docs.map((d) => d.data() as T)
  }

  public constructQuery<T>(
    originalQuery: Query,
    queryWhere: QueryWhereElement<T>[] = [],
    order?: keyof T | Order<T>
  ): Query {
    let q: Query = originalQuery
    for (const whereOption of queryWhere) {
      q = query(
        q,
        where(
          whereOption.fieldName as string,
          whereOption.operator,
          whereOption.value
        )
      )
    }

    if (order) {
      if (typeof order === 'string') {
        q = query(q, orderBy(order))
      } else {
        const o = order as Order<T>
        q = query(q, orderBy(o.fieldName as string, o.direction))
      }
    }

    return q
  }
}
