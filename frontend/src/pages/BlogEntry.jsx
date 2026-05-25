import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { entriesApi } from '../api/entries'
import { useAuth } from '../context/AuthContext'
import EditEntryModal from '../components/EditEntryModal'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function Lightbox({ image, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <img
        src={`/api/images/${image.filename}`}
        alt={image.caption || ''}
        className="max-h-full max-w-full object-contain"
      />
      {image.caption && (
        <p className="absolute bottom-6 left-0 right-0 text-white/80 text-sm text-center px-6">
          {image.caption}
        </p>
      )}
      <button
        className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  )
}

function ImageGallery({ images }) {
  const [selected, setSelected] = useState(null)
  const sorted = [...images].sort((a, b) => a.order_index - b.order_index)

  return (
    <>
      {selected && <Lightbox image={selected} onClose={() => setSelected(null)} />}
      <div className="grid grid-cols-3 gap-2">
        {sorted.map((img) => (
          <div
            key={img.id}
            className="aspect-square overflow-hidden rounded-xl cursor-pointer"
            onClick={() => setSelected(img)}
          >
            <img
              src={`/api/images/${img.filename}`}
              alt={img.caption || ''}
              className="w-full h-full object-cover hover:scale-105 active:scale-95 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </>
  )
}

export default function BlogEntry() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showEdit, setShowEdit] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    entriesApi
      .get(id)
      .then((data) => setEntry(data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-rose-400 text-4xl animate-pulse">♥</div>
      </div>
    )
  }

  if (!entry) return null

  const featured = entry.images.find((img) => img.is_featured) || entry.images[0]

  return (
    <div className="max-w-2xl mx-auto pb-12">
      {featured && (
        <div className="w-full aspect-video overflow-hidden">
          <img
            src={`/api/images/${featured.filename}`}
            alt={entry.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="px-4 pt-5">
        <button
          onClick={() => navigate('/')}
          className="text-rose-400 text-sm mb-4 flex items-center gap-1 hover:text-rose-600 transition-colors"
        >
          ← Volver
        </button>

        <p className="text-rose-400 text-sm mb-1">{formatDate(entry.date)}</p>
        <h1 className="text-2xl text-stone-800 mb-2 leading-snug" style={{ fontFamily: 'Georgia, serif' }}>
          {entry.title}
        </h1>
        <p className="text-stone-400 text-sm italic mb-8 border-l-2 border-rose-200 pl-3">
          {entry.description}
        </p>

        <div className="space-y-5 mb-10">
          {entry.paragraph_hombre && (
            <div className="bg-blue-50 rounded-2xl p-4 border-l-4 border-blue-300">
              <p className="text-xs text-blue-400 font-semibold mb-2 uppercase tracking-widest">
                Él escribe
              </p>
              <p className="text-stone-700 leading-relaxed text-[15px] whitespace-pre-wrap">
                {entry.paragraph_hombre}
              </p>
            </div>
          )}
          {entry.paragraph_mujer && (
            <div className="bg-rose-50 rounded-2xl p-4 border-l-4 border-rose-300">
              <p className="text-xs text-rose-400 font-semibold mb-2 uppercase tracking-widest">
                Ella escribe
              </p>
              <p className="text-stone-700 leading-relaxed text-[15px] whitespace-pre-wrap">
                {entry.paragraph_mujer}
              </p>
            </div>
          )}
        </div>

        {entry.images.length > 0 && (
          <div className="mb-8">
            <h2 className="text-base text-stone-500 mb-3" style={{ fontFamily: 'Georgia, serif' }}>
              Fotos
            </h2>
            <ImageGallery images={entry.images} />
          </div>
        )}

        {user && (
          <div className="text-center pt-4 border-t border-stone-100">
            <button
              onClick={() => setShowEdit(true)}
              className="text-stone-400 hover:text-stone-600 text-sm transition-colors"
            >
              ✎ Editar entrada
            </button>
          </div>
        )}
      </div>

      {showEdit && (
        <EditEntryModal
          entry={entry}
          onClose={() => setShowEdit(false)}
          onUpdated={(updated) => {
            setEntry(updated)
            setShowEdit(false)
          }}
        />
      )}
    </div>
  )
}
