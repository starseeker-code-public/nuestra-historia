import { useAuth } from '../context/AuthContext'
import NewEntryModalSimple from './NewEntryModalSimple'
import NewEntryModalGuided from './NewEntryModalGuided'

export default function NewEntryModal(props) {
  const { user } = useAuth()
  if (user?.role === 'mujer') return <NewEntryModalGuided {...props} />
  return <NewEntryModalSimple {...props} />
}
