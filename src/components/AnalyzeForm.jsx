import { useState } from 'react';
import CmsConnector from './CmsConnector';

const AnalyzeForm = ({ onAnalyze, isAnalyzing, loadingMessage }) => {
  const [activeTab, setActiveTab] = useState('url'); // 'url' or 'cms'
  const [url, setUrl] = useState('sachindevmurari.com');
  const [keyword, setKeyword] = useState('');

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (!url) return;
    onAnalyze({ type: 'url', url, keyword });
  };

  return (
    <div className="glass-panel" style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', overflow: 'hidden', position: 'relative' }}>
      
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '30px' }}>
        <button 
          onClick={() => setActiveTab('url')}
          disabled={isAnalyzing}
          style={{
            flex: 1, padding: '16px', background: 'transparent', border: 'none',
            color: activeTab === 'url' ? 'var(--text-primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'url' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            fontWeight: activeTab === 'url' ? 600 : 400,
            cursor: isAnalyzing ? 'not-allowed' : 'pointer', transition: 'all 0.2s', fontSize: '1rem'
          }}
        >
          Quick Analysis (URL)
        </button>
        <button 
          onClick={() => setActiveTab('cms')}
          disabled={isAnalyzing}
          style={{
            flex: 1, padding: '16px', background: 'transparent', border: 'none',
            color: activeTab === 'cms' ? 'var(--text-primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'cms' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            fontWeight: activeTab === 'cms' ? 600 : 400,
            cursor: isAnalyzing ? 'not-allowed' : 'pointer', transition: 'all 0.2s', fontSize: '1rem'
          }}
        >
          Deep Analysis (CMS)
        </button>
      </div>

      {activeTab === 'url' ? (
        <div className="animate-fade-in">
          <h2 style={{ marginBottom: '24px', fontSize: '1.5rem', fontWeight: 600 }}>Analyze via URL</h2>
          <form onSubmit={handleUrlSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="url" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Website URL</label>
              <input 
                type="text" id="url" value={url} onChange={(e) => setUrl(e.target.value)} required
                style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="keyword" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Target Keyword (Optional)</label>
              <input 
                type="text" id="keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)}
                style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>
            <button 
              type="submit" disabled={isAnalyzing}
              style={{
                marginTop: '10px', padding: '14px', borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                color: 'white', border: 'none', fontSize: '1rem', fontWeight: 600,
                cursor: isAnalyzing ? 'not-allowed' : 'pointer', opacity: isAnalyzing ? 0.8 : 1, transition: 'all 0.2s'
              }}
            >
              Analyze URL
            </button>
          </form>
        </div>
      ) : (
        <div className="animate-fade-in">
          <CmsConnector onConnect={onAnalyze} isAnalyzing={isAnalyzing} />
        </div>
      )}

      {/* Overlay Loading State */}
      {isAnalyzing && (
        <div className="animate-fade-in" style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'var(--bg-card)', backdropFilter: 'blur(8px)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px', zIndex: 10
        }}>
          <span className="spinner" style={{
            width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite'
          }}></span>
          <p style={{ fontWeight: 500, fontSize: '1.1rem' }}>{loadingMessage}</p>
        </div>
      )}
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AnalyzeForm;
