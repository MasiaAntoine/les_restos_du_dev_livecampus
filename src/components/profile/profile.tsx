import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { ServicesContext } from '@/contexts/contexts'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const DEFAULT_AVATAR = '/default-avatar.png'

export default function ProfileComponent() {
  const navigate = useNavigate()
  const services = useContext(ServicesContext)
  const currentUser = services?.currentUser

  const handleLogout = async () => {
    try {
      await services?.authService.signOut()
      toast.success('Déconnexion réussie')
      navigate('/login')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      toast.error('Erreur lors de la déconnexion')
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="h-24 w-24" data-testid="avatar">
            <AvatarImage src={currentUser?.photoURL || DEFAULT_AVATAR} />
            <AvatarFallback>
              {currentUser?.displayName?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-2xl font-bold" data-testid="display-name">
          {currentUser?.displayName || 'Utilisateur'}
        </CardTitle>
        <CardDescription data-testid="email">
          {currentUser?.email}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">
              Informations personnelles
            </h3>
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nom d'utilisateur</p>
                  <p className="font-medium" data-testid="display-name-info">
                    {currentUser?.displayName || 'Non défini'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium" data-testid="email-info">
                    {currentUser?.email || 'Non défini'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">Préférences</h3>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Aucun paramètres de préférences définis pour le moment.
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button
          variant="destructive"
          onClick={handleLogout}
          data-testid="logout-button"
        >
          Se déconnecter
        </Button>
      </CardFooter>
    </Card>
  )
}
