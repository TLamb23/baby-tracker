export default function QuickLog({ onLog }) {
  const log = (type) => onLog({ type, timestamp: new Date().toISOString() })

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
