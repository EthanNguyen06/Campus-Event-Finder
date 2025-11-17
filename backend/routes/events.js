const express = require("express");
const pool = require("../db");
const authenticate = require("../middleware/authenticate");
const optionalAuth = require("../middleware/optionalAuth");
const upload = require("../middleware/upload");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const DEFAULT_EVENT_IMAGE = "https://www.vt.edu/content/vt_edu/en/about/traditions/_jcr_content/content/adaptiveimage_1451122130.transform/m-medium/image.jpg";

/* -------------------- CREATE EVENT -------------------- */
router.post("/", authenticate, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      start_time,
      end_time,
      image_url,
    } = req.body;

    if (!title || !start_time || !end_time || !location) {
      return res
        .status(400)
        .json({ message: "Title, start_time, end_time, and location are required." });
    }

    const finalImageUrl = image_url || DEFAULT_EVENT_IMAGE;

    const result = await pool.query(
      `INSERT INTO events
        (title, description, category, location, start_time, end_time, image_url, created_by_user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title, description, category, location, start_time, end_time, finalImageUrl, req.user.id]
    );

    const newEvent = result.rows[0];
    const userRes = await pool.query("SELECT username FROM users WHERE id = $1", [req.user.id]);
    newEvent.created_by_username = userRes.rows[0]?.username || null;

    res.status(201).json(newEvent);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ message: "Error creating event" });
  }
});

/* -------------------- EDIT EVENT -------------------- */
router.patch("/:id", authenticate, upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
    const event = result.rows[0];
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.created_by_user_id !== req.user.id)
      return res.status(403).json({ message: "You can only edit your own events." });

    // Handle image replacement
    let image_url = event.image_url;
    if (req.file) {
      if (image_url) {
        const oldPath = path.join(__dirname, "../", image_url);
        fs.unlink(oldPath, (err) => {
          if (err) console.warn("Failed to delete old image:", err.message);
        });
      }
      image_url = `/uploads/${req.file.filename}`;
    }

    const { title, description, category, location, start_time, end_time } = req.body;

    const updated = await pool.query(
      `UPDATE events
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           category = COALESCE($3, category),
           location = COALESCE($4, location),
           start_time = COALESCE($5, start_time),
           end_time = COALESCE($6, end_time),
           image_url = COALESCE($7, image_url),
           updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [title, description, category, location, start_time, end_time, image_url, id]
    );

    const updatedEvent = updated.rows[0];
    const userRes = await pool.query("SELECT username FROM users WHERE id = $1", [req.user.id]);
    updatedEvent.created_by_username = userRes.rows[0]?.username || null;

    res.json(updatedEvent);
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ message: "Error updating event" });
  }
});

/* -------------------- DELETE EVENT -------------------- */
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
    const event = result.rows[0];
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.created_by_user_id !== req.user.id)
      return res.status(403).json({ message: "You can only delete your own events" });

    if (event.image_url) {
      const oldPath = path.join(__dirname, "../", event.image_url);
      fs.unlink(oldPath, (err) => {
        if (err) console.warn("Failed to delete old image:", err.message);
      });
    }

    await pool.query("DELETE FROM events WHERE id = $1", [id]);
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ message: "Error deleting event" });
  }
});

/* -------------------- GET ONE EVENT -------------------- */
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id;
    const event_id_int = parseInt(id, 10);

    let query;
    const params = [event_id_int];

    if (user_id) {
      query = `
        SELECT e.*, u.username AS created_by_username, r.attending AS user_rsvp_status
        FROM events e
        LEFT JOIN users u ON e.created_by_user_id = u.id
        LEFT JOIN rsvps r ON e.id = r.event_id AND r.user_id = $2
        WHERE e.id = $1
      `;
      params.push(user_id);
    } else {
      query = `
        SELECT e.*, u.username AS created_by_username, NULL AS user_rsvp_status
        FROM events e
        LEFT JOIN users u ON e.created_by_user_id = u.id
        WHERE e.id = $1
      `;
    }

    const result = await pool.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const event = result.rows[0];
    res.json(event);
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ message: "Error fetching event" });
  }
});

/* -------------------- RSVP to an EVENT -------------------- */
router.post("/:id/rsvp", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const event_id_int = parseInt(id, 10);
    const { id: user_id } = req.user;
    const { attending } = req.body;

    if (typeof attending !== "boolean") {
      return res.status(400).json({ message: "Attending must be a boolean value" });
    }

    // Prevent event owners from RSVPing to their own event
    const evRes = await pool.query("SELECT created_by_user_id FROM events WHERE id = $1", [event_id_int]);
    if (evRes.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (evRes.rows[0].created_by_user_id === user_id) {
      return res.status(403).json({ message: "You cannot RSVP to your own event" });
    }

    const rsvpResult = await pool.query(
      `INSERT INTO rsvps (user_id, event_id, attending)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, event_id)
       DO UPDATE SET attending = $3, updated_at = NOW()
       RETURNING *`,
      [user_id, event_id_int, attending]
    );

    res.status(200).json(rsvpResult.rows[0]);
  } catch (err) {
    console.error("Error creating or updating RSVP:", err);
    res.status(500).json({ message: "Error creating or updating RSVP" });
  }
});

/* -------------------- GET ALL EVENTS -------------------- */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, u.username AS created_by_username
       FROM events e
       LEFT JOIN users u ON e.created_by_user_id = u.id
       ORDER BY e.start_time ASC`
    );
    res.json({ events: result.rows });
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ message: "Error fetching events" });
  }
});

module.exports = router;
