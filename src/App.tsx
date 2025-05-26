import { useMemo } from 'react';
import Router from './router';
import { FirebaseService } from '@/services/firebase/firebase.service';
import { AuthService } from '@/services/firebase/auth.service';
import { ServiceContext } from '@/contexts/service.context';

function App() {
  const firebaseService: FirebaseService = useMemo(() => new FirebaseService(), []);
  const authService: AuthService = useMemo(() => new AuthService(firebaseService), [firebaseService]);

  return (
    <ServiceContext.Provider value={{ authService }}>
      <Router/>
    </ServiceContext.Provider>
  );
}

export default App;
