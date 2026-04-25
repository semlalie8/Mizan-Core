export type ContractStatus = 
  | 'REQUESTED' 
  | 'CUSTOMER_ACCEPTED' 
  | 'BANK_PURCHASED' 
  | 'SOLD_TO_CUSTOMER' 
  | 'ACTIVE' 
  | 'COMPLETED' 
  | 'DEFAULTED';

export type AssetType = 
  | 'CONSUMER_GOODS' 
  | 'VEHICLE' 
  | 'REAL_ESTATE' 
  | 'COMMODITY';

export interface MurabahaContract {
  id: number;
  customer_id: string;
  asset_type: AssetType;
  asset_description: string;
  asset_cost: number;
  bank_markup: number;
  total_financing_amount: number;
  cost_disclosed: boolean;
  markup_disclosed: boolean;
  asset_owned_by_bank: boolean;
  bank_purchase_timestamp?: string;
  sale_contract_timestamp?: string;
  fatwa_reference: string;
  sharia_sequence_verified: boolean;
  status: ContractStatus;
}

export interface TakafulPool {
  id: number;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  total_funds: number;
}

export interface TakafulPolicy {
  id: number;
  pool_id: number;
  customer_id: string;
  coverage_amount: number;
  contribution_amount: number;
  status: 'ACTIVE' | 'EXPIRED' | 'CLAIMED';
  start_date: string;
  end_date: string;
}

export interface TakafulClaim {
  id: number;
  policy_id: number;
  pool_id: number;
  amount_requested: number;
  incident_description: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'PAID';
  submission_date: string;
}

export interface MudarabaContract {
  id: number;
  investor_id: string;
  manager_id: string;
  initial_capital: number;
  investor_profit_ratio: number;
  manager_profit_ratio: number;
  status: 'PROPOSAL' | 'ACTIVE' | 'LIQUIDATED' | 'TERMINATED';
}

export interface MusharakaContract {
  id: number;
  musharaka_type: 'PERMANENT' | 'DIMINISHING';
  total_capital: number;
  asset_description: string;
  status: 'ACTIVE' | 'DISSOLVED';
}

export interface IjarahContract {
  id: number;
  customer_id: string;
  asset_description: string;
  asset_value: number;
  lease_term_months: number;
  monthly_rent: number;
  is_lease_to_own: boolean;
  status: 'ACTIVE' | 'COMPLETED' | 'TERMINATED';
}
