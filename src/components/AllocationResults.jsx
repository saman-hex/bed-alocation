export default function AllocationResults({ allocation }) {
  return (
    <div className="results">
      <h2>📋 Allocation Results</h2>
      <div className="results-grid">
        {allocation.map((room) => (
          <div key={room.id} className="result-card">
            <h3 className="result-room-name">{room.name}</h3>
            <ul className="result-bed-list">
              {room.assignments.map((person, i) => (
                <li key={i} className={`result-bed ${person ? '' : 'empty-bed'}`}>
                  <span className="bed-icon">🛏️</span>
                  <span className="bed-number">Bed {i + 1}</span>
                  <span className="assigned-person">{person ?? '—'}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
