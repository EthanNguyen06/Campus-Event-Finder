import EventBox from "../components/EventBox"
import "../styles/layout.css"
import { listEvents } from "../api/events";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function EventMainPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    (async () => {
      const { items } = await listEvents();
      setEvents(items);
    })();
  }, []);

  return (
    <>
      <Navbar />

      <div className="page-shell">
        <h1 className="page-title">Campus Events</h1>
        <div className="event-grid">
          {events.map((event) => (
            <EventBox key={event.id} event={event} />
          ))}
        </div>
      </div>
    </>
  )
}

export default EventMainPage