import { Link } from "react-router-dom";
import "../styles/EventBox.css";

export default function EventBox({ event }) {
  const imageUrl = event.image_url || "https://www.vt.edu/content/vt_edu/en/about/traditions/_jcr_content/content/adaptiveimage_1451122130.transform/m-medium/image.jpg";
  
  return (
      <Link to={`/events/${event.id}`} className="event-box">
          <img src={imageUrl} alt={event.title} className="event-image" />
          <h3 className="event-name">{event.title}</h3>
        </Link>
  )
}