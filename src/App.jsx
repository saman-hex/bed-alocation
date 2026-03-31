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

    // Generate unique emojis for each couple
    const coupleEmojis = [
      '💙', '💚', '💛', '🧡', '💜', '🩷', '🩵', '🖤', '🤍', '🤎',
      '💘', '💝', '💞', '💟', '💌', '💍', '💑', '👩‍❤️‍👨', '👨‍❤️‍👨', '👩‍❤️‍👩',
      '🫶', '🤝', '👩‍❤️‍💋‍👨', '👨‍❤️‍💋‍👨', '👩‍❤️‍💋‍👩'
    ]
    const coupleEmojiMap = {}
    activeCouples.forEach(([a, b], i) => {
      const emoji = coupleEmojis[i % coupleEmojis.length]
      coupleEmojiMap[a] = emoji
      coupleEmojiMap[b] = emoji
    })

    // Step 1: Randomly assign all people to beds
    const shuffledPeople = [...people].sort(() => Math.random() - 0.5)
    const result = rooms.map((room) => ({
      ...room,
      assignments: Array(room.beds).fill(null),
    }))
    let idx = 0
    for (let ri = 0; ri < result.length; ri++) {
      for (let bi = 0; bi < result[ri].assignments.length; bi++) {
        if (idx < shuffledPeople.length) {
          result[ri].assignments[bi] = shuffledPeople[idx++]
        }
      }
    }

    // Step 2: For each couple, try to move both partners into a room with 2 available beds
    function findRoomsWithTwoEmptyBeds() {
      return result
        .map((room, ri) => ({
          ri,
          emptyBeds: room.assignments
            .map((a, bi) => (a === null ? bi : null))
            .filter((x) => x !== null),
        }))
        .filter((r) => r.emptyBeds.length >= 2)
    }

    // Remove couples from their current beds for reassignment
    function removeFromAssignments(person) {
      for (let ri = 0; ri < result.length; ri++) {
        const bi = result[ri].assignments.indexOf(person)
        if (bi !== -1) {
          result[ri].assignments[bi] = null
          return
        }
      }
    }

    // Try to assign as many couples as possible to the same room with 2 empty beds
    const shuffledCouples = [...activeCouples].sort(() => Math.random() - 0.5)
    shuffledCouples.forEach(([p1, p2]) => {
      // Remove both partners from their current beds
      removeFromAssignments(p1)
      removeFromAssignments(p2)
      // Find a room with 2 empty beds
      const roomsWith2 = findRoomsWithTwoEmptyBeds()
      if (roomsWith2.length > 0) {
        const chosenRoom = roomsWith2[Math.floor(Math.random() * roomsWith2.length)]
        // Randomly pick two beds in this room
        const [b1, b2] = chosenRoom.emptyBeds.sort(() => Math.random() - 0.5).slice(0, 2)
        result[chosenRoom.ri].assignments[b1] = p1
        result[chosenRoom.ri].assignments[b2] = p2
      }
    })

    // Step 3: For remaining couples not yet assigned together, assign them to different rooms
    // Find unassigned partners
    const unassignedCouples = shuffledCouples.filter(([p1, p2]) => {
      let found1 = false, found2 = false
      for (let ri = 0; ri < result.length; ri++) {
        if (result[ri].assignments.includes(p1)) found1 = true
        if (result[ri].assignments.includes(p2)) found2 = true
      }
      return !(found1 && found2)
    })
    unassignedCouples.forEach(([p1, p2]) => {
      // Remove both partners from their current beds
      removeFromAssignments(p1)
      removeFromAssignments(p2)
      // Assign to different rooms
      // Find all available slots
      const availableSlots = []
      result.forEach((room, ri) => {
        room.assignments.forEach((a, bi) => {
          if (a === null) availableSlots.push({ ri, bi })
        })
      })
      // Try to pick two slots in different rooms
      const slot1 = availableSlots[Math.floor(Math.random() * availableSlots.length)]
      // Remove slot1 from availableSlots
      const availableSlots2 = availableSlots.filter((s) => s.ri !== slot1.ri)
      let slot2
      if (availableSlots2.length > 0) {
        slot2 = availableSlots2[Math.floor(Math.random() * availableSlots2.length)]
      } else {
        // If not possible, just pick any other slot
        slot2 = availableSlots.filter((s) => s.ri !== slot1.ri || s.bi !== slot1.bi)[0]
      }
      if (slot1) result[slot1.ri].assignments[slot1.bi] = p1
      if (slot2) result[slot2.ri].assignments[slot2.bi] = p2
    })

    // Pass emoji mapping with allocation for rendering
    setAllocation({ rooms: result, coupleEmojiMap })
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
          {allocation && <AllocationResults allocation={allocation.rooms} couples={couples} coupleEmojiMap={allocation.coupleEmojiMap} />}
        </section>
      </main>
    </div>
  )
}

export default App
