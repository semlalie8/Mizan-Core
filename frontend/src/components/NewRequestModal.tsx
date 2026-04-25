import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Calculator } from 'lucide-react';
import api from '../lib/api';

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewRequestModal({ isOpen, onClose }: NewRequestModalProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    customer_id: 'CUST-' + Math.floor(1000 + Math.random() * 9000),
    asset_type: 'VEHICLE',
    asset_description: '',
    asset_cost: 0,
    bank_markup: 0
  });

  const mutation = useMutation({
    mutationFn: (data: any) => api.post('/murabaha/requests', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['murabaha-contracts'] });
      onClose();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="modal-container glass-panel"
          >
            <div className="modal-header">
              <div className="title-with-icon">
                <Calculator size={20} color="var(--accent-green)" />
                <h2>{t("New Murabaha Financing Request")}</h2>
              </div>
              <button className="close-btn" onClick={onClose}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>{t("Customer Identifier")}</label>
                <input 
                  type="text" 
                  value={formData.customer_id} 
                  readOnly
                  className="glass-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t("Asset Type")}</label>
                  <select 
                    value={formData.asset_type}
                    onChange={(e) => setFormData({...formData, asset_type: e.target.value})}
                    className="glass-input"
                  >
                    <option value="VEHICLE">{t("Vehicle")}</option>
                    <option value="REAL_ESTATE">{t("Real Estate")}</option>
                    <option value="CONSUMER_GOODS">{t("Consumer Goods")}</option>
                    <option value="COMMODITY">{t("Commodity")}</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>{t("Asset Description")}</label>
                <textarea 
                  required
                  placeholder={t("e.g. 2024 Toyota Corolla Hybrid")}
                  value={formData.asset_description}
                  onChange={(e) => setFormData({...formData, asset_description: e.target.value})}
                  className="glass-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t("Asset Cost ($)")}</label>
                  <input 
                    type="number" 
                    required
                    value={formData.asset_cost}
                    onChange={(e) => setFormData({...formData, asset_cost: Number(e.target.value)})}
                    className="glass-input"
                  />
                </div>
                <div className="form-group">
                  <label>{t("Bank Markup ($)")}</label>
                  <input 
                    type="number" 
                    required
                    value={formData.bank_markup}
                    onChange={(e) => setFormData({...formData, bank_markup: Number(e.target.value)})}
                    className="glass-input"
                  />
                </div>
              </div>

              <div className="total-calculation">
                <span>{t("Total Financing Amount")}:</span>
                <strong>${(formData.asset_cost + formData.bank_markup).toLocaleString()}</strong>
              </div>

              <div className="form-actions">
                <button type="button" onClick={onClose} className="btn-secondary">{t("Cancel")}</button>
                <button type="submit" disabled={mutation.isPending} className="btn-primary">
                  {mutation.isPending ? (
                    <div className="spinner-small"></div>
                  ) : (
                    <>
                      <Send size={18} />
                      {t("Submit Application")}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
