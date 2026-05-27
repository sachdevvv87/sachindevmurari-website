import { useState } from 'react';

const ConnectionModal = ({ cms, onClose, onSubmit }) => {
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ url, apiKey });
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '40px', width: '90%', maxWidth: '500px', position: 'relative' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer' }}
        >×</button>
        
        <h3 style={{ marginBottom: '8px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          Connect to {cms.name}
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
          Enter your API details to grant read-only access for content analysis.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{cms.name} Site URL</label>
            <input 
              type="url" required placeholder="https://..."
              value={url} onChange={(e) => setUrl(e.target.value)}
              style={{
                padding: '12px 16px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>API Key / Access Token</label>
            <input 
              type="password" required placeholder="Enter your secret key"
              value={apiKey} onChange={(e) => setApiKey(e.target.value)}
              style={{
                padding: '12px 16px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none'
              }}
            />
          </div>

          <button 
            type="submit"
            style={{
              marginTop: '16px', padding: '14px', borderRadius: '8px',
              background: cms.color, color: 'white', border: 'none',
              fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = 0.8}
            onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
          >
            Connect & Analyze
          </button>
        </form>
      </div>
    </div>
  );
};
export default ConnectionModal;
