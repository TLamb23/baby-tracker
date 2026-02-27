export default function QuickLog({ onLog }) {
  const log = (type) => {
    const now = new Date()
    const y = now.getFullYear()
    const mo = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    const h = String(now.getHours()).padStart(2, '0')
    const mi = String(now.getMinutes()).padStart(2, '0')
    onLog({ type, timestamp: `${y}-${mo}-${d}T${h}:${mi}:00` })
  }

  return (
    <div className="quick-log">
      <span className="quick-log-label">Potty</span>
      <div className="quick-log-btns">
        <button className="quick-btn quick-btn--pee" onClick={() => log('pee')}>
          💧 Pee
        </button>
        <button className="quick-btn quick-btn--poo" onClick={() => log('poo')}>
          💩 Poo
        </button>
      </div>
    </div>
  )
}
