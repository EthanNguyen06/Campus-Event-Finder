import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import EventMainPage from "./pages/EventMainPage";
import EventDetailPage from "./pages/EventDetailsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/events" element={<EventMainPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<div className="container">Not found</div>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
