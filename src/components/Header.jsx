export default function Header({ currentDate, onPrevDay, onNextDay, sex, onSexChange, theme, onThemeToggle }) {
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
