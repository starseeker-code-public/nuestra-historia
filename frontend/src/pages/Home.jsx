import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { entriesApi } from '../api/entries'
import { usersApi } from '../api/users'
import { useAuth } from '../context/AuthContext'
import NewEntryModal from '../components/NewEntryModal'

function formatDateShort(dateStr) {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    month: 'short',
    year: 'numeric',
  })
}

function FloatingElements() {
  const els = [
    { top: '6%',  pos: { left: '2%' },    s: 22, d: 0,    dur: 9,    ch: '♥', c: '#fb7185' },
    { top: '20%', pos: { right: '3%' },   s: 14, d: 2.8,  dur: 7.5,  ch: '♥', c: '#f472b6' },
    { top: '37%', pos: { left: '0.5%' },  s: 26, d: 5.1,  dur: 11,   ch: '♥', c: '#fb7185' },
    { top: '54%', pos: { right: '1.5%' }, s: 16, d: 1.2,  dur: 8.5,  ch: '♥', c: '#fb7185' },
    { top: '70%', pos: { left: '4%' },    s: 12, d: 3.6,  dur: 10,   ch: '♥', c: '#f472b6' },
    { top: '85%', pos: { right: '6%' },   s: 19, d: 7.1,  dur: 12,   ch: '♥', c: '#fb7185' },
    { top: '13%', pos: { left: '12%' },   s: 10, d: 1.5,  dur: 8,    ch: '✦', c: '#fb7185' },
    { top: '43%', pos: { right: '14%' },  s: 9,  d: 4.1,  dur: 9.5,  ch: '✦', c: '#f472b6' },
    { top: '67%', pos: { left: '18%' },   s: 8,  d: 6.7,  dur: 11.5, ch: '✦', c: '#fb7185' },
    { top: '29%', pos: { right: '18%' },  s: 7,  d: 3.2,  dur: 10,   ch: '✦', c: '#fb7185' },
    { top: '78%', pos: { left: '9%' },    s: 11, d: 5.7,  dur: 8.5,  ch: '✦', c: '#f472b6' },
  ]
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none" aria-hidden>
      {els.map((el, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            top: el.top,
            ...el.pos,
            fontSize: el.s,
            color: el.c,
            display: 'inline-block',
            animation: `drift ${el.dur}s ease-in-out ${el.d}s infinite`,
          }}
        >
          {el.ch}
        </span>
      ))}
    </div>
  )
}

function EntryCard({ entry, isPending, wide }) {
  const navigate = useNavigate()
  const featured = entry.images.find((img) => img.is_featured) || entry.images[0]

  return (
    <div
      className={`group relative overflow-hidden cursor-pointer bg-white transition-all duration-300 active:scale-[0.97]
        rounded-2xl shadow-warm hover:shadow-rose-lg hover:-translate-y-0.5
        ${wide ? 'col-span-2' : ''}`}
      onClick={() => navigate(`/entrada/${entry.id}`)}
    >
      <div className={`overflow-hidden ${wide ? 'aspect-video' : 'aspect-[3/4]'}`}>
        {featured ? (
          <img
            src={`/api/images/${featured.filename}`}
            alt={entry.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 flex items-center justify-center">
            <span
              className="text-rose-300 text-5xl"
              style={{ animation: 'pulseHeart 2.5s ease-in-out infinite' }}
            >
              ♥
            </span>
          </div>
        )}
      </div>

      {isPending && (
        <span className="absolute top-2.5 right-2.5 bg-amber-400 text-white text-[10px] px-2.5 py-1 rounded-full font-semibold font-sans shadow-sm z-10">
          Te toca ✍
        </span>
      )}

      {/* Always-visible gradient — darker on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Heart icon appears on hover */}
      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
        <span className="text-white/80 text-sm drop-shadow">♥</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3.5">
        <div className="inline-flex items-center gap-1 mb-1.5">
          <span className="text-rose-300/80 text-[10px] font-sans uppercase tracking-wider">
            {formatDateShort(entry.date)}
          </span>
        </div>
        <h2
          className="text-white text-[13px] font-medium leading-tight line-clamp-2"
          style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
        >
          {entry.title}
        </h2>
      </div>
    </div>
  )
}

function PendingSection({ pending, user }) {
  if (user.role === 'mujer') {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-500 to-pink-500 rounded-3xl p-6 mb-8 shadow-rose-lg">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-2xl">✨</span>
            <h2
              className="text-white text-xl leading-none"
              style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic' }}
            >
              {pending.length === 1
                ? 'Te está esperando un recuerdo'
                : `Te esperan ${pending.length} recuerdos`}
            </h2>
          </div>
          <p
            className="text-rose-100 text-[15px] mb-5 leading-relaxed"
            style={{ fontFamily: '"Crimson Pro", Georgia, serif' }}
          >
            Tu pareja ya guardó{' '}
            {pending.length === 1 ? 'este momento' : 'estos momentos'} para los dos. Solo falta
            tu parte — lo que tú viviste, lo que sentiste, lo que no quieres olvidar.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {pending.map((entry) => (
              <EntryCard key={entry.id} entry={entry} isPending />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <p className="text-amber-600 text-xs font-semibold uppercase tracking-widest font-sans">
          {pending.length} pendiente{pending.length > 1 ? 's' : ''}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {pending.map((entry) => (
          <EntryCard key={entry.id} entry={entry} isPending />
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  const [entries, setEntries] = useState([])
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const [authors, setAuthors] = useState({ hombre: '', mujer: '' })
  const { user } = useAuth()

  useEffect(() => {
    usersApi.list().then((users) => {
      const map = { hombre: '', mujer: '' }
      users.forEach((u) => { map[u.role] = u.display_name })
      setAuthors(map)
    }).catch(() => {})
  }, [])

  const reload = async () => {
    const list = await entriesApi.list()
    setEntries(list)
    if (user) {
      const pend = await entriesApi.listPending().catch(() => [])
      setPending(pend)
    } else {
      setPending([])
    }
  }

  useEffect(() => {
    reload().finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleEntryCreated = () => {
    setShowModal(false)
    reload()
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] gap-3">
        <div className="text-rose-400 text-5xl animate-float">♥</div>
        <p className="text-stone-300 text-sm font-sans animate-pulse">Cargando recuerdos...</p>
      </div>
    )
  }

  const pendingIds = new Set(pending.map((e) => e.id))

  const allCategories = [
    ...new Set(
      entries.flatMap((e) =>
        e.categories ? e.categories.split(',').map((c) => c.trim()).filter(Boolean) : []
      )
    ),
  ].sort()

  const filterByCategory = (e) => {
    if (!activeCategory) return true
    if (!e.categories) return false
    return e.categories.split(',').map((c) => c.trim()).includes(activeCategory)
  }

  const nonPending = entries.filter((e) => !pendingIds.has(e.id) && filterByCategory(e))
  const visiblePending = pending.filter(filterByCategory)

  return (
    <>
      <FloatingElements />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6">

        {/* Romantic header */}
        <header className="text-center mb-10">
          {/* Top label */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-14 bg-gradient-to-r from-transparent via-rose-200 to-rose-300/70" />
            <span className="text-rose-300/80 text-xs tracking-[0.4em] uppercase font-sans select-none">
              nuestra historia
            </span>
            <div className="h-px w-14 bg-gradient-to-l from-transparent via-rose-200 to-rose-300/70" />
          </div>

          {/* Couple names card */}
          {authors.hombre && authors.mujer && (
            <div className="relative inline-block mb-5 px-8 py-6 rounded-[2rem] bg-gradient-to-br from-white via-rose-50/50 to-pink-50/40 border border-rose-100 shadow-[0_4px_32px_rgba(244,63,94,0.09)]">
              <span className="absolute top-3 left-4 text-rose-200/90 text-[11px]">✦</span>
              <span className="absolute top-3 right-4 text-rose-200/90 text-[11px]">✦</span>
              <span className="absolute bottom-3 left-4 text-rose-200/90 text-[11px]">✦</span>
              <span className="absolute bottom-3 right-4 text-rose-200/90 text-[11px]">✦</span>
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className="text-stone-700 text-[27px] tracking-wide leading-tight"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                >
                  {authors.hombre}
                </span>
                <span
                  className="text-rose-400 text-[30px] leading-none inline-block"
                  style={{ animation: 'pulseHeart 2.2s ease-in-out infinite' }}
                >
                  ♥
                </span>
                <span
                  className="text-stone-700 text-[27px] tracking-wide leading-tight"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                >
                  {authors.mujer}
                </span>
              </div>
            </div>
          )}

          {/* Tagline */}
          <p
            className="text-stone-400 text-[17px] italic mb-5"
            style={{ fontFamily: '"Crimson Pro", Georgia, serif' }}
          >
            Momentos que guardar para siempre
          </p>

          {/* Bottom ornament */}
          <div className="flex items-center justify-center gap-1.5">
            <div className="h-px w-6 bg-gradient-to-r from-transparent to-rose-200" />
            <span className="text-rose-200/80 text-[9px]">♥</span>
            <div className="h-px w-10 bg-rose-200/60" />
            <span className="text-rose-300/70 text-[10px]">✦</span>
            <div className="h-px w-10 bg-rose-200/60" />
            <span className="text-rose-200/80 text-[9px]">♥</span>
            <div className="h-px w-6 bg-gradient-to-l from-transparent to-rose-200" />
          </div>
        </header>

        {user && (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowModal(true)}
              className="relative overflow-hidden bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:scale-95 text-white px-9 py-3.5 rounded-full text-sm font-sans font-medium transition-all duration-200 shadow-rose-lg hover:shadow-[0_8px_28px_rgba(244,63,94,0.35)] hover:scale-105"
            >
              <span className="mr-2 opacity-75">✦</span>
              Nuevo recuerdo
              <span className="ml-2 opacity-75">✦</span>
            </button>
          </div>
        )}

        {allCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-sans transition-all duration-200 ${
                activeCategory === null
                  ? 'bg-rose-500 text-white shadow-rose'
                  : 'bg-white text-stone-400 border border-stone-100 hover:border-rose-200 hover:text-rose-400'
              }`}
            >
              Todos
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-sans transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-rose-500 text-white shadow-rose'
                    : 'bg-white text-stone-400 border border-stone-100 hover:border-rose-200 hover:text-rose-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {user && visiblePending.length > 0 && (
          <PendingSection pending={visiblePending} user={user} />
        )}

        {entries.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-7xl mb-6 animate-float">♥</div>
            <p
              className="text-stone-400 text-xl italic mb-2"
              style={{ fontFamily: '"Crimson Pro", Georgia, serif' }}
            >
              Aún no hay recuerdos guardados.
            </p>
            {user && (
              <p className="text-stone-300 text-sm font-sans">
                ¡Crea el primero y empieza vuestra historia!
              </p>
            )}
          </div>
        ) : nonPending.length === 0 && visiblePending.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <p className="text-sm font-sans">No hay recuerdos con esa categoría.</p>
          </div>
        ) : (
          <>
            {visiblePending.length > 0 && nonPending.length > 0 && (
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px flex-1 bg-stone-100" />
                <p className="text-stone-300 text-xs font-sans uppercase tracking-widest">
                  Todos los recuerdos
                </p>
                <div className="h-px flex-1 bg-stone-100" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {nonPending.map((entry, index) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  wide={index === 0 && nonPending.length >= 2}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {showModal && (
        <NewEntryModal onClose={() => setShowModal(false)} onCreated={handleEntryCreated} />
      )}
    </>
  )
}
