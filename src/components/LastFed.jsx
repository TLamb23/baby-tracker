import { useState, useEffect } from 'react'

const TYPE_LABELS = { breast: 'Breast', formula: 'Formula', solid: 'Solid food' }
const TYPE_ICONS = { breast: '🤱', formula: '🍼', solid: '🥣' }

function elapsed(timestamp) {
  const diffMs = Date.now() - new Date(timestamp).getTime()
  const totalMins = Math.floor(diffMs / 60000)

  if (totalMins < 1) return 'Just now'
  if (totalMins < 60) return `${totalMins}m ago`

  const h = Math.floor(totalMins / 60)
  const m = totalMins % 60
  return m > 0 ? `${h}h ${m}m ago` : `${h}h ago`
}

function urgencyClass(timestamp) {
  const diffMs = Date.now() - new Date(timestamp).getTime()
  const hours = diffMs / 3600000
  if (hours >= 3) return 'urgent'
  if (hours >= 2) return 'warning'
  return 'ok'
}

export default function LastFed({ lastFeeding }) {
  const [, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30000)
    return () => clearInterval(id)
  }, [])

  if (!lastFeeding) {
    return (
      <div className="last-fed last-fed--none">
        <span className="last-fed-icon">⏱</span>
        <span className="last-fed-text">No feedings logged yet</span>
      </div>
    )
  }

  const level = urgencyClass(lastFeeding.timestamp)

  return (
    <div className={`last-fed last-fed--${level}`}>
      <span className="last-fed-icon">{TYPE_ICONS[lastFeeding.type]}</span>
      <div className="last-fed-body">
        <span className="last-fed-label">Last feeding</span>
        <span className="last-fed-elapsed">{elapsed(lastFeeding.timestamp)}</span>
      </div>
      <span className="last-fed-type">{TYPE_LABELS[lastFeeding.type]}</span>
    </div>
  )
}
