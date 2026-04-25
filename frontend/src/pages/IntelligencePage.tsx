import { useState } from 'react';
import { Search, TrendingUp, ShieldCheck, Share2, BrainCircuit } from 'lucide-react';

interface ShariaAnalysis {
  score: number;
  alignment: string;
  sentiment: string;
  signals: string[];
  forecast: number;
}

export default function IntelligencePage() {
  const [query, setQuery] = useState('');
  const [analysis, setAnalysis] = useState<ShariaAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    // Simulate API call to /ai/analyze/ethical
    setTimeout(() => {
      setAnalysis({
        score: 85,
        alignment: "HIGH",
        sentiment: "Highly Ethical / Socially Responsible",
        signals: [
          "No involvement in prohibited industries (Riba, Gharar, etc.)",
          "High transparency score in recent financial audits",
          "Positive social impact signals from regional news sources"
        ],
        forecast: 4.2
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="intelligence-page" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="section-header glass-panel" style={{ padding: '40px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(0,202,114,0.1), rgba(20,25,35,0.8))' }}>
        <BrainCircuit size={48} color="var(--accent-green)" style={{ marginBottom: '16px' }} />
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Sharia <span>Intelligence</span></h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Leverage AlphaEar predictive models and ethical sentiment screening to make Sharia-compliant investment decisions with 100% transparency.
        </p>
      </div>

      <div className="search-section glass-panel">
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
            <input 
              type="text" 
              className="glass-input" 
              placeholder="Search Asset, Company, or Project for Sharia Analysis..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: '100%', paddingLeft: '48px', height: '56px', fontSize: '1.1rem' }}
            />
          </div>
          <button className="btn-primary" onClick={runAnalysis} disabled={loading} style={{ height: '56px', padding: '0 32px' }}>
            {loading ? 'Analyzing...' : 'Run Analysis'}
          </button>
        </div>

        {analysis && (
          <div className="analysis-results" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px', animation: 'fadeIn 0.5s ease-out' }}>
            <div className="score-card glass-panel" style={{ textAlign: 'center', border: '1px solid var(--accent-green)' }}>
              <h3 style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.9rem', marginBottom: '16px' }}>Ethical Alignment</h3>
              <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--accent-green)' }}>{analysis.score}%</div>
              <div className="status-pill active" style={{ marginTop: '12px' }}>{analysis.alignment} ALIGNMENT</div>
            </div>
            
            <div className="insights-card glass-panel">
              <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={20} color="var(--accent-green)" />
                AI Insights & Signals
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {analysis.signals.map((s: string, i: number) => (
                  <li key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.95rem' }}>
                    • {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="predictive-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div className="yield-predictor glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <TrendingUp size={20} color="var(--accent-gold)" />
              Yield Projection (AlphaEar Predictor)
            </h3>
            <span className="badge" style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--accent-gold)' }}>30D HORIZON</span>
          </div>
          <div style={{ height: '150px', display: 'flex', alignItems: 'flex-end', gap: '8px', paddingBottom: '20px' }}>
             {/* Mock Chart Bars */}
             {[40, 55, 45, 65, 85, 75, 95].map((h, i) => (
               <div key={i} style={{ flex: 1, background: i === 6 ? 'var(--accent-gold)' : 'rgba(212,175,55,0.3)', height: `${h}%`, borderRadius: '4px 4px 0 0' }}></div>
             ))}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            The Kronos model predicts a <strong>4.2%</strong> annual yield based on current liquidity pulses and news sentiment.
          </p>
        </div>

        <div className="logic-visualizer glass-panel">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <Share2 size={20} color="var(--accent-green)" />
            Logic Transmission Chain
          </h3>
          <div style={{ background: 'rgba(0,0,0,0.2)', height: '150px', borderRadius: '12px', border: '1px dashed var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ padding: '8px 16px', background: 'var(--panel-bg)', border: '1px solid var(--accent-green)', borderRadius: '8px' }}>Bank</div>
                <div style={{ width: '40px', height: '1px', background: 'var(--accent-green)' }}></div>
                <div style={{ padding: '8px 16px', background: 'var(--panel-bg)', border: '1px solid var(--accent-gold)', borderRadius: '8px' }}>Asset</div>
                <div style={{ width: '40px', height: '1px', background: 'var(--accent-green)' }}></div>
                <div style={{ padding: '8px 16px', background: 'var(--panel-bg)', border: '1px solid var(--accent-green)', borderRadius: '8px' }}>Customer</div>
             </div>
             <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Auto-generated Draw.io Flow</p>
          </div>
          <button className="btn-action" style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}>
            Export Audit Visualization
          </button>
        </div>
      </div>
    </div>
  );
}
