import EventBox from "../components/EventBox"
import "../styles/layout.css"

function EventMainPage() {
  const events = [
  { 
    id: 1, 
    name: "Fall Concert", 
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1"
  },
  { 
    id: 2, 
    name: "Career Fair", 
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1"
  },
  { 
    id: 3, 
    name: "Hackathon", 
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop",
    url: ""
  },
  { 
    id: 4, 
    name: "Charity Run", 
    image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&h=600&fit=crop",
    url: ""
  },
]

  const goToHome = () => {
    window.location.href = '/'; // Or use your router navigation
  }

  return (
    <>
      <nav className="navbar">
        <h1 className="navbar-title" onClick={goToHome}>Event Finder</h1>
        <div className="nav-buttons">
          <button className="nav-button">Events</button>
          <button className="login-button">Login</button>
        </div>
      </nav>
      
      <div className="event-page">
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