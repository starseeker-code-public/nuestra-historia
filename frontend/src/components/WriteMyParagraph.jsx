import { useState } from 'react'
import { entriesApi } from '../api/entries'
import { useAuth } from '../context/AuthContext'

export default function WriteMyParagraph({ entry, onUpdated }) {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setLoading(true)
    setError('')
    try {
      const updated = await entriesApi.update(entry.id, { my_paragraph: text })
      onUpdated(updated)
    } catch {
      setError('No se pudo guardar. Inténtalo otra vez.')
      setLoading(false)
    }
  }

  if (user.role === 'mujer') {
    return (
      <div className="relative bg-gradient-to-br from-rose-50 to-pink-50/60 rounded-3xl p-6 mb-8 border border-rose-100/60 shadow-warm overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-100/40 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">✨</span>
            <h3
              className="text-rose-700 text-xl leading-none"
              style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic' }}
            >
              Te toca a ti
            </h3>
          </div>
          <p
            className="text-stone-600 text-[16px] mb-5 leading-relaxed"
            style={{ fontFamily: '"Crimson Pro", Georgia, serif' }}
          >
            Tu pareja ya escribió su parte de este recuerdo. Ahora cuenta lo que{' '}
            <em>tú</em> recuerdas, lo que sentiste, los detalles que te hicieron sonreír...
            Escribe poco o mucho, como quieras.{' '}
            <strong className="text-rose-600 font-medium">Esta es tu voz en la historia.</strong>
          </p>

          {error && (
            <div className="bg-red-50 text-red-500 text-sm rounded-2xl p-3 mb-4 font-sans">
              {error}
            </div>
          )}

          <form onSubmit={submit}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={7}
              placeholder="Empieza por aquí..."
              className="w-full bg-white border-2 border-rose-200 rounded-2xl px-4 py-3.5 text-[17px] text-stone-700 placeholder-rose-200/80 resize-none focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100/50 transition-all duration-200 leading-relaxed"
              style={{ fontFamily: '"Crimson Pro", Georgia, serif' }}
            />
            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="w-full mt-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:from-rose-300 disabled:to-pink-300 text-white rounded-2xl py-3.5 text-base font-medium font-sans transition-all duration-200 shadow-rose hover:shadow-rose-lg"
            >
              {loading ? 'Guardando...' : '💖 Guardar mi parte'}
            </button>
            <p className="text-stone-300 text-xs text-center mt-3 font-sans italic">
              Después podrás cambiar lo que escribas si quieres.
            </p>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 rounded-2xl p-4 border-l-4 border-blue-300/70 mb-6">
      <p className="text-xs text-blue-400 font-semibold mb-2 uppercase tracking-widest font-sans">
        Tu turno
      </p>
      {error && (
        <div className="bg-red-50 text-red-500 text-sm rounded-xl p-2 mb-3 font-sans">{error}</div>
      )}
      <form onSubmit={submit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="Escribe tu parte..."
          className="w-full bg-white border-2 border-blue-100 rounded-xl px-3 py-2.5 text-base font-sans text-stone-800 resize-none focus:outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100/40 transition-all duration-200"
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="w-full mt-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-xl py-2.5 text-sm font-medium font-sans transition-all duration-200"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </div>
  )
}
