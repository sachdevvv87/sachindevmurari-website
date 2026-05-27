import { useState } from 'react'
import AnalyzeForm from './components/AnalyzeForm'
import Dashboard from './components/Dashboard'
import './index.css'

function App() {
  const [analyzedData, setAnalyzedData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const handleAnalyze = (data) => {
    setIsAnalyzing(true);
    
    if (data.type === 'cms') {
      setLoadingMessage(`Connecting to ${data.cms}...`);
      
      // Simulate multi-step fetching for CMS
      setTimeout(() => setLoadingMessage(`Fetching recent content...`), 1500);
      setTimeout(() => setLoadingMessage(`Analyzing ${data.cms} data for AI visibility...`), 3000);
      
      setTimeout(() => {
        setAnalyzedData({
          url: data.url,
          keyword: 'CMS Content',
          overallScore: 94,
          mentions: 3200,
          sentiment: 'Highly Positive',
          topSource: 'Claude 3',
          aiReadiness: 'Excellent (API)'
        });
        setIsAnalyzing(false);
        setLoadingMessage('');
      }, 5000);

    } else {
      setLoadingMessage('Analyzing Visibility...');
      
      // Original URL analysis
      setTimeout(() => {
        setAnalyzedData({
          url: data.url,
          keyword: data.keyword,
          overallScore: 82,
          mentions: 1450,
          sentiment: 'Positive',
          topSource: 'ChatGPT',
          aiReadiness: 'High'
        });
        setIsAnalyzing(false);
        setLoadingMessage('');
      }, 2500);
    }
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <header className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '10px', background: 'linear-gradient(to right, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          AI Visibility Radar
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Discover how LLMs like ChatGPT and Claude perceive your brand across the web.
        </p>
      </header>
      <main style={{ width: '100%', maxWidth: '1000px' }}>
        {!analyzedData && (
          <div className="animate-fade-in delay-100">
             <AnalyzeForm onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} loadingMessage={loadingMessage} />
          </div>
        )}
        {analyzedData && (
          <div className="animate-fade-in">
             <Dashboard data={analyzedData} onReset={() => setAnalyzedData(null)} />
          </div>
        )}
      </main>
    </div>
  )
}
export default App
