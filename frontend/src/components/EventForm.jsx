import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent, updateEvent } from "../api/events";
import "../styles/EventForm.css";

const EventForm = ({ eventToEdit, onCancel }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    location: "",
    category: "",
    image_url: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (eventToEdit) {
      // Convert "YYYY-MM-DD HH:MM:SS" → "YYYY-MM-DDTHH:MM" for datetime-local
      const formatForInput = (value) => {
        if (!value) return "";
        return value.replace(" ", "T").slice(0, 16);
      };

      setFormData({
        title: eventToEdit.title || "",
        description: eventToEdit.description || "",
        start_time: formatForInput(eventToEdit.start_time),
        end_time: formatForInput(eventToEdit.end_time),
        location: eventToEdit.location || "",
        category: eventToEdit.category || "",
        image_url: eventToEdit.image_url || "",
      });
    }
  }, [eventToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const eventData = { ...formData };

      if (eventToEdit) {
        // Update existing event
        const response = await updateEvent(eventToEdit.id, eventData);
        navigate(`/events/${response.id}`);
      } else {
        // Create new event
        const response = await createEvent(eventData);
        navigate(`/events/${response.id}`);
      }
    } catch (err) {
      console.error("Failed to save event", err);
      setError(err.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (eventToEdit) {
      navigate(`/events/${eventToEdit.id}`);
    } else {
      navigate("/events");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      {error && <div className="error-message">{error}</div>}

      <label>
        Title
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Description
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </label>
      <label>
        Start Time
        <input
          type="datetime-local"
          name="start_time"
          value={formData.start_time}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        End Time
        <input
          type="datetime-local"
          name="end_time"
          value={formData.end_time}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Location
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Category
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
        />
      </label>
      <label>
        Image URL (optional)
        <input
          type="text"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          placeholder="Leave empty for default image"
        />
      </label>
      <div className="form-buttons">
        <button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : eventToEdit
            ? "Update Event"
            : "Create Event"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="btn-cancel"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EventForm;
