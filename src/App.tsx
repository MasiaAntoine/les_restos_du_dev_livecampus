import { useMemo } from 'react';
import Router from './router';
import { FirebaseService } from '@/services/firebase/firebase.service.tsx';
import { AuthService } from '@/services/firebase/auth.service.tsx';
import { AuthContext } from './contexts/contexts.tsx';
import { UserService } from '@/services/firebase/user.service.tsx';

function App() {
  const firebaseService: FirebaseService = useMemo(() => new FirebaseService(), []);
  const authService: AuthService = useMemo(() => new AuthService(firebaseService), [firebaseService]);
  const userService: UserService = useMemo(() => new UserService(firebaseService), [firebaseService]);

  return (
    <AuthContext.Provider value={{ authService: authService, userService: userService }}>
      <Router/>
    </AuthContext.Provider>
  );
}

export default App;
