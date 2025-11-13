import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import { useAuth } from "../context/AuthContext";
import { rsvpToEvent } from "../api/events";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // --- Handle Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const loggedIn = await login(username, password);

      // If we came here with an RSVP intent, auto-complete it
      const state = location.state || {};
      if (state.intent === "rsvp" && state.eventId && typeof state.attending === "boolean") {
        // If this user is the event owner, do not auto-RSVP
        if (state.createdBy && loggedIn && loggedIn.id === state.createdBy) {
          // Navigate back
        } else {
        try {
          await rsvpToEvent(state.eventId, state.attending);
        } catch (rsvpErr) {
          console.warn("Post-login RSVP failed:", rsvpErr);
        }
        }
      }

      // Navigate back to where we came from, or home
      const returnTo = (location.state && location.state.from) || "/";
      navigate(returnTo, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div>
            <label htmlFor="username">Email:</label>
            <input
              type="email"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* 👇 Add this */}
          <p className="register-link">
            Don’t have an account? <Link to="/register" state={location.state}>Create one here</Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default LoginPage;
