import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEvent } from "../api/events";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import EventForm from "../components/EventForm";
import "../styles/EventForm.css";

export default function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    (async () => {
      try {
        const eventData = await getEvent(id);

        // Check if user is the owner
        if (eventData.created_by_user_id !== user.id) {
          setError("You can only edit your own events.");
          return;
        }

        setEvent(eventData);
      } catch (err) {
        setError("Event not found");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isAuthenticated, user, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="page-shell">
        <div className="event-content">
          <h1 className="title">Edit Event</h1>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <div>
              <p className="error-message">{error}</p>
              <button onClick={() => navigate("/events")}>Back to Events</button>
            </div>
          ) : (
            <EventForm eventToEdit={event} />
          )}
        </div>
      </div>
    </>
  );
}
