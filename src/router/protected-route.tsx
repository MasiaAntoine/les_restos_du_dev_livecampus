import { useNavigate } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import { ServicesContext } from '../contexts/contexts.tsx'

interface ProtectedRouteProps {
  element: JSX.Element
  requireAuth?: boolean
}

export const ProtectedRoute = ({
  element,
  requireAuth = true,
}: ProtectedRouteProps) => {
  const services = useContext(ServicesContext)
  const currentUser = services?.currentUser
  const navigate = useNavigate()

  useEffect(() => {
    if (!services) return

    if (requireAuth && !currentUser) {
      navigate('/login')
    } else if (!requireAuth && currentUser) {
      navigate('/profile')
    }
  }, [services, currentUser, navigate, requireAuth])

  // On retourne l'élément si les conditions sont remplies
  if (requireAuth && !currentUser) return null
  if (!requireAuth && currentUser) return null

  return element
}
