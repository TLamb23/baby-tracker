import { useState, useCallback, useEffect } from 'react'
import Header from './components/Header.jsx'
import DailySummary from './components/DailySummary.jsx'
import FeedingList from './components/FeedingList.jsx'
import AddFeedingModal from './components/AddFeedingModal.jsx'
import LastFed from './components/LastFed.jsx'
import QuickLog from './components/QuickLog.jsx'
import { getFeedingsForDate, addFeeding, deleteFeeding, getSex, setSex, getTheme, setTheme, getLastFeeding } from './utils/storage.js'
import './App.css'

function toDateStr(date) {
  return date.toISOString().slice(0, 10)
}

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [sex, setSexState] = useState(getSex)
  const [theme, setThemeState] = useState(getTheme)

  const handleSexChange = (val) => {
    setSex(val)
    setSexState(val)
  }

  const handleThemeToggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    setThemeState(next)
    document.body.classList.toggle('dark', next === 'dark')
  }

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark')
  }, [])

  const dateStr = toDateStr(currentDate)
  const feedings = getFeedingsForDate(dateStr)
  const lastFeeding = getLastFeeding()

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

  const handleSave = useCallback((entry) => {
    addFeeding(entry)
    setRefreshKey(k => k + 1)
    setShowModal(false)
  }, [])

  const handleDelete = useCallback((id) => {
    deleteFeeding(id)
    setRefreshKey(k => k + 1)
  }, [])

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
        <QuickLog onLog={(entry) => { addFeeding(entry); setRefreshKey(k => k + 1) }} />
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
