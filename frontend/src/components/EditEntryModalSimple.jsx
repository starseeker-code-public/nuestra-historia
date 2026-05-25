import { useState } from 'react'
import { entriesApi } from '../api/entries'
import { useAuth } from '../context/AuthContext'

export default function EditEntryModalSimple({ entry, onClose, onUpdated }) {
  const { user } = useAuth()
  const [currentEntry, setCurrentEntry] = useState(entry)
  const [title, setTitle] = useState(entry.title)
  const [description, setDescription] = useState(entry.description)
  const [date, setDate] = useState(entry.date.slice(0, 10))
  const myParagraphField = user.role === 'hombre' ? 'paragraph_hombre' : 'paragraph_mujer'
  const [myParagraph, setMyParagraph] = useState(entry[myParagraphField] || '')
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
      setError('Error al guardar los cambios.')
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

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[94vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 z-10 bg-stone-800 px-5 py-4 rounded-t-3xl sm:rounded-t-3xl flex items-center justify-between">
          <h2 className="text-white text-base font-medium font-sans tracking-wide">
            Editar recuerdo
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

          {currentEntry.images.length > 0 && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2 font-sans">
                Fotos actuales
              </label>
              <p className="text-xs text-stone-400 mb-2 font-sans">
                Toca ★ para portada · Toca × para borrar
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
                      className={`absolute bottom-1 left-1 text-xs w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-200 ${
                        img.is_featured
                          ? 'bg-rose-500 text-white'
                          : 'bg-black/40 text-white/70 hover:bg-rose-400 backdrop-blur-sm'
                      }`}
                    >
                      ★
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img.id)}
                      className="absolute top-1 right-1 bg-black/55 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2 font-sans">
              Agregar fotos
            </label>
            <label className="block border-2 border-dashed border-stone-200 rounded-2xl p-4 text-center cursor-pointer hover:border-rose-300 hover:bg-rose-50/20 transition-all duration-200">
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
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}
