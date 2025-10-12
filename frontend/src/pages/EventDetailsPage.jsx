import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getEvent } from "../api/events";
import "../styles/EventDetailsPage.css";

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const e = await getEvent(id);
        setEvent(e);
      } catch {
        setErr("Event not found");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="page-shell">
        {loading ? (
          <div className="event-content">Loading…</div>
        ) : err || !event ? (
          <div className="event-content">
            <h2>Event not found</h2>
            <Link className="back-link" to="/events">← Back to all events</Link>
          </div>
        ) : (
          <>
            {event.image && (
              <div className="event-hero">
                <img src={event.image} alt={event.title} />
              </div>
            )}

            <div className="event-content">
              <h1 className="event-title">{event.title}</h1>
              <div className="event-meta">
                {new Date(event.date).toLocaleString()} • {event.location}
              </div>
              {event.category && <div className="chip">{event.category}</div>}

              <p className="event-description">
                {event.description || "No description provided."}
              </p>

              <Link className="back-link" to="/events">← Back to all events</Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
