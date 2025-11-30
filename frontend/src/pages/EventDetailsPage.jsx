import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteEvent, getEvent, rsvpToEvent, getEventAttendees, saveEvent, unsaveEvent } from "../api/events";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "../styles/EventDetailsPage.css";
import EventCreatorPanel from "../components/EventCreatorPanel";

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

  // rsvp state
  const [rsvpStatus, setRsvpStatus] = useState(null);
  const [isRsvping, setIsRsvping] = useState(false);
  const [rsvpError, setRsvpError] = useState("");

  // attendees state
  const [attendees, setAttendees] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [attendeesError, setAttendeesError] = useState("");
  
  // saved/bookmark state
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const e = await getEvent(id);
        setEvent(e);
        setRsvpStatus(e.user_rsvp_status);
          setSaved(Boolean(e.user_saved));

        if (user && e.created_by_user_id === user.id) {
          setLoadingAttendees(true);
          try {
            const fetchedAttendees = await getEventAttendees(id);
            setAttendees(fetchedAttendees);
          } catch (err) {
            setAttendeesError(err.message || "Could not load attendees.");
          } finally {
            setLoadingAttendees(false);
          }
        }
      } catch {
        setErr("Event not found");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, user]);

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

  const handleRsvp = async (attending) => {
    if (!isAuthenticated) {
      // Preserve intent and return path for post-login auto-RSVP
      navigate("/login", {
        state: {
          from: `/events/${id}`,
          intent: "rsvp",
          eventId: id,
          attending,
          createdBy: event?.created_by_user_id,
        },
      });
      return;
    }
    setIsRsvping(true);
    setRsvpError("");
    try {
      const updatedRsvp = await rsvpToEvent(id, attending);
      setRsvpStatus(updatedRsvp.attending);
    } catch (error) {
      setRsvpError(error.message || "Failed to RSVP. Please try again.");
    } finally {
      setIsRsvping(false);
    }
  };

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: `/events/${id}`,
          intent: "save",
          eventId: id,
        },
      });
      return;
    }

    setIsSaving(true);
    setSaveError("");
    try {
      if (!saved) {
        await saveEvent(id);
        setSaved(true);
      } else {
        await unsaveEvent(id);
        setSaved(false);
      }
    } catch (error) {
      setSaveError(error.message || "Failed to update saved status.");
    } finally {
      setIsSaving(false);
    }
  };

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
              {/* Save button positioned top-right */}
              {!isOwner && (
                <div className="save-wrapper">
                  <button
                    className={`btn btn-save ${saved ? "active" : ""}`}
                    onClick={handleToggleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (saved ? "Unsaving..." : "Saving...") : (saved ? "Unsave" : "Save")}
                  </button>
                  {saveError && <p className="save-feedback error">{saveError}</p>}
                  {!isAuthenticated && !isSaving && (
                    <p className="save-feedback">Log in to save events.</p>
                  )}
                </div>
              )}

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

              {!isOwner && (
                <div className="rsvp-section">
                  <h3>Are you going?</h3>
                  <div className="rsvp-actions">
                    <button
                      className={`btn btn-rsvp-yes ${rsvpStatus === true ? "active" : ""}`}
                      onClick={() => handleRsvp(true)}
                      disabled={isRsvping || rsvpStatus === true}
                    >
                      Yes
                    </button>
                    <button
                      className={`btn btn-rsvp-no ${rsvpStatus === false ? "active" : ""}`}
                      onClick={() => handleRsvp(false)}
                      disabled={isRsvping || rsvpStatus === false}
                    >
                      No
                    </button>
                  </div>
                  {isRsvping && <p className="rsvp-feedback">Updating...</p>}
                  {rsvpError && <p className="rsvp-feedback error">{rsvpError}</p>}
                  {rsvpStatus !== null && !isRsvping && !rsvpError && (
                    <p className="rsvp-feedback">
                      {rsvpStatus ? "You're going!" : "You're not going."}
                    </p>
                  )}
                  {!isAuthenticated && !isRsvping && !rsvpError && (
                    <p className="rsvp-feedback">Log in to save your RSVP.</p>
                  )}
                  
                </div>
              )}

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

              {isOwner && (
                <EventCreatorPanel
                  attendees={attendees}
                  loading={loadingAttendees}
                  error={attendeesError}
                />
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
