import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/')
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/')
    } catch {
      setError('Usuario o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3 text-rose-400">♥</div>
          <h1 className="text-2xl text-rose-800" style={{ fontFamily: 'Georgia, serif' }}>
            Nuestra Historia
          </h1>
          <p className="text-stone-500 text-sm mt-1">Accede para escribir y subir fotos</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-lg">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>
          )}

          <div className="mb-4">
            <label className="block text-stone-600 text-sm mb-1">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-400 transition-colors"
              required
              autoComplete="username"
            />
          </div>

          <div className="mb-6">
            <label className="block text-stone-600 text-sm mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-400 transition-colors"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
