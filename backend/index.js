const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");

const app = express();
app.use(express.json());
app.use(cookieParser());

// Allow frontend (important for cookies)
app.use(
  cors({
    origin: "http://localhost:5173", // your React dev URL
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

app.get("/", (req, res) => res.send("Backend running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
