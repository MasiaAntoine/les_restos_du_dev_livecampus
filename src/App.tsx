import { useMemo } from 'react'
import Router from './router'
import { FirebaseService } from '@/services/firebase/firebase.service.tsx'
import { ServicesContext } from './contexts/contexts.tsx'
import { AuthService } from '@/services/firebase/auth.service.tsx'
import { UserService } from '@/services/firebase/user.service.tsx'

function App() {
  const firebaseService: FirebaseService = useMemo(
    () => new FirebaseService(),
    []
  )
  const authService: AuthService = useMemo(
    () => new AuthService(firebaseService),
    [firebaseService]
  )
  const userService: UserService = useMemo(
    () => new UserService(firebaseService),
    [firebaseService]
  )

  return (
    <ServicesContext.Provider
      value={{ authService: authService, userService: userService }}
      data-testid="services-context"
    >
      <Router />
    </ServicesContext.Provider>
  )
}

export default App
