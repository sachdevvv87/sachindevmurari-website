import MetricCard from './MetricCard';
import ScoreDial from './ScoreDial';

const Dashboard = ({ data, onReset }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>Analysis Results</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Showing AI visibility data for <strong style={{ color: 'var(--text-primary)' }}>{data.url}</strong>
          </p>
        </div>
        <button 
          onClick={onReset}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            background: 'transparent',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.borderColor = 'rgba(255,255,255,0.2)'; }}
          onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'var(--border-color)'; }}
        >
          Analyze Another
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '40px', display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
          <ScoreDial score={data.overallScore} />
        </div>
        <div style={{ flex: '2 1 400px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>Summary Insights</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--success)' }}>✓</span>
              <span style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Your brand is frequently mentioned in context with <strong style={{color: 'white'}}>{data.keyword || 'your industry'}</strong> across major LLMs.
              </span>
            </li>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--success)' }}>✓</span>
              <span style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Sentiment is predominantly <strong style={{color: 'white'}}>{data.sentiment}</strong>, indicating a strong reputation in AI training data.
              </span>
            </li>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--accent-primary)' }}>ℹ</span>
              <span style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Top referring AI source is <strong style={{color: 'white'}}>{data.topSource}</strong>. Consider optimizing content specifically for their retrieval systems.
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        <MetricCard title="LLM Mentions" value={data.mentions} icon="💬" trend="up" trendValue="+12% this month" />
        <MetricCard title="Sentiment" value={data.sentiment} icon="😊" trend="up" trendValue="Consistent" />
        <MetricCard title="Top Source" value={data.topSource} icon="🤖" />
        <MetricCard title="AI Readiness" value={data.aiReadiness} icon="⚡" />
      </div>

    </div>
  );
};

export default Dashboard;
