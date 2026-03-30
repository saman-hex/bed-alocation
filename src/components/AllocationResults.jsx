export default function AllocationResults({ allocation, couples = [] }) {
  const partnerOf = {}
  couples.forEach(([a, b]) => {
    partnerOf[a] = b
    partnerOf[b] = a
  })

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
                  <span className="assigned-person">
                    {person ?? '—'}
                    {person && partnerOf[person] && (
                      <span className="result-couple-tag" title={`Couple with ${partnerOf[person]}`}>💑</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
