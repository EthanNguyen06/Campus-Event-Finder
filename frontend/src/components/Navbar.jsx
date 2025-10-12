import { Link, useLocation } from "react-router-dom";
import "../styles/layout.css";
import vtLogo from "../assets/Virginia_Tech_Hokies_logo.png";

export default function Navbar() {
  const { pathname } = useLocation();
  const onHome = pathname === "/" || pathname === "/home";

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src={vtLogo} alt="VT logo" className="navbar-logo" />
        <span className="navbar-title">Event Finder</span>
      </Link>

      <div className="nav-buttons">
          <>
            <Link className="nav-button" to="/home">Home</Link>
            <Link className="nav-button" to="/events">Events</Link>
            <Link className="login-button" to="/login">Login</Link>
          </>
      </div>
    </nav>
  );
}
