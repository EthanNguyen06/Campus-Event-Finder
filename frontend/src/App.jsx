import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import EventMainPage from "./pages/EventMainPage";
import EventDetailPage from "./pages/EventDetailsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/events" element={<EventMainPage />} />
      <Route path="/events/:id" element={<EventDetailPage />} />
      <Route path="*" element={<div className="container">Not found</div>} />
    </Routes>
  );
}

export default App;