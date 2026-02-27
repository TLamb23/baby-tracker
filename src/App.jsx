import { useState, useCallback, useEffect } from 'react'
import Header from './components/Header.jsx'
import DailySummary from './components/DailySummary.jsx'
import FeedingList from './components/FeedingList.jsx'
import AddFeedingModal from './components/AddFeedingModal.jsx'
import LastFed from './components/LastFed.jsx'
import QuickLog from './components/QuickLog.jsx'
import { getFeedingsForDate, addFeeding, deleteFeeding, getSex, setSex, getTheme, setTheme, getLastFeeding } from './utils/api.js'
import './App.css'

function toDateStr(date) {
  return date.toISOString().slice(0, 10)
}

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [feedings, setFeedings] = useState([])
  const [lastFeeding, setLastFeeding] = useState(null)
  const [sex, setSexState] = useState('girl')
  const [theme, setThemeState] = useState('light')

  const dateStr = toDateStr(currentDate)

  const refresh = useCallback(async () => {
    const [dayFeedings, last] = await Promise.all([
      getFeedingsForDate(dateStr),
      getLastFeeding(),
    ])
    setFeedings(dayFeedings)
    setLastFeeding(last)
  }, [dateStr])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    Promise.all([getSex(), getTheme()]).then(([s, t]) => {
      setSexState(s)
      setThemeState(t)
      document.body.classList.toggle('dark', t === 'dark')
    })
  }, [])

  const handleSexChange = async (val) => {
    await setSex(val)
    setSexState(val)
  }

  const handleThemeToggle = async () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    await setTheme(next)
    setThemeState(next)
    document.body.classList.toggle('dark', next === 'dark')
  }

  const handlePrevDay = () => {
    setCurrentDate(d => {
      const prev = new Date(d)
      prev.setDate(prev.getDate() - 1)
      return prev
    })
  }

  const handleNextDay = () => {
    setCurrentDate(d => {
      const next = new Date(d)
      next.setDate(next.getDate() + 1)
      return next
    })
  }

  const handleSave = useCallback(async (entry) => {
    await addFeeding(entry)
    await refresh()
    setShowModal(false)
  }, [refresh])

  const handleDelete = useCallback(async (id) => {
    await deleteFeeding(id)
    await refresh()
  }, [refresh])

  const handleQuickLog = useCallback(async (entry) => {
    await addFeeding(entry)
    await refresh()
  }, [refresh])

  const sortedFeedings = [...feedings].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  )

  return (
    <div className={`app theme-${sex} ${theme === 'dark' ? 'dark' : ''}`}>
      <Header
        currentDate={currentDate}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
        sex={sex}
        onSexChange={handleSexChange}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />
      <main className="main">
        <LastFed lastFeeding={lastFeeding} />
        <QuickLog onLog={handleQuickLog} />
        <DailySummary feedings={feedings} />
        <button className="add-btn" onClick={() => setShowModal(true)}>
          + Log Feeding
        </button>
        <FeedingList feedings={sortedFeedings} onDelete={handleDelete} />
      </main>
      {showModal && (
        <AddFeedingModal
          currentDate={currentDate}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
