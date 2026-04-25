import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Plus, ShoppingCart, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import api from '../lib/api';
import type { MurabahaContract } from '../types';
import NewRequestModal from '../components/NewRequestModal';

export default function MurabahaPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: contracts, isLoading, error } = useQuery<MurabahaContract[]>({
    queryKey: ['murabaha-contracts'],
    queryFn: async () => {
      const res = await api.get('/murabaha/contracts');
      return res.data;
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: async (contractId: number) => {
      return api.post(`/murabaha/contracts/${contractId}/purchase`, {
        transfer_proof_reference: `TRX-${Math.random().toString(36).substring(7).toUpperCase()}`
      }, {
        headers: { 'x-idempotency-key': `purchase-${contractId}-${Date.now()}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['murabaha-contracts'] });
    }
  });

  const saleMutation = useMutation({
    mutationFn: async (contractId: number) => {
      return api.post(`/murabaha/contracts/${contractId}/sale`, {}, {
        headers: { 'x-idempotency-key': `sale-${contractId}-${Date.now()}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['murabaha-contracts'] });
    }
  });

  if (isLoading) return (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>{t("Fetching Sharia Sequence Data...")}</p>
    </div>
  );

  if (error) return (
    <div className="error-state">
      <AlertCircle color="var(--error-red)" size={48} />
      <p>{t("Failed to connect to Mizan Backend")}</p>
    </div>
  );

  return (
    <div className="murabaha-page">
      <section className="stats-row">
        <div className="stat-card glass-panel">
          <span className="stat-label">{t("Total GMV Processed")}</span>
          <h2 className="stat-value">$5.2M <span className="trend positive">↑ 12%</span></h2>
        </div>
        <div className="stat-card glass-panel">
          <span className="stat-label">{t("Active Murabaha Contracts")}</span>
          <h2 className="stat-value">{contracts?.length || 0}</h2>
        </div>
        <div className="stat-card glass-panel">
          <span className="stat-label">{t("Late Fees to Charity")}</span>
          <h2 className="stat-value gold">$12,400</h2>
        </div>
      </section>

      <section className="contracts-section glass-panel">
        <div className="section-header">
          <h2>{t("Murabaha Lifecycle Control")}</h2>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            {t("New API Request")}
          </button>
        </div>
        
        <div className="table-responsive">
          <table className="contracts-table">
            <thead>
              <tr>
                <th>{t("Contract ID")}</th>
                <th>{t("Customer")}</th>
                <th>{t("Status")}</th>
                <th>{t("Asset Ownership")}</th>
                <th>{t("Compliance")}</th>
                <th>{t("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {contracts?.map(c => (
                <tr key={c.id}>
                  <td>#{c.id}</td>
                  <td>{c.customer_id}</td>
                  <td>
                    <span className={`status-pill ${c.status.toLowerCase()}`}>
                      {t(c.status)}
                    </span>
                  </td>
                  <td>
                    <div className="ownership-indicator">
                      {c.asset_owned_by_bank ? (
                        <span className="success-text"><CheckCircle size={14} /> {t("Bank Owned")}</span>
                      ) : (
                        <span className="pending-text"><Clock size={14} /> {t("Vendor Owned")}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={c.sharia_sequence_verified ? 'success-text' : 'warning-text'}>
                      {c.sharia_sequence_verified ? t("Verified") : t("Pending")}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {c.status === 'REQUESTED' && (
                        <button 
                          className="btn-action" 
                          onClick={() => purchaseMutation.mutate(c.id)}
                          disabled={purchaseMutation.isPending}
                        >
                          <ShoppingCart size={14} /> {t("Purchase Asset")}
                        </button>
                      )}
                      {c.status === 'BANK_PURCHASED' && (
                        <button 
                          className="btn-action success" 
                          onClick={() => saleMutation.mutate(c.id)}
                          disabled={saleMutation.isPending}
                        >
                          <CheckCircle size={14} /> {t("Execute Sale")}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <NewRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
