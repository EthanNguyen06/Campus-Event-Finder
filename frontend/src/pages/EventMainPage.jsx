import EventBox from "../components/EventBox"
import "../styles/layout.css"
import { listEvents } from "../api/events";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function EventMainPage() {
  const [events, setEvents] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      const events = await listEvents();
      setEvents(events);
    })();
  }, []);

  return (
    <>
      <Navbar />

      <div className="page-shell">
        <div className="page-header">
          <h1 className="page-title">Campus Events</h1>
          {user && (
            <Link to="/events/new" className="create-event-button">
              Create New Event
            </Link>
          )}
        </div>
        <div className="event-grid">
          {events.map((event) => (
            <EventBox key={event.id} event={event} />
          ))}
        </div>
      </div>
    </>
  )
}