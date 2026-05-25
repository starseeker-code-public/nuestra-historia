import { useState } from 'react'
import { entriesApi } from '../api/entries'

export default function NewEntryModal({ onClose, onCreated }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [paragraphHombre, setParagraphHombre] = useState('')
  const [paragraphMujer, setParagraphMujer] = useState('')
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
        paragraph_hombre: paragraphHombre || null,
        paragraph_mujer: paragraphMujer || null,
      })
      for (let i = 0; i < files.length; i++) {
        await entriesApi.uploadImage(entry.id, files[i].file, files[i].caption, i === 0, i)
      }
      const updated = await entriesApi.get(entry.id)
      onCreated(updated)
    } catch {
      setError('Error al guardar el recuerdo. Inténtalo de nuevo.')
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

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-stone-100 px-4 py-3 flex items-center justify-between rounded-t-3xl sm:rounded-t-2xl">
          <h2 className="text-rose-800 text-base" style={{ fontFamily: 'Georgia, serif' }}>
            Nuevo recuerdo
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-2xl leading-none">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3">{error}</div>}

          <div>
            <label className="block text-sm text-stone-600 mb-1">Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-400"
              placeholder="Un día especial..."
            />
          </div>

          <div>
            <label className="block text-sm text-stone-600 mb-1">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-400"
            />
          </div>

          <div>
            <label className="block text-sm text-stone-600 mb-1">Descripción breve</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={2}
              className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-rose-400"
              placeholder="Una pequeña descripción de este momento..."
            />
          </div>

          <div className="bg-blue-50 rounded-2xl p-3 border-l-4 border-blue-300">
            <label className="block text-sm text-blue-500 mb-1 font-medium">Él escribe</label>
            <textarea
              value={paragraphHombre}
              onChange={(e) => setParagraphHombre(e.target.value)}
              rows={4}
              className="w-full bg-transparent border border-blue-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-blue-400"
              placeholder="Lo que este momento significó para mí..."
            />
          </div>

          <div className="bg-rose-50 rounded-2xl p-3 border-l-4 border-rose-300">
            <label className="block text-sm text-rose-400 mb-1 font-medium">Ella escribe</label>
            <textarea
              value={paragraphMujer}
              onChange={(e) => setParagraphMujer(e.target.value)}
              rows={4}
              className="w-full bg-transparent border border-rose-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-rose-400"
              placeholder="Lo que este momento significó para mí..."
            />
          </div>

          <div>
            <label className="block text-sm text-stone-600 mb-2">Fotos</label>
            <label className="block border-2 border-dashed border-stone-200 rounded-2xl p-5 text-center cursor-pointer hover:border-rose-300 transition-colors active:bg-stone-50">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="text-stone-300 text-3xl mb-1">📷</div>
              <span className="text-stone-400 text-sm">Toca para agregar fotos</span>
            </label>
            {files.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {files.map((f, i) => (
                  <div key={i} className="relative aspect-square">
                    <img
                      src={f.preview}
                      alt=""
                      className="w-full h-full object-cover rounded-xl"
                    />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        Portada
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center"
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
            className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white rounded-xl py-3 text-sm font-medium transition-colors"
          >
            {loading ? 'Guardando...' : 'Guardar recuerdo ♥'}
          </button>
        </form>
      </div>
    </div>
  )
}
