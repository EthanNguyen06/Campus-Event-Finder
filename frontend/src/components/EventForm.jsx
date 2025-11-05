import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../api/events";
import "../styles/EventForm.css";

const EventForm = ({ eventToEdit }) => {
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

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        title: eventToEdit.title,
        description: eventToEdit.description,
        start_time: new Date(eventToEdit.start_time).toISOString().slice(0, 16),
        end_time: new Date(eventToEdit.end_time).toISOString().slice(0, 16),
        location: eventToEdit.location,
        category: eventToEdit.category,
        image_url: eventToEdit.image_url,
      });
    }
  }, [eventToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const eventData = { ...formData };
      const response = await createEvent(eventData);
      navigate(`/events/${response.id}`);
    } catch (error) {
      console.error("Failed to create event", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
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
        Image URL
        <input
          type="text"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default EventForm;
