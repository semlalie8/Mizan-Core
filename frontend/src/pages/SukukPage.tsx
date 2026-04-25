import { useTranslation } from 'react-i18next';
import { BarChart3, Lock, Zap, Globe } from 'lucide-react';

export default function SukukPage() {
  const { t } = useTranslation();

  const sukukOfferings = [
    { id: 'SKK-001', name: 'Green Energy Sukuk', yield: '5.2%', maturity: '5 Years', rating: 'AA' },
    { id: 'SKK-002', name: 'Infrastructure Waqf Bond', yield: '4.8%', maturity: '10 Years', rating: 'A+' },
    { id: 'SKK-003', name: 'Sovereign Digital Sukuk', yield: '3.9%', maturity: '2 Years', rating: 'AAA' }
  ];

  return (
    <div className="sukuk-page" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="section-header glass-panel" style={{ padding: '40px', background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(20,25,35,0.8))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <Globe size={40} color="var(--accent-gold)" />
          <h1 style={{ margin: 0 }}>{t("Sukuk Digital Exchange")}</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '700px' }}>
          {t("Access institutional-grade fractionalized Sukuk certificates with automated Sharia compliance and secondary market liquidity.")}
        </p>
      </div>

      <div className="market-overview grid-3">
        <div className="stat-card glass-panel">
          <label>{t("Total Volume")}</label>
          <div className="value">$4.2B</div>
          <div className="trend positive">+12.5%</div>
        </div>
        <div className="stat-card glass-panel">
          <label>{t("Active Offerings")}</label>
          <div className="value">148</div>
          <div className="trend positive">NEW</div>
        </div>
        <div className="stat-card glass-panel">
          <label>{t("Avg Yield")}</label>
          <div className="value">4.65%</div>
          <div className="trend neutral">STABLE</div>
        </div>
      </div>

      <div className="offerings-section glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>{t("Active Sukuk Offerings")}</h2>
          <button className="btn-primary">{t("View All")}</button>
        </div>
        
        <div className="table-responsive">
          <table className="glass-table">
            <thead>
              <tr>
                <th>{t("Asset Name")}</th>
                <th>{t("Proj. Yield")}</th>
                <th>{t("Maturity")}</th>
                <th>{t("Rating")}</th>
                <th>{t("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {sukukOfferings.map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{s.id}</div>
                  </td>
                  <td style={{ color: 'var(--accent-green)', fontWeight: 700 }}>{s.yield}</td>
                  <td>{s.maturity}</td>
                  <td><span className="status-pill active">{s.rating}</span></td>
                  <td>
                    <button className="btn-action">{t("Invest")}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="features-grid grid-3">
        <div className="feature-card glass-panel">
          <Lock size={24} color="var(--accent-green)" />
          <h3>{t("Tokenized Ownership")}</h3>
          <p>{t("Direct ownership of underlying assets secured via smart contracts.")}</p>
        </div>
        <div className="feature-card glass-panel">
          <Zap size={24} color="var(--accent-gold)" />
          <h3>{t("Instant Settlement")}</h3>
          <p>{t("T+0 trade settlement using Sharia-compliant stablecoins.")}</p>
        </div>
        <div className="feature-card glass-panel">
          <BarChart3 size={24} color="var(--accent-blue)" />
          <h3>{t("Secondary Trading")}</h3>
          <p>{t("Deep liquidity pools for peer-to-peer certificate trading.")}</p>
        </div>
      </div>
    </div>
  );
}
