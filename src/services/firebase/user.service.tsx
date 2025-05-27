import type { FirebaseService } from './firebase.service';
import type { UserModel } from '@/models/User.model.tsx';

export class UserService {
  #firebaseService: FirebaseService;

  constructor(firebaseService: FirebaseService) {
    this.#firebaseService = firebaseService;
  }

  public async getUserByUid(uid: string) {
    if (!uid) {
      return null;
    }
    const user = await this.#firebaseService.getDocument<UserModel>('USERS' + '/' + uid);
    if(!user) {
      return null;
    }
    return user;
  }

  public async createUser(user: UserModel) {
    if (!user || !user.uid) {
      throw new Error('Invalid user data');
    }

    return this.#firebaseService.setDocument('USERS' + '/' + user.uid, user);
  }
}