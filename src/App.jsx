import { useState } from 'react'
import { defaultRooms, defaultPeople } from './config'
import RoomManager from './components/RoomManager'
import PeopleManager from './components/PeopleManager'
import AllocationResults from './components/AllocationResults'
import './App.css'

function App() {
  const [rooms, setRooms] = useState(defaultRooms)
  const [people, setPeople] = useState(defaultPeople)
  const [allocation, setAllocation] = useState(null)

  const totalBeds = rooms.reduce((sum, r) => sum + r.beds, 0)

  function allocate() {
    const shuffled = [...people].sort(() => Math.random() - 0.5)
    let idx = 0
    const result = rooms.map((room) => ({
      ...room,
      assignments: Array.from({ length: room.beds }, () => shuffled[idx++] ?? null),
    }))
    setAllocation(result)
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
            totalBeds={totalBeds}
          />
        </div>

        <section className="allocation-section">
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
            🎲 Assign Randomly
          </button>
          {!canAllocate && people.length > totalBeds && (
            <p className="error-msg">
              ⚠️ Too many people ({people.length}) for the available beds ({totalBeds}).
            </p>
          )}
          {allocation && <AllocationResults allocation={allocation} />}
        </section>
      </main>
    </div>
  )
}

export default App
