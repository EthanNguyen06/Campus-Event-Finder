const API_BASE = "http://localhost:5000";

// Get all events
export async function listEvents() {
  const res = await fetch(`${API_BASE}/api/events`);
  if (!res.ok) throw new Error("Failed to load events");
  const data = await res.json();
  return data.events;
}

// Get event by ID
export async function getEvent(id) {
  const res = await fetch(`${API_BASE}/api/events/${id}`);
  if (!res.ok) throw new Error("Event not found");
  return await res.json();
}

// Create a new event
export async function createEvent(eventData) {
  const res = await fetch(`${API_BASE}/api/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
    credentials: 'include',
  });
  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.message || "Failed to create event");
  }
  return await res.json();
}