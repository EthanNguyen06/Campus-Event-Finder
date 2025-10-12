import "../styles/components.css";
import { Link } from "react-router-dom";

function EventBox({ event }) {
  return (
      <Link to={`/events/${event.id}`} className="event-box">
          {event.image && <img src={event.image} alt={event.title} className="event-image" />}
          <h3 className="event-name">{event.title}</h3>
        </Link>
  )
}

export default EventBox;