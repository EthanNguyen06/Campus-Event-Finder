import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  
  // Redirect to login if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Sample data - replace with API calls to your backend
  const [savedEvents, setSavedEvents] = useState([
    {
      id: 1,
      name: "Fall Concert",
      date: "Dec 15, 2024",
      time: "7:00 PM",
      location: "Campus Auditorium",
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=400&fit=crop"
    },
    {
      id: 2,
      name: "Career Fair",
      date: "Jan 10, 2025",
      time: "10:00 AM",
      location: "Student Center",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop"
    }
  ]);

  const [rsvpEvents, setRsvpEvents] = useState([
    {
      id: 3,
      name: "Hackathon",
      date: "Dec 20, 2024",
      time: "9:00 AM",
      location: "Engineering Building",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop"
    }
  ]);

  const [createdEvents, setCreatedEvents] = useState([
    {
      id: 4,
      name: "Study Group",
      date: "Dec 12, 2024",
      time: "3:00 PM",
      location: "Library Room 204",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop"
    }
  ]);

  const removeFromSaved = (id) => {
    setSavedEvents(savedEvents.filter(event => event.id !== id));
    // TODO: Add API call to remove from saved
  };

  const removeFromRsvp = (id) => {
    setRsvpEvents(rsvpEvents.filter(event => event.id !== id));
    // TODO: Add API call to cancel RSVP
  };

  const removeFromCreated = (id) => {
    setCreatedEvents(createdEvents.filter(event => event.id !== id));
    // TODO: Add API call to delete event
  };

  const EventCard = ({ event, onRemove, showEdit }) => (
    <div className="event-card">
      <img src={event.image} alt={event.name} className="event-card-image" />
      <div className="event-card-content">
        <h3 className="event-card-title">{event.name}</h3>
        <p className="event-card-info">📅 {event.date}</p>
        <p className="event-card-info">🕐 {event.time}</p>
        <p className="event-card-info">📍 {event.location}</p>
        <div className="event-card-actions">
          {showEdit && (
            <Link to={`/events/${event.id}/edit`} className="btn-edit">
              ✏️ Edit
            </Link>
          )}
          <button className="btn-remove" onClick={() => onRemove(event.id)}>
            🗑️ Remove
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">My Dashboard</h1>
          <p className="dashboard-subtitle">Track and manage your events</p>
        </div>

        {/* Saved Events Section */}
        <section className="dashboard-section">
          <div className="section-header">
            <span className="section-icon">🔖</span>
            <h2 className="section-title">Saved Events</h2>
            <span className="event-count">{savedEvents.length}</span>
          </div>
          <div className="events-grid">
            {savedEvents.length > 0 ? (
              savedEvents.map(event => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onRemove={removeFromSaved}
                  showEdit={false}
                />
              ))
            ) : (
              <p className="empty-message">No saved events yet</p>
            )}
          </div>
        </section>

        {/* RSVP'd Events Section */}
        <section className="dashboard-section">
          <div className="section-header">
            <span className="section-icon">📅</span>
            <h2 className="section-title">RSVP'd Events</h2>
            <span className="event-count">{rsvpEvents.length}</span>
          </div>
          <div className="events-grid">
            {rsvpEvents.length > 0 ? (
              rsvpEvents.map(event => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onRemove={removeFromRsvp}
                  showEdit={false}
                />
              ))
            ) : (
              <p className="empty-message">No RSVP'd events yet</p>
            )}
          </div>
        </section>

        {/* Created Events Section */}
        <section className="dashboard-section">
          <div className="section-header">
            <span className="section-icon">➕</span>
            <h2 className="section-title">Created Events</h2>
            <span className="event-count">{createdEvents.length}</span>
          </div>
          <div className="events-grid">
            {createdEvents.length > 0 ? (
              createdEvents.map(event => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onRemove={removeFromCreated}
                  showEdit={true}
                />
              ))
            ) : (
              <p className="empty-message">No created events yet</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}