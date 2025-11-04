const express = require("express");
const cors = require("cors");
const pool = require("./db");

const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
// CORS (allow your frontend origin and credentials)
app.use(cors({
  origin: ['http://localhost:5173', 'https://campus-event-finder.vercel.app'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());


// Basic test route
app.get("/api/health", (req, res) => {
  res.json({ status: "API working" });
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

// get all events, upcoming first
app.get("/api/events", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, description, start_time, end_time, location, category, image_url
      FROM events
      ORDER BY start_time ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// get one event by ID
app.get("/api/events/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, title, description, start_time, end_time, location, category, image_url
       FROM events WHERE id = $1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});