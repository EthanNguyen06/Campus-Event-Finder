import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/RegisterPage.css";
import { useAuth } from "../context/AuthContext";
import { rsvpToEvent } from "../api/events";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // --- Handle Form Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      
      const registered = await register(username, email, password);
      setSuccess("Account created successfully");

      // If we came with an RSVP intent, auto-complete it
      const state = location.state || {};
      if (state.intent === "rsvp" && state.eventId && typeof state.attending === "boolean") {
        // If this user is the event owner, do not auto-RSVP
        if (state.createdBy && registered && registered.id === state.createdBy) {
          // skip
        } else {
          try {
            await rsvpToEvent(state.eventId, state.attending);
          } catch (rsvpErr) {
            console.warn("Post-register RSVP failed:", rsvpErr);
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

  // --- Render ---
  return (
    <>
      <Navbar />
      <div className="register-container">
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit} className="register-form">
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Enter your password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="login-link">
          Already have an account? <Link to="/login" state={location.state}>Login here</Link>
        </p>
      </div>
    </>
  );
}

export default RegisterPage;
