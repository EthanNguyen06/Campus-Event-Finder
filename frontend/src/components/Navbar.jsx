import { Link, useLocation } from "react-router-dom";
import vtLogo from "../assets/Virginia_Tech_Hokies_logo.png";
import "../styles/Navbar.css";
import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const onHome = pathname === "/" || pathname === "/home";
  const onDashboard = pathname === "/dashboard";

  return (
    <nav className="navbar">
      {/* Brand / Logo */}
      <Link to="/" className="navbar-brand">
        <img src={vtLogo} alt="VT logo" className="navbar-logo" />
        <span className="navbar-title">Event Finder</span>
      </Link>

      {/* Navigation Buttons */}
      <div className="nav-buttons">
        <Link className={`nav-button ${onHome ? "active" : ""}`} to="/home">
          Home
        </Link>
        <Link className="nav-button" to="/events">
          Events
        </Link>

        {/* Dashboard button - ADD THIS SECTION */}
        {user && (
          <Link className={`nav-button ${onDashboard ? "active" : ""}`} to="/dashboard">
            Dashboard
          </Link>
        )}

        {/* Conditional Auth Section */}
        {user ? (
          <>
            <span className="welcome-text">
              Welcome, {user.username || user.email}!
            </span>
            <button
              className="logout-button"
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="nav-button" to="/login">
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}