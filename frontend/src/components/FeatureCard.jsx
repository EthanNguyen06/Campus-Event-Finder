export default function FeatureCard({ title, text, emoji }) {
  return (
    <div className="feature-card">
      <div className="feature-emoji" aria-hidden="true">{emoji}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-text">{text}</p>
    </div>
  );
}