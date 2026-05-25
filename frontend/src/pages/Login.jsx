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
    <div className="min-h-[calc(100dvh-4rem)] bg-gradient-to-br from-rose-50 via-pink-50/60 to-amber-50/40 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-8%] right-[-4%] w-80 h-80 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-4%] left-[-4%] w-72 h-72 bg-pink-200/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative animate-fade-in">
        <div className="text-center mb-10">
          <div
            className="text-6xl mb-5 inline-block"
            style={{ animation: 'float 4s ease-in-out infinite' }}
          >
            💝
          </div>
          <h1
            className="text-4xl text-rose-900 mb-2 leading-tight"
            style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic' }}
          >
            Nuestra Historia
          </h1>
          <p
            className="text-stone-400 text-base"
            style={{ fontFamily: '"Crimson Pro", Georgia, serif', fontStyle: 'italic' }}
          >
            Un lugar solo para nosotros
          </p>
        </div>

        <div className="bg-white/85 backdrop-blur-sm rounded-3xl p-8 shadow-rose-lg border border-rose-100/50 animate-slide-up">
          {error && (
            <div className="bg-red-50 text-red-500 text-sm font-sans rounded-2xl p-3.5 mb-5 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2 font-sans">
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-2 border-stone-100 bg-stone-50/60 rounded-xl px-4 py-3 font-sans text-stone-800 text-base placeholder-stone-300 focus:outline-none focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100/50 transition-all duration-200"
                required
                autoComplete="username"
                autoCapitalize="none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2 font-sans">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-stone-100 bg-stone-50/60 rounded-xl px-4 py-3 font-sans text-stone-800 text-base placeholder-stone-300 focus:outline-none focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100/50 transition-all duration-200"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white rounded-2xl py-3.5 text-base font-medium font-sans transition-all duration-200 shadow-rose hover:shadow-rose-lg mt-2"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center text-stone-300 text-xs mt-6 font-sans" style={{ fontStyle: 'italic' }}>
          Hecho con amor ♥
        </p>
      </div>
    </div>
  )
}
