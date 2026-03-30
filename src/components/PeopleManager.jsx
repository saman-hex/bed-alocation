import { useState } from 'react'

export default function PeopleManager({ people, setPeople, totalBeds }) {
  const [newName, setNewName] = useState('')

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
  }

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
      </p>

      <ul className="people-list">
        {people.map((person) => (
          <li key={person} className="person-item">
            <span className="person-name">{person}</span>
            <button
              className="remove-btn"
              onClick={() => removePerson(person)}
              aria-label={`Remove ${person}`}
            >
              ✕
            </button>
          </li>
        ))}
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
    </section>
  )
}
