import { useState } from 'react'
import { defaultRooms, defaultPeople } from './config'
import RoomManager from './components/RoomManager'
import PeopleManager from './components/PeopleManager'
import AllocationResults from './components/AllocationResults'
import './App.css'

function App() {
  const [rooms, setRooms] = useState(defaultRooms)
  const [people, setPeople] = useState(defaultPeople)
  const [couples, setCouples] = useState([])
  const [assignmentMode, setAssignmentMode] = useState('random')
  const [allocation, setAllocation] = useState(null)

  const totalBeds = rooms.reduce((sum, r) => sum + r.beds, 0)

  function allocateRandom() {
    const shuffled = [...people].sort(() => Math.random() - 0.5)
    let idx = 0
    const result = rooms.map((room) => ({
      ...room,
      assignments: Array.from({ length: room.beds }, () => shuffled[idx++] ?? null),
    }))
    setAllocation(result)
  }

  function allocateCoupleFriendly() {
    // Only consider couples where both members are in the people list
    const activeCouples = couples.filter(
      ([a, b]) => people.includes(a) && people.includes(b)
    )
    const coupledNames = new Set(activeCouples.flat())
    const singles = people.filter((p) => !coupledNames.has(p))

    // Build mutable result structure
    const result = rooms.map((room) => ({
      ...room,
      assignments: Array(room.beds).fill(null),
    }))

    function getAvailableSlots() {
      const slots = []
      result.forEach((room, ri) => {
        room.assignments.forEach((a, bi) => {
          if (a === null) slots.push({ ri, bi })
        })
      })
      return slots
    }

    function pickRandom(arr) {
      return arr[Math.floor(Math.random() * arr.length)]
    }

    function assign(person, slot) {
      result[slot.ri].assignments[slot.bi] = person
    }

    // Step 1: Separate singles from coupled people (handled above)
    // Step 2: Assign singles randomly
    const shuffledSingles = [...singles].sort(() => Math.random() - 0.5)
    shuffledSingles.forEach((person) => {
      const slot = pickRandom(getAvailableSlots())
      assign(person, slot)
    })

    // Step 3: Iterate through couples one by one
    const shuffledCouples = [...activeCouples].sort(() => Math.random() - 0.5)
    shuffledCouples.forEach(([p1, p2]) => {
      // Step 4: Assign first partner to any available bed
      const available = getAvailableSlots()
      const slot1 = pickRandom(available)
      assign(p1, slot1)

      // Step 5: Try to assign second partner to the same room
      const sameRoom = getAvailableSlots().filter((s) => s.ri === slot1.ri)
      if (sameRoom.length > 0) {
        assign(p2, pickRandom(sameRoom))
      } else {
        // Step 6: Fall back to any remaining available bed
        assign(p2, pickRandom(getAvailableSlots()))
      }
    })

    setAllocation(result)
  }

  function allocate() {
    if (assignmentMode === 'couple-friendly') {
      allocateCoupleFriendly()
    } else {
      allocateRandom()
    }
  }

  const canAllocate = people.length > 0 && people.length <= totalBeds

  return (
    <div className="app">
      <header className="app-header">
        <h1>🛏️ Bed Allocation</h1>
        <p className="subtitle">Randomly assign people to beds across rooms</p>
      </header>

      <main className="app-body">
        <div className="top-columns">
          <RoomManager rooms={rooms} setRooms={setRooms} />
          <PeopleManager
            people={people}
            setPeople={setPeople}
            couples={couples}
            setCouples={setCouples}
            totalBeds={totalBeds}
          />
        </div>

        <section className="allocation-section">
          <div className="allocate-controls">
            <div className="mode-selector">
              <label htmlFor="assignment-mode" className="mode-label">
                Assignment Mode:
              </label>
              <select
                id="assignment-mode"
                className="mode-select"
                value={assignmentMode}
                onChange={(e) => {
                  setAssignmentMode(e.target.value)
                  setAllocation(null)
                }}
              >
                <option value="random">🎲 Completely Random</option>
                <option value="couple-friendly">💑 Couple-Friendly (Fair for Singles)</option>
              </select>
            </div>
            <button
              className="allocate-btn"
              onClick={allocate}
              disabled={!canAllocate}
              title={
                !canAllocate
                  ? people.length === 0
                    ? 'Add at least one person first'
                    : 'Number of people exceeds available beds'
                  : ''
              }
            >
              {assignmentMode === 'couple-friendly' ? '💑 Assign (Couple-Friendly)' : '🎲 Assign Randomly'}
            </button>
          </div>
          {!canAllocate && people.length > totalBeds && (
            <p className="error-msg">
              ⚠️ Too many people ({people.length}) for the available beds ({totalBeds}).
            </p>
          )}
          {allocation && <AllocationResults allocation={allocation} couples={couples} />}
        </section>
      </main>
    </div>
  )
}

export default App
