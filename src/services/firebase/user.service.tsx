import type { FirebaseService } from './firebase.service';

export class UserService {
  #firebaseService: FirebaseService;

  constructor(firebaseService: FirebaseService) {
    this.#firebaseService = firebaseService;
  }

  public async getUserByUid(uid: string) {
    if (!uid) {
      return null;
    }

    const userDoc = await this.#firebaseService.getDocument('USERS' + '/' + uid);
    console.log(userDoc);
    return;
  }

  public async createUser(data: any) {
    if (!data || !data.uid) {
      throw new Error('Invalid user data');
    }

    return this.#firebaseService.setDocument('USERS' + '/' + data.uid, data);
  }
}