import { useState } from 'react';
import ConnectionModal from './ConnectionModal';

const CmsConnector = ({ onConnect, isAnalyzing }) => {
  const [selectedCms, setSelectedCms] = useState(null);

  const cmsOptions = [
    { id: 'wordpress', name: 'WordPress', icon: 'W', color: '#21759b' },
    { id: 'wix', name: 'Wix', icon: 'W', color: '#000000' },
    { id: 'strapi', name: 'Strapi', icon: 'S', color: '#4945ff' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '10px' }}>
        Select your CMS to allow us to fetch your content directly for deeper AI visibility analysis.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
        {cmsOptions.map(cms => (
          <button
            key={cms.id}
            onClick={() => setSelectedCms(cms)}
            disabled={isAnalyzing}
            style={{
              padding: '24px',
              borderRadius: '12px',
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              cursor: isAnalyzing ? 'not-allowed' : 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s',
              opacity: isAnalyzing ? 0.6 : 1
            }}
            onMouseEnter={(e) => !isAnalyzing && (e.currentTarget.style.borderColor = cms.color, e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => !isAnalyzing && (e.currentTarget.style.borderColor = 'var(--border-color)', e.currentTarget.style.transform = 'translateY(0)')}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: cms.color, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {cms.icon}
            </div>
            <span style={{ fontWeight: 500 }}>{cms.name}</span>
          </button>
        ))}
      </div>

      {selectedCms && (
        <ConnectionModal 
          cms={selectedCms} 
          onClose={() => setSelectedCms(null)} 
          onSubmit={(credentials) => {
            setSelectedCms(null);
            onConnect({ type: 'cms', cms: selectedCms.name, ...credentials });
          }} 
        />
      )}
    </div>
  );
};

export default CmsConnector;
