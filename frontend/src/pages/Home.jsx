import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { entriesApi } from '../api/entries'
import { useAuth } from '../context/AuthContext'
import NewEntryModal from '../components/NewEntryModal'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function EntryCard({ entry }) {
  const navigate = useNavigate()
  const featured = entry.images.find((img) => img.is_featured) || entry.images[0]

  return (
    <div
      className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-sm bg-white active:scale-95 transition-transform"
      onClick={() => navigate(`/entrada/${entry.id}`)}
    >
      <div className="overflow-hidden aspect-square">
        {featured ? (
          <img
            src={`/api/images/${featured.filename}`}
            alt={entry.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-rose-50 flex items-center justify-center">
            <span className="text-rose-200 text-5xl">♥</span>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-rose-200 text-xs mb-0.5">{formatDate(entry.date)}</p>
        <h2 className="text-white text-sm font-medium leading-tight line-clamp-2">{entry.title}</h2>
        <p className="text-gray-300 text-xs mt-1 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
          {entry.description}
        </p>
      </div>
    </div>
  )
}

export default function Home() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    entriesApi
      .list()
      .then((data) => setEntries(data))
      .finally(() => setLoading(false))
  }, [])

  const handleEntryCreated = (newEntry) => {
    setEntries((prev) => [newEntry, ...prev])
    setShowModal(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-rose-400 text-4xl animate-pulse">♥</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="text-center mb-6">
        <p className="text-stone-400 text-sm italic">Momentos que guardar para siempre</p>
      </div>

      {user && (
        <div className="text-center mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white px-6 py-2.5 rounded-full text-sm transition-colors shadow-sm"
          >
            + Nuevo recuerdo
          </button>
        </div>
      )}

      {entries.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <div className="text-6xl mb-4">♥</div>
          <p className="text-sm">Aún no hay recuerdos. ¡Crea el primero!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      {showModal && (
        <NewEntryModal onClose={() => setShowModal(false)} onCreated={handleEntryCreated} />
      )}
    </div>
  )
}
