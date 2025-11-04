import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listEvents } from "../api/events";
import EventBox from "../components/EventBox";
import FeatureCard from "../components/FeatureCard";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext"; // ✅ add this
import "../styles/HomePage.css";

export default function HomePage() {
  const [upcoming, setUpcoming] = useState([]);
  const { user, isAuthenticated, loading } = useAuth(); // ✅ access auth state

  useEffect(() => {
    (async () => {
      const { events } = await listEvents();
      const nextThree = [...events]
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
        .slice(0, 3);
      setUpcoming(nextThree);
    })();
  }, []);

  return (
    <>
      <Navbar />

      {/* HERO */}
      <header className="home-hero">
        <div className="home-hero-inner">
          <h1 className="home-title">Find Your Next Hokie Moment</h1>
          <p className="home-subtitle">
            One place for everything happening at Virginia Tech.
          </p>

          <div className="home-cta-row">
            <Link to="/events" className="cta cta-primary">
              Browse Events
            </Link>

            {/* 👇 Only show Sign In if not authenticated */}
            {!loading && !isAuthenticated && (
              <Link to="/login" className="cta cta-secondary">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section className="home-section">
        <div className="section-header">
          <h2 className="section-title">Why use Event Finder?</h2>
        </div>

        <div className="feature-grid">
          <FeatureCard
            title="Filters that matter"
            text="See events by category like Music, Tech, Sports, and more."
            emoji="🎯"
          />
          <FeatureCard
            title="Save & RSVP"
            text="Keep a personal list and let organizers know you’re coming."
            emoji="📌"
          />
          <FeatureCard
            title="Stay in the loop"
            text="Get alerted when new events match your interests."
            emoji="🔔"
          />
        </div>
      </section>

      {/* PREVIEW */}
      <section className="home-section">
        <div className="section-header">
          <h2 className="section-title">Coming up soon</h2>
          <Link to="/events" className="link-more">
            View all events →
          </Link>
        </div>

        <div className="event-grid">
          {upcoming.map((e) => (
            <EventBox key={e.id} event={e} />
          ))}
        </div>
      </section>
    </>
  );
}
