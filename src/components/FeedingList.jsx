import FeedingCard from './FeedingCard.jsx'

export default function FeedingList({ feedings, onDelete }) {
  if (feedings.length === 0) {
    return (
      <div className="feeding-list-empty">
        No feedings logged yet.<br />Tap <strong>+ Log Feeding</strong> to add one.
      </div>
    )
  }

  return (
    <div className="feeding-list">
      {feedings.map(feeding => (
        <FeedingCard key={feeding.id} feeding={feeding} onDelete={onDelete} />
      ))}
    </div>
  )
}
