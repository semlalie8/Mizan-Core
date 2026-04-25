import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import type { IjarahContract } from '../types';

export default function IjarahPage() {
  const { t } = useTranslation();
  const { data: contracts, isLoading } = useQuery<IjarahContract[]>({
    queryKey: ['ijarah-contracts'],
    queryFn: () => api.get('/v1/ijarah/contracts').then(res => res.data)
  });

  return (
    <div className="page-container fade-in">
      <header className="page-header">
        <h1>{t("Ijarah Leasing")}</h1>
        <p>{t("Sharia-compliant leasing and lease-to-own (Ijarah wa-Iqtina) operations.")}</p>
      </header>

      <section className="glass-panel">
        <div className="section-header">
          <h2>{t("Active Leases")}</h2>
        </div>
        
        {isLoading ? (
          <div className="loading-state">{t("Loading infrastructure data...")}</div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("Customer")}</th>
                  <th>{t("Asset")}</th>
                  <th>{t("Monthly Rent")}</th>
                  <th>{t("Term")}</th>
                  <th>{t("Status")}</th>
                </tr>
              </thead>
              <tbody>
                {contracts?.map(c => (
                  <tr key={c.id}>
                    <td>{c.customer_id}</td>
                    <td>{c.asset_description}</td>
                    <td>${c.monthly_rent.toLocaleString()}</td>
                    <td>{c.lease_term_months} {t("Months")}</td>
                    <td><span className={`status-pill ${c.status.toLowerCase()}`}>{c.status}</span></td>
                  </tr>
                ))}
                {contracts?.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>
                      {t("No active Ijarah contracts found.")}
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
