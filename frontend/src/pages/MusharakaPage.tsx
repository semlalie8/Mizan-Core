import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import type { MusharakaContract } from '../types';

export default function MusharakaPage() {
  const { t } = useTranslation();
  const { data: contracts, isLoading } = useQuery<MusharakaContract[]>({
    queryKey: ['musharaka-contracts'],
    queryFn: () => api.get('/v1/musharaka/contracts').then(res => res.data)
  });

  return (
    <div className="page-container fade-in">
      <header className="page-header">
        <h1>{t("Musharaka Joint Ventures")}</h1>
        <p>{t("Collaborative equity financing and risk-sharing models.")}</p>
      </header>

      <section className="glass-panel">
        <div className="section-header">
          <h2>{t("Joint Ventures")}</h2>
        </div>
        
        {isLoading ? (
          <div className="loading-state">{t("Loading infrastructure data...")}</div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("Asset")}</th>
                  <th>{t("Type")}</th>
                  <th>{t("Total Capital")}</th>
                  <th>{t("Status")}</th>
                </tr>
              </thead>
              <tbody>
                {contracts?.map(c => (
                  <tr key={c.id}>
                    <td>{c.asset_description}</td>
                    <td>{c.musharaka_type}</td>
                    <td>${c.total_capital.toLocaleString()}</td>
                    <td><span className={`status-pill ${c.status.toLowerCase()}`}>{c.status}</span></td>
                  </tr>
                ))}
                {contracts?.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '40px' }}>
                      {t("No active Musharaka ventures found.")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
