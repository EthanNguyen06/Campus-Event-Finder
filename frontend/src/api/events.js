const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Get all events
export async function listEvents() {
  const res = await fetch(`${API_BASE}/api/events`);
  if (!res.ok) throw new Error("Failed to load events");
  const data = await res.json();
  return data.events;
}

// Get event by ID
export async function getEvent(id) {
  const res = await fetch(`${API_BASE}/api/events/${id}`, {
    credentials: "include",  
  });
  if (!res.ok) throw new Error("Event not found");
  return await res.json();
}

// Save/bookmark an event for the authenticated user
export async function saveEvent(id) {
  const res = await fetch(`${API_BASE}/api/events/${id}/save`, {
    method: "POST",
    credentials: 'include',
  });
  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.message || "Failed to save event");
  }
  return await res.json();
}

// Unsave/remove bookmark
export async function unsaveEvent(id) {
  const res = await fetch(`${API_BASE}/api/events/${id}/save`, {
    method: "DELETE",
    credentials: 'include',
  });
  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.message || "Failed to unsave event");
  }
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

// Update an existing event
export async function updateEvent(id, eventData) {
  const res = await fetch(`${API_BASE}/api/events/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
    credentials: 'include',
  });
  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.message || "Failed to update event");
  }
  return await res.json();
}

// Delete an event
export async function deleteEvent(id) {
  const res = await fetch(`${API_BASE}/api/events/${id}`, {
    method: "DELETE",
    credentials: 'include',
  });
  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.message || "Failed to delete event");
  }
  return await res.json();
}
    
// RSVP to an event
export async function rsvpToEvent(id, attending) {
  const res = await fetch(`${API_BASE}/api/events/${id}/rsvp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
      body: JSON.stringify({ attending }),
      credentials: 'include',
    });
    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.message || "Failed to RSVP");
    }
    return await res.json();
}

// Get event attendees (creator only)
export async function getEventAttendees(id) {
  const res = await fetch(`${API_BASE}/api/events/${id}/attendees`, {
    credentials: "include",
  });
  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.message || "Failed to fetch attendees");
  }
  return await res.json();
}
    