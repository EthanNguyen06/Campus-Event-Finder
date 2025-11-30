import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

import {
  getMySavedEvents,
  getMyRsvpEvents,
  getMyCreatedEvents,
  unsaveEvent,
  deleteEvent,
  rsvpToEvent,
} from '../api/events'; 

export default function Dashboard() {
  const { user } = useAuth();

  const [savedEvents, setSavedEvents] = useState([]);
  const [rsvpEvents, setRsvpEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect to login if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardEvents() {
      try {
        setLoading(true);
        setError(null);

        const [saved, rsvps, created] = await Promise.all([
          getMySavedEvents(),
          getMyRsvpEvents(),
          getMyCreatedEvents(),
        ]);

        if (!isMounted) return;

        setSavedEvents(saved);
        setRsvpEvents(rsvps);
        setCreatedEvents(created);
      } catch (err) {
        if (!isMounted) return;
        console.error(err);
        setError(err.message || 'Failed to load dashboard events');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboardEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  function formatEventDateTime(event) {
    const start = new Date(event.start_time);
    const date = start.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const time = start.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });
    return { date, time };
  }

  const removeFromSaved = async (id) => {
    try {
      await unsaveEvent(id);
      setSavedEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to remove from saved');
    }
  };

  const removeFromRsvp = async (id) => {
    try {
      await rsvpToEvent(id, false);
      setRsvpEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to cancel RSVP');
    }
  };

  const removeFromCreated = async (id) => {
    try {
      await deleteEvent(id);
      setCreatedEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to delete event');
    }
  };

  const EventCard = ({ event, onRemove, showEdit }) => {
    const { date, time } = formatEventDateTime(event);

    return (
      <div className="event-card">
        <img
          src={event.image_url}
          alt={event.title}
          className="event-card-image"
        />
        <div className="event-card-content">
          <h3 className="event-card-title">{event.title}</h3>
          <p className="event-card-info">📅 {date}</p>
          <p className="event-card-info">🕐 {time}</p>
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
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">My Dashboard</h1>
          <p className="dashboard-subtitle">Track and manage your events.</p>
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