const ICONS = {
  breast: '🤱',
  formula: '🍼',
  solid: '🥣',
  pee: '💧',
  poo: '💩',
  mixed: '💧💩',
}

const TYPE_LABELS = {
  breast: 'Breast',
  formula: 'Formula',
  solid: 'Solid Food',
  pee: 'Pee',
  poo: 'Poo',
  mixed: 'Mixed Diaper',
}

function formatTime(isoStr) {
  return new Date(isoStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function getDetail(feeding) {
  if (feeding.type === 'breast') {
    const side = feeding.side
      ? ` · ${feeding.side.charAt(0).toUpperCase() + feeding.side.slice(1)}`
      : ''
    return `${feeding.duration} min${side}`
  }
  if (feeding.type === 'formula') {
    return `${feeding.amount} oz`
  }
  if (feeding.type === 'solid') {
    return `${feeding.food}${feeding.servingSize ? ' — ' + feeding.servingSize : ''}`
  }
  return null
}

export default function FeedingCard({ feeding, onDelete }) {
  const detail = getDetail(feeding)

  return (
    <div className="feeding-card">
      <div className={`feeding-icon ${feeding.type}`}>
        {ICONS[feeding.type]}
      </div>
      <div className="feeding-info">
        <div className="feeding-type">
          {TYPE_LABELS[feeding.type]}
          {feeding.type === 'formula' && feeding.vitamins && (
            <span className="vitamins-badge">💊 Vitamins</span>
          )}
        </div>
        {detail && <div className="feeding-detail">{detail}</div>}
        <div className="feeding-time">{formatTime(feeding.timestamp)}</div>
      </div>
      <button
        className="delete-btn"
        onClick={() => onDelete(feeding.id)}
        aria-label="Delete entry"
        title="Delete"
      >
        🗑
      </button>
    </div>
  )
}
