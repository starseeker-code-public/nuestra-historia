import { useState } from 'react'
import { entriesApi } from '../api/entries'
import { useAuth } from '../context/AuthContext'

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

export default function EditEntryModalGuided({ entry, onClose, onUpdated }) {
  const { user } = useAuth()
  const [currentEntry, setCurrentEntry] = useState(entry)
  const [title, setTitle] = useState(entry.title)
  const [description, setDescription] = useState(entry.description)
  const [date, setDate] = useState(entry.date.slice(0, 10))
  const myField = user.role === 'hombre' ? 'paragraph_hombre' : 'paragraph_mujer'
  const [myParagraph, setMyParagraph] = useState(entry[myField] || '')
  const [categories, setCategories] = useState(entry.categories || '')
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await entriesApi.update(entry.id, {
        title,
        description,
        date: `${date}T12:00:00`,
        my_paragraph: myParagraph || null,
        categories: categories.trim() || null,
      })
      const nextIndex = currentEntry.images.length
      for (let i = 0; i < files.length; i++) {
        await entriesApi.uploadImage(entry.id, files[i].file, files[i].caption, false, nextIndex + i)
      }
      const updated = await entriesApi.get(entry.id)
      onUpdated(updated)
    } catch {
      setError('Ups, algo no fue bien al guardar. Inténtalo otra vez.')
      setLoading(false)
    }
  }

  const handleDeleteImage = async (imageId) => {
    await entriesApi.deleteImage(imageId)
    const updated = await entriesApi.get(currentEntry.id)
    setCurrentEntry(updated)
  }

  const handleSetFeatured = async (imageId) => {
    await entriesApi.setFeaturedImage(imageId, currentEntry.id)
    const updated = await entriesApi.get(currentEntry.id)
    setCurrentEntry(updated)
  }

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).map((f) => ({
      file: f,
      caption: '',
      preview: URL.createObjectURL(f),
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }

  const hasImages = currentEntry.images.length > 0
  const addPhotosStep = hasImages ? 7 : 6

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
                Editar recuerdo
              </h2>
              <p className="text-rose-200 text-xs mt-1 font-sans">Lo tuyo es solo tuyo</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white text-3xl leading-none transition-colors ml-3 -mt-0.5"
            >
              ×
            </button>
          </div>
        </div>

        <div className="px-6 py-4 bg-rose-50/50 border-b border-rose-100/60">
          <p
            className="text-stone-600 text-[15px] leading-relaxed"
            style={{ fontFamily: '"Crimson Pro", Georgia, serif' }}
          >
            Puedes cambiar el título, la fecha, la descripción,{' '}
            <strong className="text-rose-500">tu parte</strong> y las fotos.{' '}
            <em className="text-stone-400">
              Lo que escribió tu pareja no se puede modificar — eso es solo suyo.
            </em>
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
                className="block text-rose-700 text-base font-medium mb-2"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                Título
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border-2 border-stone-100 bg-white rounded-xl px-4 py-3 text-base font-sans text-stone-800 focus:outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-100/50 transition-all duration-200"
              />
            </div>
          </div>

          <div className="border-t border-rose-100/50" />

          {/* 2 - Fecha */}
          <div className="flex items-start gap-3">
            <Step n={2} filled={!!date} />
            <div className="flex-1">
              <label
                className="block text-rose-700 text-base font-medium mb-2"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                Fecha
              </label>
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
                className="block text-rose-700 text-base font-medium mb-2"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={2}
                className="w-full border-2 border-stone-100 bg-white rounded-xl px-4 py-3 text-base font-sans text-stone-800 resize-none focus:outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-100/50 transition-all duration-200"
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
              <p className="text-stone-400 text-sm mb-3 font-sans leading-relaxed">
                Cambia o añade lo que tú quieras contar de este momento.
              </p>
              <textarea
                value={myParagraph}
                onChange={(e) => setMyParagraph(e.target.value)}
                rows={7}
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
                Palabras clave separadas por comas. Ej:{' '}
                <em className="text-rose-300 not-italic">«viaje, playa»</em>
              </p>
              <input
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
                placeholder="Ej: viaje, playa, verano"
                className="w-full border-2 border-stone-100 bg-white rounded-xl px-4 py-3 text-base font-sans text-stone-800 placeholder-stone-300 focus:outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-100/50 transition-all duration-200"
              />
            </div>
          </div>

          {hasImages && (
            <>
              <div className="border-t border-rose-100/50" />
              <div className="flex items-start gap-3">
                <Step n={6} filled />
                <div className="flex-1">
                  <label
                    className="block text-rose-700 text-base font-medium mb-1"
                    style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                  >
                    Fotos guardadas
                  </label>
                  <p className="text-stone-400 text-sm mb-3 font-sans leading-relaxed">
                    Toca <strong>★</strong> para portada · Toca <strong>×</strong> para borrar.
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {currentEntry.images.map((img) => (
                      <div key={img.id} className="relative aspect-square">
                        <img
                          src={`/api/images/${img.filename}`}
                          alt=""
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => handleSetFeatured(img.id)}
                          className={`absolute bottom-1.5 left-1.5 text-sm w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                            img.is_featured
                              ? 'bg-rose-500 text-white shadow-sm'
                              : 'bg-black/40 text-white/70 hover:bg-rose-400 backdrop-blur-sm'
                          }`}
                        >
                          ★
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.id)}
                          className="absolute top-1.5 right-1.5 bg-black/50 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center backdrop-blur-sm"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="border-t border-rose-100/50" />

          {/* Add photos + submit (same flex-1 container → same alignment) */}
          <div className="flex items-start gap-3">
            <Step n={addPhotosStep} filled={files.length > 0} />
            <div className="flex-1 space-y-4">
              <div>
                <label
                  className="block text-rose-700 text-base font-medium mb-1"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                >
                  📷 Agregar más fotos
                </label>
              </div>

              <label className="block border-2 border-dashed border-rose-200 rounded-2xl p-5 text-center cursor-pointer hover:border-rose-400 hover:bg-rose-50/30 transition-all duration-200">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="text-rose-300 text-3xl mb-1">📷</div>
                <span className="text-rose-500 text-sm font-sans font-medium">
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
                      <button
                        type="button"
                        onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                        className="absolute top-1.5 right-1.5 bg-black/50 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center"
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
                {loading ? 'Guardando, espera...' : '💖 Guardar los cambios'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
