export default function DailySummary({ feedings }) {
  const breastCount = feedings.filter(f => f.type === 'breast').length
  const formulaFeedings = feedings.filter(f => f.type === 'formula')
  const formulaOz = formulaFeedings.reduce((sum, f) => sum + (f.amount || 0), 0)
  const solidFeedings = feedings.filter(f => f.type === 'solid')
  const peeCount = feedings.filter(f => f.type === 'pee' || f.type === 'mixed').length
  const pooCount = feedings.filter(f => f.type === 'poo' || f.type === 'mixed').length

  const uniqueSolids = [...new Set(solidFeedings.map(f => f.food).filter(Boolean))]
  const totalMilk = breastCount + formulaFeedings.length

  return (
    <div className="summary">
      <h2>Daily Summary</h2>
      <div className="summary-stats">
        <div className="stat">
          <div className="stat-value">{totalMilk}</div>
          <div className="stat-label">Milk Feeds</div>
        </div>
        <div className="stat">
          <div className="stat-value">{formulaOz > 0 ? `${formulaOz}oz` : '—'}</div>
          <div className="stat-label">Formula</div>
        </div>
        <div className="stat">
          <div className="stat-value">{solidFeedings.length}</div>
          <div className="stat-label">Solids</div>
        </div>
      </div>
      <div className="summary-potty">
        <div className="potty-stat">
          <span className="potty-icon">💧</span>
          <span className="potty-count">{peeCount}</span>
          <span className="potty-label">Pees</span>
        </div>
        <div className="potty-divider" />
        <div className="potty-stat">
          <span className="potty-icon">💩</span>
          <span className="potty-count">{pooCount}</span>
          <span className="potty-label">Poos</span>
        </div>
      </div>
      {uniqueSolids.length > 0 && (
        <div className="summary-solids">
          <h3>Foods Today</h3>
          <div className="solids-list">
            {uniqueSolids.map(food => (
              <span key={food} className="solid-tag">{food}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
