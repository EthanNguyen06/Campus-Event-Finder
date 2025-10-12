import "../styles/components.css"

function EventBox({ event }) {
  const handleClick = () => {
  window.location.href = event.url;
}

  return (
    <div className="event-box" onClick={handleClick}>
      <img src={event.image} alt={event.name} className="event-image" />
      <h3 className="event-name">{event.name}</h3>
    </div>
  )
}

export default EventBox