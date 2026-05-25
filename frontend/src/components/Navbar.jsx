import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white border-b border-rose-100 sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-rose-800 text-lg" style={{ fontFamily: 'Georgia, serif' }}>
          ♥ Nuestra Historia
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-stone-500 text-sm">{user.display_name}</span>
              <button
                onClick={logout}
                className="text-stone-400 hover:text-stone-600 text-sm transition-colors"
              >
                Salir
              </button>
            </>
          ) : (
            <Link to="/login" className="text-rose-500 hover:text-rose-700 text-sm transition-colors">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
