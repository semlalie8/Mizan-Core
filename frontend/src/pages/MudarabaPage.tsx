import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import type { MudarabaContract } from '../types';

export default function MudarabaPage() {
  const { t } = useTranslation();
  const { data: contracts, isLoading } = useQuery<MudarabaContract[]>({
    queryKey: ['mudaraba-contracts'],
    queryFn: () => api.get('/v1/mudaraba/contracts').then(res => res.data)
  });

  return (
    <div className="page-container fade-in">
      <header className="page-header">
        <h1>{t("Mudaraba Partnerships")}</h1>
        <p>{t("Profit-sharing management between investors (Rab-al-Maal) and managers (Mudarib).")}</p>
      </header>

      <section className="glass-panel">
        <div className="section-header">
          <h2>{t("Active Partnerships")}</h2>
        </div>
        
        {isLoading ? (
          <div className="loading-state">{t("Loading infrastructure data...")}</div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("Investor")}</th>
                  <th>{t("Manager")}</th>
                  <th>{t("Capital")}</th>
                  <th>{t("Status")}</th>
                </tr>
              </thead>
              <tbody>
                {contracts?.map(c => (
                  <tr key={c.id}>
                    <td>{c.investor_id}</td>
                    <td>{c.manager_id}</td>
                    <td>${c.initial_capital.toLocaleString()}</td>
                    <td><span className={`status-pill ${c.status.toLowerCase()}`}>{c.status}</span></td>
                  </tr>
                ))}
                {contracts?.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '40px' }}>
                      {t("No active Mudaraba contracts found.")}
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
