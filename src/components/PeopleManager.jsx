import { useState } from 'react'

export default function PeopleManager({ people, setPeople, couples, setCouples, totalBeds }) {
  const [newName, setNewName] = useState('')
  const [linkA, setLinkA] = useState('')
  const [linkB, setLinkB] = useState('')

  // Map each person to their partner (if any)
  const partnerOf = {}
  couples.forEach(([a, b]) => {
    partnerOf[a] = b
    partnerOf[b] = a
  })

  function addPerson() {
    const name = newName.trim()
    if (!name) return
    if (people.length >= totalBeds) return
    if (people.includes(name)) return
    setPeople([...people, name])
    setNewName('')
  }

  function removePerson(name) {
    setPeople(people.filter((p) => p !== name))
    // Remove any couple that included this person
    setCouples(couples.filter(([a, b]) => a !== name && b !== name))
    if (linkA === name) setLinkA('')
    if (linkB === name) setLinkB('')
  }

  function linkCouple() {
    if (!linkA || !linkB || linkA === linkB) return
    // Ensure neither is already coupled
    if (partnerOf[linkA] || partnerOf[linkB]) return
    setCouples([...couples, [linkA, linkB]])
    setLinkA('')
    setLinkB('')
  }

  function unlinkCouple(name) {
    setCouples(couples.filter(([a, b]) => a !== name && b !== name))
  }

  const singles = people.filter((p) => !partnerOf[p])
  // Only people not yet coupled can be linked
  const linkablePeople = people.filter((p) => !partnerOf[p])

  const atCapacity = people.length >= totalBeds
  const countColor =
    people.length > totalBeds ? 'red' : people.length === totalBeds ? 'green' : 'inherit'

  return (
    <section className="panel people-panel">
      <h2>👤 People</h2>
      <p className="panel-sub">
        Count:{' '}
        <strong style={{ color: countColor }}>
          {people.length} / {totalBeds}
        </strong>
        {couples.length > 0 && (
          <span className="couple-count-badge">
            {' '}· {couples.length} couple{couples.length !== 1 ? 's' : ''}, {singles.length} single{singles.length !== 1 ? 's' : ''}
          </span>
        )}
      </p>

      <ul className="people-list">
        {people.map((person) => {
          const partner = partnerOf[person]
          return (
            <li key={person} className={`person-item ${partner ? 'coupled' : ''}`}>
              <span className="person-status">{partner ? '💑' : '🧍'}</span>
              <span className="person-name">
                {person}
                {partner && <span className="partner-label"> + {partner}</span>}
              </span>
              {partner && (
                <button
                  className="unlink-btn"
                  onClick={() => unlinkCouple(person)}
                  title="Unlink couple"
                  aria-label={`Unlink ${person} and ${partner}`}
                >
                  💔
                </button>
              )}
              <button
                className="remove-btn"
                onClick={() => removePerson(person)}
                aria-label={`Remove ${person}`}
              >
                ✕
              </button>
            </li>
          )
        })}
      </ul>

      <div className="add-person-form">
        <input
          placeholder="Enter a name…"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addPerson()}
          disabled={atCapacity}
          className="add-person-input"
        />
        <button
          className="add-btn"
          onClick={addPerson}
          disabled={atCapacity || !newName.trim()}
        >
          + Add Person
        </button>
      </div>

      {atCapacity && (
        <p className="info-msg">✅ All beds are filled — ready to allocate!</p>
      )}

      {people.length >= 2 && (
        <div className="couple-link-form">
          <p className="couple-link-title">💑 Link as Couple</p>
          <div className="couple-link-selects">
            <select
              className="couple-select"
              value={linkA}
              onChange={(e) => setLinkA(e.target.value)}
              aria-label="First partner"
            >
              <option value="">Partner 1…</option>
              {linkablePeople
                .filter((p) => p !== linkB)
                .map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
            </select>
            <span className="couple-plus">+</span>
            <select
              className="couple-select"
              value={linkB}
              onChange={(e) => setLinkB(e.target.value)}
              aria-label="Second partner"
            >
              <option value="">Partner 2…</option>
              {linkablePeople
                .filter((p) => p !== linkA)
                .map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
            </select>
            <button
              className="add-btn link-btn"
              onClick={linkCouple}
              disabled={!linkA || !linkB || linkA === linkB}
            >
              Link
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
