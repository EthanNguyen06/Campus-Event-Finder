import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getEvent } from "../api/events";
import Navbar from "../components/Navbar";
import "../styles/EventDetailsPage.css";

function formatRange(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  const sameDay = s.toDateString() === e.toDateString();
  const dateStr = s.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  const startStr = s.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  const endStr = e.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return sameDay ? `${dateStr} • ${startStr} – ${endStr}` :
                   `${dateStr} ${startStr} → ${e.toLocaleString()}`;
}

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
            {event.image_url && (
              <div className="event-hero">
                <img src={event.image_url} alt={event.title} />
              </div>
            )}

            <div className="event-content">
              <h1 className="event-title">{event.title}</h1>
              <div className="event-meta">
                { event.start_time && event.end_time
                  ? formatRange(event.start_time, event.end_time)
                  : "Time TBD" }
                {" • "}
                {event.location}
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
