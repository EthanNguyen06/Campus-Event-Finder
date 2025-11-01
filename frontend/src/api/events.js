const API_BASE = "http://localhost:5000";

// Get all events
export async function listEvents() {
  const res = await fetch(`${API_BASE}/api/events`);
  if (!res.ok) throw new Error("Failed to load events");
  const events = await res.json();   
  return { events };    
}

// Get event by ID
export async function getEvent(id) {
  const res = await fetch(`${API_BASE}/api/events/${id}`);
  if (!res.ok) throw new Error("Event not found");
  return await res.json();
}