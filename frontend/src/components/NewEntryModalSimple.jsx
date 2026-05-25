import { useState } from 'react'
import { entriesApi } from '../api/entries'

export default function NewEntryModalSimple({ onClose, onCreated }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [categories, setCategories] = useState('')
  const [myParagraph, setMyParagraph] = useState('')
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
      setError('Error al guardar el recuerdo.')
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
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[94vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 z-10 bg-stone-800 px-5 py-4 rounded-t-3xl sm:rounded-t-3xl flex items-center justify-between">
          <h2
            className="text-white text-base font-medium font-sans tracking-wide"
          >
            Nuevo recuerdo
          </h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white text-2xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-500 text-sm rounded-xl p-3 font-sans">{error}</div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2 font-sans">
              Título
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border-2 border-stone-100 bg-stone-50/50 rounded-xl px-4 py-3 text-base font-sans text-stone-800 focus:outline-none focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100/40 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2 font-sans">
              Fecha
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full border-2 border-stone-100 bg-stone-50/50 rounded-xl px-4 py-3 text-base font-sans text-stone-800 focus:outline-none focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100/40 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2 font-sans">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={2}
              className="w-full border-2 border-stone-100 bg-stone-50/50 rounded-xl px-4 py-3 text-base font-sans text-stone-800 resize-none focus:outline-none focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100/40 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2 font-sans">
              Categorías
            </label>
            <input
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              placeholder="viaje, playa, aniversario..."
              className="w-full border-2 border-stone-100 bg-stone-50/50 rounded-xl px-4 py-3 text-base font-sans text-stone-800 placeholder-stone-300 focus:outline-none focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100/40 transition-all duration-200"
            />
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border-l-4 border-blue-300/70">
            <label className="block text-xs font-semibold uppercase tracking-widest text-blue-400 mb-2 font-sans">
              Tu parte
            </label>
            <textarea
              value={myParagraph}
              onChange={(e) => setMyParagraph(e.target.value)}
              rows={5}
              className="w-full bg-transparent border-2 border-blue-100 rounded-xl px-3 py-2.5 text-base font-sans text-stone-800 resize-none focus:outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100/40 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2 font-sans">
              Fotos
            </label>
            <label className="block border-2 border-dashed border-stone-200 rounded-2xl p-5 text-center cursor-pointer hover:border-rose-300 hover:bg-rose-50/20 transition-all duration-200">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="text-stone-400 text-sm font-sans">Toca para agregar fotos</span>
            </label>
            {files.length > 0 && (
              <div className="mt-2.5 grid grid-cols-3 gap-2">
                {files.map((f, i) => (
                  <div key={i} className="relative aspect-square">
                    <img
                      src={f.preview}
                      alt=""
                      className="w-full h-full object-cover rounded-xl"
                    />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-sans">
                        Portada
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                      className="absolute top-1 right-1 bg-black/55 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white rounded-2xl py-3.5 text-base font-medium font-sans transition-all duration-200 shadow-rose"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      </div>
    </div>
  )
}
