import { useMemo } from 'react';
import Router from './router';
import { FirebaseService } from '@/services/firebase/firebase.service';
import { AuthService } from '@/services/firebase/auth.service';
import { AuthContext } from './contexts/contexts.tsx';

function App() {
  const firebaseService: FirebaseService = useMemo(() => new FirebaseService(), []);
  const authService: AuthService = useMemo(() => new AuthService(firebaseService), [firebaseService]);

  return (
    <AuthContext.Provider value={ authService }>
      <Router/>
    </AuthContext.Provider>
  );
}

export default App;
