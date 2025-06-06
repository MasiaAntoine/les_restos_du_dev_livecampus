import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Register from '../pages/register'
import Login from '../pages/login'
import Profile from '../pages/profile-menu'
import { ProtectedRoute } from './protected-route'

export default function index() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirection de la route racine vers /profile */}
        <Route path="/" element={<Navigate to="/profile" replace />} />

        {/* Routes accessibles uniquement aux utilisateurs non connectés */}
        <Route
          path="/register"
          element={
            <ProtectedRoute element={<Register />} requireAuth={false} />
          }
        />
        <Route
          path="/login"
          element={<ProtectedRoute element={<Login />} requireAuth={false} />}
        />

        {/* Routes protégées nécessitant une authentification */}
        <Route
          path="/profile"
          element={<ProtectedRoute element={<Profile />} />}
        />
      </Routes>
    </BrowserRouter>
  )
}
