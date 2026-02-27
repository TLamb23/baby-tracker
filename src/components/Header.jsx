import { useState } from 'react'

function getAge(birthday) {
  const [y, m, d] = birthday.split('-').map(Number)
  const today = new Date()
  let months = (today.getFullYear() - y) * 12 + (today.getMonth() - (m - 1))
  if (today.getDate() < d) months--
  months = Math.max(0, months)
  // Count days within the current month only — never exceeds the month's length
  const days = today.getDate() < d
    ? today.getDate()          // days into current month before the birth day
    : today.getDate() - d      // days since birth day in current month
  return { months, days }
}

function parseDate(str) {
  const match = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!match) return null
  const [, m, d, y] = match
  const date = new Date(y, m - 1, d)
  if (date.getMonth() !== Number(m) - 1) return null
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export default function Header({ currentDate, onPrevDay, onNextDay, sex, onSexChange, theme, onThemeToggle, birthday, onBirthdayChange, babyName, onBabyNameChange }) {
  const [editingBirthday, setEditingBirthday] = useState(false)
  const [bdInput, setBdInput] = useState('')
  const [bdError, setBdError] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const current = new Date(currentDate)
  current.setHours(0, 0, 0, 0)

  const isToday = current.getTime() === today.getTime()

  const formatDate = (date) => {
    if (isToday) return 'Today'
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (current.getTime() === yesterday.getTime()) return 'Yesterday'
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  const age = birthday ? getAge(birthday) : null

  const startEditing = () => {
    if (birthday) {
      const [y, m, d] = birthday.split('-')
      setBdInput(`${m}/${d}/${y}`)
    } else {
      setBdInput('')
    }
    setBdError(false)
    setEditingBirthday(true)
  }

  const handleBirthdaySubmit = () => {
    const parsed = parseDate(bdInput)
    if (!parsed) { setBdError(true); return }
    onBirthdayChange(parsed)
    setEditingBirthday(false)
    setBdError(false)
  }

  const handleBirthdayKeyDown = (e) => {
    if (e.key === 'Enter') handleBirthdaySubmit()
    if (e.key === 'Escape') setEditingBirthday(false)
  }

  const startEditingName = () => {
    setNameInput(babyName || '')
    setEditingName(true)
  }

  const handleNameSubmit = () => {
    const trimmed = nameInput.trim()
    if (trimmed) onBabyNameChange(trimmed)
    setEditingName(false)
  }

  const handleNameKeyDown = (e) => {
    if (e.key === 'Enter') handleNameSubmit()
    if (e.key === 'Escape') setEditingName(false)
  }

  return (
    <header className="header">
      <div className="header-top">
        <h1>🍼 Baby Food Tracker</h1>
        <button
          className="theme-toggle-btn"
          onClick={onThemeToggle}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="name-row">
        {editingName ? (
          <div className="birthday-edit">
            <input
              type="text"
              className="birthday-input"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={handleNameKeyDown}
              placeholder="Baby's name"
              maxLength={30}
              autoFocus
            />
            <button className="birthday-save-btn" onClick={handleNameSubmit}>Save</button>
            <button className="birthday-cancel-btn" onClick={() => setEditingName(false)}>✕</button>
          </div>
        ) : babyName ? (
          <button className="baby-name-display" onClick={startEditingName} title="Change name">
            {babyName}
          </button>
        ) : (
          <button className="baby-name-display baby-name-display--empty" onClick={startEditingName}>
            + Add baby's name
          </button>
        )}
      </div>

      <div className="age-row">
        {editingBirthday ? (
          <div className="birthday-edit">
            <input
              type="text"
              className={`birthday-input${bdError ? ' birthday-input--error' : ''}`}
              value={bdInput}
              onChange={e => { setBdInput(e.target.value); setBdError(false) }}
              onKeyDown={handleBirthdayKeyDown}
              placeholder="mm/dd/yyyy"
              autoFocus
            />
            <button className="birthday-save-btn" onClick={handleBirthdaySubmit}>Save</button>
            <button className="birthday-cancel-btn" onClick={() => setEditingBirthday(false)}>✕</button>
          </div>
        ) : age !== null ? (
          <button className="age-display" onClick={startEditing} title="Change birthday">
            🎂 {age.months} {age.months === 1 ? 'month' : 'months'}{age.days > 0 ? ` and ${age.days} ${age.days === 1 ? 'day' : 'days'}` : ''} old
          </button>
        ) : (
          <button className="age-display age-display--empty" onClick={startEditing}>
            + Set baby's birthday
          </button>
        )}
      </div>

      <div className="date-nav">
        <button onClick={onPrevDay} aria-label="Previous day">←</button>
        <span className="date-label">{formatDate(currentDate)}</span>
        <button
          onClick={onNextDay}
          disabled={isToday}
          aria-label="Next day"
          style={{ opacity: isToday ? 0.4 : 1, cursor: isToday ? 'default' : 'pointer' }}
        >
          →
        </button>
      </div>
      <div className="sex-toggle">
        <button
          className={`sex-btn ${sex === 'girl' ? 'active' : ''}`}
          onClick={() => onSexChange('girl')}
        >
          ♀ Girl
        </button>
        <button
          className={`sex-btn ${sex === 'boy' ? 'active' : ''}`}
          onClick={() => onSexChange('boy')}
        >
          ♂ Boy
        </button>
      </div>
    </header>
  )
}
