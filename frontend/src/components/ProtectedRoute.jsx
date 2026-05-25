import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-rose-400 text-4xl animate-pulse">♥</div>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" />
}
