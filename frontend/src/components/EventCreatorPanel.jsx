import "../styles/EventCreatorPanel.css";

export default function EventCreatorPanel({ attendees, loading, error }) {
  const attendingCount = attendees.filter(a => a.attending).length;
  const notAttendingCount = attendees.filter(a => !a.attending).length;

  return (
    <div className="creator-panel">
      <h2>Creator Panel</h2>
      {loading ? (
        <p>Loading attendees...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <div className="attendee-summary">
            <p><strong>{attendingCount}</strong> Going</p>
            <p><strong>{notAttendingCount}</strong> Can't Go</p>
            <p><strong>{attendees.length}</strong> Total RSVPs</p>
          </div>
          <h3>Attendee List</h3>
          {attendees.length > 0 ? (
            <ul className="attendee-list">
              {attendees.map((attendee, index) => (
                <li key={index} className={attendee.attending ? 'attending' : 'not-attending'}>
                  <span>{attendee.email}</span>
                  <span>{attendee.attending ? "Going" : "Can't Go"}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No one has RSVP'd yet.</p>
          )}
        </>
      )}
    </div>
  );
}
