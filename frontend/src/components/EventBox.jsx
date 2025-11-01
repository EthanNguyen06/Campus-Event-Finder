import { Link } from "react-router-dom";
import "../styles/EventBox.css";

export default function EventBox({ event }) {
  return (
      <Link to={`/events/${event.id}`} className="event-box">
          {event.image_url && <img src={event.image_url} alt={event.title} className="event-image" />}
          <h3 className="event-name">{event.title}</h3>
        </Link>
  )
}