const MetricCard = ({ title, value, icon, trend, trendValue }) => {
  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', flex: '1 1 200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{title}</span>
        {icon && <span style={{ fontSize: '1.2rem' }}>{icon}</span>}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
        {value}
      </div>
      {trend && (
        <div style={{ fontSize: '0.85rem', color: trend === 'up' ? 'var(--success)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {trend === 'up' ? '↑' : '↓'} {trendValue}
        </div>
      )}
    </div>
  );
};
export default MetricCard;
