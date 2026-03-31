import { useState } from 'react'
import yaml from 'js-yaml'

let nextId = 100

export default function RoomManager({ rooms, setRooms }) {
  const [newName, setNewName] = useState('')
  const [newBeds, setNewBeds] = useState(2)

  function addRoom() {
    const name = newName.trim() || `Room ${rooms.length + 1}`
    const beds = Math.max(1, parseInt(newBeds, 10) || 1)
    setRooms([...rooms, { id: nextId++, name, beds }])
    setNewName('')
    setNewBeds(2)
  }

  function removeRoom(id) {
    setRooms(rooms.filter((r) => r.id !== id))
  }

  function updateBeds(id, value) {
    const beds = Math.max(1, parseInt(value, 10) || 1)
    setRooms(rooms.map((r) => (r.id === id ? { ...r, beds } : r)))
  }

  function updateName(id, value) {
    setRooms(rooms.map((r) => (r.id === id ? { ...r, name: value } : r)))
  }

  const totalBeds = rooms.reduce((sum, r) => sum + r.beds, 0)

  return (
    <section className="panel room-panel">
      <h2>🏠 Rooms &amp; Beds</h2>
      <p className="panel-sub">Total beds: <strong>{totalBeds}</strong></p>

      <ul className="room-list">
        {rooms.map((room) => (
          <li key={room.id} className="room-item">
            <input
              className="room-name-input"
              value={room.name}
              onChange={(e) => updateName(room.id, e.target.value)}
              aria-label="Room name"
            />
            <div className="beds-control">
              <label htmlFor={`beds-${room.id}`}>Beds:</label>
              <input
                id={`beds-${room.id}`}
                type="number"
                min={1}
                value={room.beds}
                onChange={(e) => updateBeds(room.id, e.target.value)}
                className="beds-input"
              />
            </div>
            <button
              className="remove-btn"
              onClick={() => removeRoom(room.id)}
              aria-label={`Remove ${room.name}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className="add-room-form">
        <input
          placeholder="Room name (optional)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="add-room-name"
          onKeyDown={(e) => e.key === 'Enter' && addRoom()}
        />
        <input
          type="number"
          min={1}
          value={newBeds}
          onChange={(e) => setNewBeds(e.target.value)}
          className="add-beds-input"
          aria-label="Number of beds for new room"
        />
        <button className="add-btn" onClick={addRoom}>
          + Add Room
        </button>
      </div>
    </section>
  )
}
