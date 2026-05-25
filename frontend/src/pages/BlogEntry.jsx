import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { entriesApi } from '../api/entries'
import { usersApi } from '../api/users'
import { useAuth } from '../context/AuthContext'
import EditEntryModal from '../components/EditEntryModal'
import WriteMyParagraph from '../components/WriteMyParagraph'

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
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <img
        src={`/api/images/${image.filename}`}
        alt={image.caption || ''}
        className="max-h-full max-w-full object-contain rounded-xl ring-2 ring-white/10"
      />
      {image.caption && (
        <p className="absolute bottom-6 left-0 right-0 text-white/70 text-sm text-center px-6 font-sans italic">
          {image.caption}
        </p>
      )}
      <button
        className="absolute top-5 right-5 text-white/60 hover:text-white text-3xl leading-none w-10 h-10 flex items-center justify-center transition-colors"
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
      <div className="grid grid-cols-3 gap-2.5">
        {sorted.map((img) => (
          <div
            key={img.id}
            className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer
              border-2 border-rose-100/80 hover:border-rose-300
              shadow-[0_3px_18px_rgba(244,63,94,0.10)] hover:shadow-[0_8px_28px_rgba(244,63,94,0.22)]
              transition-all duration-300 hover:-translate-y-0.5"
            onClick={() => setSelected(img)}
          >
            <img
              src={`/api/images/${img.filename}`}
              alt={img.caption || ''}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-rose-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-sm">
                <span className="text-white text-base leading-none">♥</span>
              </div>
            </div>
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
  const [authors, setAuthors] = useState({ hombre: 'Él', mujer: 'Ella' })
  const { user } = useAuth()

  useEffect(() => {
    usersApi.list().then((users) => {
      const map = { hombre: 'Él', mujer: 'Ella' }
      users.forEach((u) => { map[u.role] = u.display_name })
      setAuthors(map)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    entriesApi
      .get(id)
      .then((data) => setEntry(data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] gap-3">
        <div className="text-rose-400 text-5xl animate-float">♥</div>
        <p className="text-stone-300 text-sm font-sans animate-pulse">Cargando...</p>
      </div>
    )
  }

  if (!entry) return null

  const featured = entry.images.find((img) => img.is_featured) || entry.images[0]
  const myField = user?.role === 'hombre' ? 'paragraph_hombre' : 'paragraph_mujer'
  const otherField = user?.role === 'hombre' ? 'paragraph_mujer' : 'paragraph_hombre'
  const needsMyParagraph = user && !entry[myField]

  return (
    <div className="max-w-2xl mx-auto pb-16 animate-fade-in">
      {featured ? (
        <div className="w-full aspect-video overflow-hidden relative">
          <img
            src={`/api/images/${featured.filename}`}
            alt={entry.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f7] via-transparent to-transparent" />
        </div>
      ) : (
        <div className="w-full aspect-video bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
          <span className="text-rose-200 text-8xl">♥</span>
        </div>
      )}

      <div className="px-5 pt-4">
        <button
          onClick={() => navigate('/')}
          className="text-rose-400 hover:text-rose-600 text-sm mb-5 flex items-center gap-1.5 font-sans transition-colors duration-200"
        >
          ← Volver
        </button>

        <p className="text-rose-400 text-xs font-sans uppercase tracking-widest mb-2">
          {formatDate(entry.date)}
        </p>
        <h1
          className="text-3xl text-stone-800 mb-3 leading-tight"
          style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
        >
          {entry.title}
        </h1>
        <p
          className="text-stone-500 text-lg italic mb-5 leading-relaxed"
          style={{ fontFamily: '"Crimson Pro", Georgia, serif' }}
        >
          {entry.description}
        </p>

        {entry.categories && (
          <div className="flex flex-wrap gap-2 mb-8">
            {entry.categories
              .split(',')
              .map((c) => c.trim())
              .filter(Boolean)
              .map((cat) => (
                <span
                  key={cat}
                  className="bg-rose-50 text-rose-400 text-xs px-3 py-1 rounded-full border border-rose-100 font-sans"
                >
                  {cat}
                </span>
              ))}
          </div>
        )}

        {!entry.categories && <div className="mb-8" />}

        {needsMyParagraph && (
          <WriteMyParagraph entry={entry} onUpdated={(updated) => setEntry(updated)} />
        )}

        <div className="space-y-4 mb-10">
          {entry.paragraph_hombre && (
            <div className="relative bg-slate-50/80 rounded-2xl p-5 border-l-4 border-blue-300/60 overflow-hidden">
              <span className="absolute top-3 right-4 text-blue-100/70 text-6xl leading-none font-serif select-none pointer-events-none">
                "
              </span>
              <p className="text-xs text-blue-400 font-semibold mb-3 uppercase tracking-widest font-sans">
                {authors.hombre} escribe
              </p>
              <p
                className="text-stone-700 leading-relaxed text-[17px] relative whitespace-pre-wrap"
                style={{ fontFamily: '"Crimson Pro", Georgia, serif' }}
              >
                {entry.paragraph_hombre}
              </p>
            </div>
          )}
          {entry.paragraph_mujer && (
            <div className="relative bg-rose-50/70 rounded-2xl p-5 border-l-4 border-rose-300/60 overflow-hidden">
              <span className="absolute top-3 right-4 text-rose-100/80 text-6xl leading-none font-serif select-none pointer-events-none">
                "
              </span>
              <p className="text-xs text-rose-400 font-semibold mb-3 uppercase tracking-widest font-sans">
                {authors.mujer} escribe
              </p>
              <p
                className="text-stone-700 leading-relaxed text-[17px] relative whitespace-pre-wrap"
                style={{ fontFamily: '"Crimson Pro", Georgia, serif' }}
              >
                {entry.paragraph_mujer}
              </p>
            </div>
          )}
          {!entry.paragraph_hombre && !entry.paragraph_mujer && !needsMyParagraph && (
            <p
              className="text-stone-300 text-base italic text-center py-6"
              style={{ fontFamily: '"Crimson Pro", Georgia, serif' }}
            >
              Aún no hay relatos escritos.
            </p>
          )}
          {user && entry[otherField] === null && !needsMyParagraph && (
            <p className="text-stone-300 text-sm italic text-center font-sans">
              Tu pareja todavía no ha escrito su parte.
            </p>
          )}
        </div>

        {entry.images.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-stone-100" />
              <p className="text-stone-300 text-xs font-sans uppercase tracking-widest">Fotos</p>
              <div className="h-px flex-1 bg-stone-100" />
            </div>
            <ImageGallery images={entry.images} />
          </div>
        )}

        {user && (
          <div className="text-center pt-5 border-t border-stone-100">
            <button
              onClick={() => setShowEdit(true)}
              className="text-stone-300 hover:text-rose-400 text-sm font-sans transition-colors duration-200"
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
