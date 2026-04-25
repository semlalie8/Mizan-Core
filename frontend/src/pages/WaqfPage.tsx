import { useTranslation } from 'react-i18next';
import { Heart, Landmark, LineChart } from 'lucide-react';

export default function WaqfPage() {
  const { t } = useTranslation();

  const endowments = [
    { id: 'WQF-101', name: 'Educational Tech Fund', category: 'Education', size: '$25M', beneficiaries: '12k+' },
    { id: 'WQF-102', name: 'Medical Research Waqf', category: 'Healthcare', size: '$80M', beneficiaries: 'Ongoing' },
    { id: 'WQF-103', name: 'Sustainable Housing', category: 'Community', size: '$15M', beneficiaries: '500 Families' }
  ];

  return (
    <div className="waqf-page" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="section-header glass-panel" style={{ padding: '40px', background: 'linear-gradient(135deg, rgba(0,202,114,0.1), rgba(20,25,35,0.8))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <Heart size={40} color="var(--accent-green)" />
          <h1 style={{ margin: 0 }}>{t("Social Impact Waqf")}</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '700px' }}>
          {t("Manage and grow charitable endowments with 100% transparent tracking of social impact and Sharia-compliant yield reinvestment.")}
        </p>
      </div>

      <div className="impact-stats grid-3">
        <div className="stat-card glass-panel">
          <label>{t("Endowments Managed")}</label>
          <div className="value">$340M</div>
          <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>AUM Across 45 Countries</p>
        </div>
        <div className="stat-card glass-panel">
          <label>{t("Lives Impacted")}</label>
          <div className="value">1.2M</div>
          <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Direct Social Beneficiaries</p>
        </div>
        <div className="stat-card glass-panel">
          <label>{t("Reinvestment Rate")}</label>
          <div className="value">94%</div>
          <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Efficiency After Operational Costs</p>
        </div>
      </div>

      <div className="active-endowments glass-panel">
        <h2 style={{ marginBottom: '24px' }}>{t("Major Active Endowments")}</h2>
        <div className="grid-3" style={{ gap: '20px' }}>
          {endowments.map(w => (
            <div key={w.id} className="waqf-card glass-panel" style={{ border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span className="badge" style={{ background: 'rgba(0,202,114,0.1)', color: 'var(--accent-green)' }}>{w.category}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{w.id}</span>
              </div>
              <h3 style={{ marginBottom: '8px' }}>{w.name}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '0.9rem' }}>
                <span>{t("Fund Size")}: <strong>{w.size}</strong></span>
                <span>{t("Impact")}: <strong>{w.beneficiaries}</strong></span>
              </div>
              <button className="btn-action" style={{ width: '100%', marginTop: '20px', justifyContent: 'center' }}>
                {t("View Full Impact Audit")}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="waqf-pillars grid-2">
        <div className="pillar-item glass-panel">
          <Landmark size={24} color="var(--accent-gold)" style={{ marginBottom: '16px' }} />
          <h3>{t("Institutional Governance")}</h3>
          <p>{t("Standardized reporting following AAOIFI Sharia Standards for charitable trusts and perpetual endowments.")}</p>
        </div>
        <div className="pillar-item glass-panel">
          <LineChart size={24} color="var(--accent-blue)" style={{ marginBottom: '16px' }} />
          <h3>{t("Perpetual Growth")}</h3>
          <p>{t("Algorithmic reinvestment of excess yield into the principal to ensure the Waqf grows across generations.")}</p>
        </div>
      </div>
    </div>
  );
}
