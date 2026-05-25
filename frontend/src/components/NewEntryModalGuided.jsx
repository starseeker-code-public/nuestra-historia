import { useState } from 'react'
import { entriesApi } from '../api/entries'

function Step({ n, filled }) {
  return (
    <div
      className={`shrink-0 w-7 h-7 rounded-full text-sm font-semibold font-sans flex items-center justify-center mt-0.5 transition-colors duration-200 ${
        filled ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-400'
      }`}
    >
      {n}
    </div>
  )
}

export default function NewEntryModalGuided({ onClose, onCreated }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [myParagraph, setMyParagraph] = useState('')
  const [categories, setCategories] = useState('')
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const entry = await entriesApi.create({
        title,
        description,
        date: `${date}T12:00:00`,
        my_paragraph: myParagraph || null,
        categories: categories.trim() || null,
      })
      for (let i = 0; i < files.length; i++) {
        await entriesApi.uploadImage(entry.id, files[i].file, files[i].caption, i === 0, i)
      }
      const updated = await entriesApi.get(entry.id)
      onCreated(updated)
    } catch {
      setError('Ups, algo no fue bien al guardar. Inténtalo otra vez en unos segundos.')
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).map((f) => ({
      file: f,
      caption: '',
      preview: URL.createObjectURL(f),
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[94vh] overflow-y-auto scrollbar-hide shadow-2xl">

        {/* Gradient header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-5 rounded-t-3xl">
          <div className="flex items-start justify-between">
            <div>
              <h2
                className="text-white text-xl leading-tight"
                style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic' }}
              >
                Guardemos este recuerdo
              </h2>
              <p className="text-rose-200 text-xs mt-1 font-sans">Solo para nosotros dos</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white text-3xl leading-none transition-colors ml-3 -mt-0.5"
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>
        </div>

        {/* Intro */}
        <div className="px-6 py-4 bg-rose-50/50 border-b border-rose-100/60">
          <p
            className="text-stone-600 text-[15px] leading-relaxed"
            style={{ fontFamily: '"Crimson Pro", Georgia, serif' }}
          >
            Rellena cada paso con calma. Lo que escribas quedará para siempre.
            Tu pareja verá lo que has guardado y podrá añadir su parte.{' '}
            <em className="text-rose-500">¡Solo tú puedes cambiar lo que tú escribas!</em>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-7">
          {error && (
            <div className="bg-red-50 text-red-500 text-sm rounded-2xl p-4 font-sans leading-relaxed">
              {error}
            </div>
          )}

          {/* 1 - Título */}
          <div className="flex items-start gap-3">
            <Step n={1} filled={!!title} />
            <div className="flex-1">
              <label
                className="block text-rose-700 text-base font-medium mb-1"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                ¿Qué momento es?
              </label>
              <p className="text-stone-400 text-sm mb-2.5 font-sans leading-relaxed">
                Un nombre cortito. Por ejemplo:{' '}
                <em className="text-rose-400 not-italic">«Nuestro primer aniversario»</em>
              </p>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="El título de este recuerdo..."
                className="w-full border-2 border-stone-100 bg-white rounded-xl px-4 py-3 text-base font-sans text-stone-800 placeholder-stone-300 focus:outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-100/50 transition-all duration-200"
              />
            </div>
          </div>

          <div className="border-t border-rose-100/50" />

          {/* 2 - Fecha */}
          <div className="flex items-start gap-3">
            <Step n={2} filled={!!date} />
            <div className="flex-1">
              <label
                className="block text-rose-700 text-base font-medium mb-1"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                ¿Cuándo pasó?
              </label>
              <p className="text-stone-400 text-sm mb-2.5 font-sans leading-relaxed">
                Si no recuerdas el día exacto, no pasa nada — pon uno cercano.
              </p>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="flex-1 border-2 border-stone-100 bg-white rounded-xl px-4 py-3 text-base font-sans text-stone-800 focus:outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-100/50 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setDate(new Date().toISOString().slice(0, 10))}
                  className="shrink-0 bg-rose-100 hover:bg-rose-200 text-rose-600 text-sm font-medium font-sans px-4 py-3 rounded-xl transition-colors duration-200"
                >
                  Hoy
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-rose-100/50" />

          {/* 3 - Descripción */}
          <div className="flex items-start gap-3">
            <Step n={3} filled={!!description} />
            <div className="flex-1">
              <label
                className="block text-rose-700 text-base font-medium mb-1"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                Una pequeña descripción
              </label>
              <p className="text-stone-400 text-sm mb-2.5 font-sans leading-relaxed">
                Una o dos frases — esto aparece debajo de la foto en la página principal.
              </p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={2}
                placeholder="El día que fuimos a la sierra y nos perdimos buscando la cascada..."
                className="w-full border-2 border-stone-100 bg-white rounded-xl px-4 py-3 text-base font-sans text-stone-800 placeholder-stone-300 resize-none focus:outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-100/50 transition-all duration-200"
              />
            </div>
          </div>

          <div className="border-t border-rose-100/50" />

          {/* 4 - Tu parte */}
          <div className="flex items-start gap-3">
            <Step n={4} filled={!!myParagraph} />
            <div className="flex-1">
              <label
                className="block text-rose-700 text-base font-medium mb-1"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                ✨ Tu parte de la historia
              </label>
              <p className="text-stone-500 text-sm mb-3 font-sans leading-relaxed">
                Escribe{' '}
                <strong className="text-rose-500 font-medium">lo que tú recuerdas</strong> —
                lo que sentiste, los detalles que más te gustaron, lo que pensabas. Poquito o
                mucho, como te apetezca.{' '}
                <em className="text-stone-400">Esta es tu voz en nuestra historia.</em>
              </p>
              <textarea
                value={myParagraph}
                onChange={(e) => setMyParagraph(e.target.value)}
                rows={7}
                placeholder="Empieza por aquí..."
                className="w-full border-2 border-rose-200 bg-rose-50/30 rounded-xl px-4 py-3.5 text-[17px] text-stone-700 placeholder-rose-200/80 resize-none focus:outline-none focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100/50 transition-all duration-200 leading-relaxed"
                style={{ fontFamily: '"Crimson Pro", Georgia, serif' }}
              />
            </div>
          </div>

          <div className="border-t border-rose-100/50" />

          {/* 5 - Categorías */}
          <div className="flex items-start gap-3">
            <Step n={5} filled={!!categories} />
            <div className="flex-1">
              <label
                className="block text-rose-700 text-base font-medium mb-1"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                🏷️ Categorías
              </label>
              <p className="text-stone-400 text-sm mb-2.5 font-sans leading-relaxed">
                Palabras clave separadas por comas.{' '}
                <em className="text-rose-300 not-italic">«viaje, playa»</em>,{' '}
                <em className="text-rose-300 not-italic">«cena especial»</em>,{' '}
                <em className="text-rose-300 not-italic">«cumpleaños»</em>... o déjalo en blanco.
              </p>
              <input
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
                placeholder="Ej: viaje, playa, verano"
                className="w-full border-2 border-stone-100 bg-white rounded-xl px-4 py-3 text-base font-sans text-stone-800 placeholder-stone-300 focus:outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-100/50 transition-all duration-200"
              />
            </div>
          </div>

          <div className="border-t border-rose-100/50" />

          {/* 6 - Fotos + submit (same flex-1 container → same alignment) */}
          <div className="flex items-start gap-3">
            <Step n={6} filled={files.length > 0} />
            <div className="flex-1 space-y-4">
              <div>
                <label
                  className="block text-rose-700 text-base font-medium mb-1"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                >
                  📷 Las fotos
                </label>
                <p className="text-stone-400 text-sm font-sans leading-relaxed">
                  Toca abajo para elegir fotos. Puedes elegir varias a la vez.{' '}
                  <strong className="text-stone-500">La primera será la portada.</strong>
                </p>
              </div>

              <label className="block border-2 border-dashed border-rose-200 rounded-2xl p-6 text-center cursor-pointer hover:border-rose-400 hover:bg-rose-50/30 transition-all duration-200">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="text-rose-300 text-4xl mb-2">📷</div>
                <span className="text-rose-500 text-base font-sans font-medium">
                  Toca para elegir fotos
                </span>
              </label>

              {files.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {files.map((f, i) => (
                    <div key={i} className="relative aspect-square">
                      <img
                        src={f.preview}
                        alt=""
                        className="w-full h-full object-cover rounded-xl"
                      />
                      {i === 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium font-sans shadow-sm">
                          Portada
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                        className="absolute top-1.5 right-1.5 bg-black/55 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center backdrop-blur-sm"
                        aria-label="Quitar foto"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit — same width as the upload box above */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:from-rose-300 disabled:to-pink-300 text-white rounded-2xl py-4 text-base font-medium font-sans transition-all duration-200 shadow-rose hover:shadow-rose-lg"
              >
                {loading ? 'Guardando, espera...' : '💖 Guardar este recuerdo'}
              </button>

              <p className="text-stone-300 text-xs text-center font-sans italic">
                Después podrás editar todo lo que quieras tocando «Editar» en la entrada.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
