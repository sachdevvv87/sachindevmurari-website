const ScoreDial = ({ score }) => {
  // Simple CSS based circle
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <div style={{ position: 'relative', width: '150px', height: '150px' }}>
        <svg width="150" height="150" viewBox="0 0 150 150" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="75" cy="75" r={radius}
            fill="transparent"
            stroke="var(--border-color)"
            strokeWidth="12"
          />
          <circle
            cx="75" cy="75" r={radius}
            fill="transparent"
            stroke="url(#gradient)"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent-primary)" />
              <stop offset="100%" stopColor="var(--accent-secondary)" />
            </linearGradient>
          </defs>
        </svg>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 700 }}>{score}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>/ 100</span>
        </div>
      </div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Overall AI Visibility</h3>
    </div>
  );
};
export default ScoreDial;
