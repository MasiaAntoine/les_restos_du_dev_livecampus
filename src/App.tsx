import { useMemo, useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import Router from './router'
import { FirebaseService } from '@/services/firebase/firebase.service.tsx'
import { ServicesContext } from './contexts/contexts.tsx'
import { AuthService } from '@/services/firebase/auth.service.tsx'
import { UserService } from '@/services/firebase/user.service.tsx'
import { IngredientsService } from '@/services/firebase/ingredients.service.ts'
import { RecipesService } from '@/services/firebase/recipes.service.ts'
import type { UserModel } from '@/models/User.model.ts'
import { Toaster } from '@/components/ui/sonner'
import Loading from '@/components/loading/loading'

function App() {
  const [currentUser, setCurrentUser] = useState<UserModel | null>(null)
  const [loading, setLoading] = useState(true)

  const firebaseService: FirebaseService = useMemo(
    () => new FirebaseService(),
    []
  )
  const userService: UserService = useMemo(
    () => new UserService(firebaseService),
    [firebaseService]
  )
  const authService: AuthService = useMemo(
    () => new AuthService(firebaseService, setCurrentUser, userService),
    [firebaseService, userService]
  )
  const ingredientsService = useMemo(
    () => new IngredientsService(firebaseService),
    [firebaseService]
  )
  const recipesService = useMemo(
    () => new RecipesService(firebaseService),
    [firebaseService]
  )

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseService.getFireAuth(),
      async (firebaseUser) => {
        if (firebaseUser) {
          const user = await userService.getUserByUid(firebaseUser.uid)
          setCurrentUser(user)
        } else {
          setCurrentUser(null)
        }
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [firebaseService, userService])

  if (loading) {
    return <Loading />
  }

  return (
    <ServicesContext.Provider
      value={{
        authService: authService,
        userService: userService,
        ingredientsService: ingredientsService,
        recipesService: recipesService,
        currentUser: currentUser,
      }}
      data-testid="services-context"
    >
      <Router />
      <Toaster />
    </ServicesContext.Provider>
  )
  )
}

export default App
