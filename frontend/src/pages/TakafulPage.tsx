import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';

export default function TakafulPage() {
  const { t } = useTranslation();
  
  return (
    <div className="takaful-page">
      <section className="stats-row">
        <div className="stat-card glass-panel">
          <span className="stat-label">{t("Mutual Fund Volume")}</span>
          <h2 className="stat-value">$14.8M</h2>
        </div>
        <div className="stat-card glass-panel">
          <span className="stat-label">{t("Active Participants")}</span>
          <h2 className="stat-value">42,500</h2>
        </div>
        <div className="stat-card glass-panel">
          <span className="stat-label">{t("Claims Paid (Tabarru')")}</span>
          <h2 className="stat-value gold">$2.1M</h2>
        </div>
      </section>

      <section className="coming-soon glass-panel">
        <Shield size={64} color="var(--accent-green)" />
        <h2>{t("Takaful (Mutual Risk) Engine")}</h2>
        <p>{t("The decentralized mutual risk pool module is currently under development.")}</p>
      </section>
    </div>
  );
}
