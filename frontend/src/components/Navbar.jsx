import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-rose-100/60 sticky top-0 z-40 shadow-warm">
      <div className="max-w-2xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="text-rose-400 text-xl leading-none group-hover:scale-125 group-hover:text-rose-500 transition-all duration-300 inline-block">
            ♥
          </span>
          <span
            className="text-rose-900 text-xl leading-none tracking-wide"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            Nuestra Historia
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-stone-400 text-sm font-sans hidden sm:block">
                {user.display_name}
              </span>
              <button
                onClick={logout}
                className="text-stone-400 hover:text-rose-500 text-sm font-sans transition-colors duration-200"
              >
                Salir
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-sans font-medium px-5 py-2 rounded-full transition-colors duration-200 shadow-rose"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
