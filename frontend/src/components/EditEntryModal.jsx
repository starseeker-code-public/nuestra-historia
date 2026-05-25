import { useAuth } from '../context/AuthContext'
import EditEntryModalSimple from './EditEntryModalSimple'
import EditEntryModalGuided from './EditEntryModalGuided'

export default function EditEntryModal(props) {
  const { user } = useAuth()
  if (user?.role === 'mujer') return <EditEntryModalGuided {...props} />
  return <EditEntryModalSimple {...props} />
}
