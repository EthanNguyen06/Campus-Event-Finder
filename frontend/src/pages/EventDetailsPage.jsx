import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getEvent, deleteEvent } from "../api/events";
import { useAuth } from "../context/AuthContext";
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
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const isOwner = isAuthenticated && user && event && event.created_by_user_id === user.id;

  const handleEdit = () => {
    navigate(`/events/${id}/edit`);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteEvent(id);
      navigate("/events", { replace: true });
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert("Failed to delete event. Please try again.");
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

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
            <div className="event-hero">
              <img 
                src={event.image_url || "https://www.vt.edu/content/vt_edu/en/about/traditions/_jcr_content/content/adaptiveimage_1451122130.transform/m-medium/image.jpg"} 
                alt={event.title} 
              />
            </div>

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

              {isOwner && (
                <div className="event-actions">
                  <button className="btn btn-edit" onClick={handleEdit}>
                    ✏️ Edit Event
                  </button>
                  <button className="btn btn-delete" onClick={handleDeleteClick}>
                    🗑️ Delete Event
                  </button>
                </div>
              )}

              <Link className="back-link" to="/events">← Back to all events</Link>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={handleDeleteCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Event?</h2>
            <p>Are you sure you want to delete "<strong>{event?.title}</strong>"? This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                className="btn btn-delete-confirm" 
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
              <button 
                className="btn btn-cancel-modal" 
                onClick={handleDeleteCancel}
                disabled={deleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
