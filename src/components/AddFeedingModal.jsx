import { useState } from 'react'

function toLocalISO(date, timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number)
  const d = new Date(date)
  d.setHours(hours, minutes, 0, 0)
  return d.toISOString()
}

function currentTimeStr() {
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

function BreastForm({ time, setTime, onSave }) {
  const [duration, setDuration] = useState('')
  const [side, setSide] = useState('both')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!duration) return
    onSave({ type: 'breast', duration: Number(duration), side, time })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Time</label>
        <input type="time" value={time} onChange={e => setTime(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Duration (minutes)</label>
        <input
          type="number"
          min="1"
          max="60"
          placeholder="e.g. 15"
          value={duration}
          onChange={e => setDuration(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Side</label>
        <select value={side} onChange={e => setSide(e.target.value)}>
          <option value="both">Both</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>
      <button type="submit" className="save-btn">Save</button>
    </form>
  )
}

function FormulaForm({ time, setTime, onSave }) {
  const [amount, setAmount] = useState('')
  const [vitamins, setVitamins] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount) return
    onSave({ type: 'formula', amount: Number(amount), vitamins, time })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Time</label>
        <input type="time" value={time} onChange={e => setTime(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Amount (oz)</label>
        <input
          type="number"
          min="0.5"
          max="16"
          step="0.5"
          placeholder="e.g. 4"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={vitamins}
            onChange={e => setVitamins(e.target.checked)}
          />
          💊 Vitamins added
        </label>
      </div>
      <button type="submit" className="save-btn">Save</button>
    </form>
  )
}

function SolidForm({ time, setTime, onSave }) {
  const [food, setFood] = useState('')
  const [servingSize, setServingSize] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!food.trim()) return
    onSave({ type: 'solid', food: food.trim(), servingSize: servingSize.trim(), time })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Time</label>
        <input type="time" value={time} onChange={e => setTime(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Food</label>
        <input
          type="text"
          placeholder="e.g. Sweet potato puree"
          value={food}
          onChange={e => setFood(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Serving Size (optional)</label>
        <input
          type="text"
          placeholder="e.g. 2 tbsp, 1 jar"
          value={servingSize}
          onChange={e => setServingSize(e.target.value)}
        />
      </div>
      <button type="submit" className="save-btn">Save</button>
    </form>
  )
}

export default function AddFeedingModal({ currentDate, onSave, onClose }) {
  const [tab, setTab] = useState('breast')
  const [time, setTime] = useState(currentTimeStr())

  const handleSave = ({ type, time: timeStr, ...rest }) => {
    const timestamp = toLocalISO(currentDate, timeStr)
    onSave({ type, timestamp, ...rest })
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>Log Feeding</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="tabs">
          <button
            className={`tab-btn ${tab === 'breast' ? 'active' : ''}`}
            onClick={() => setTab('breast')}
          >
            🤱 Breast
          </button>
          <button
            className={`tab-btn ${tab === 'formula' ? 'active' : ''}`}
            onClick={() => setTab('formula')}
          >
            🍼 Formula
          </button>
          <button
            className={`tab-btn ${tab === 'solid' ? 'active' : ''}`}
            onClick={() => setTab('solid')}
          >
            🥣 Solid
          </button>
        </div>
        {tab === 'breast' && <BreastForm time={time} setTime={setTime} onSave={handleSave} />}
        {tab === 'formula' && <FormulaForm time={time} setTime={setTime} onSave={handleSave} />}
        {tab === 'solid' && <SolidForm time={time} setTime={setTime} onSave={handleSave} />}
      </div>
    </div>
  )
}
