// ===== AUTH =====
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
}

// ===== MODE =====
export type AppMode = 'personal' | 'professional';

// ===== TRANSACTIONS =====
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  user_id: string;
  mode: AppMode;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string;
  project_id?: string;
  created_at: string;
}

// ===== SUBSCRIPTIONS =====
export type BillingCycle = 'monthly' | 'quarterly' | 'annual';

export interface Subscription {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  billing_cycle: BillingCycle;
  monthly_cost: number; // calculated
  category: string;
  active: boolean;
  created_at: string;
}

// ===== LEADS =====
export type LeadStatus = 'new' | 'contacted' | 'proposal' | 'negotiation' | 'won' | 'lost';

export interface Lead {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: LeadStatus;
  notes?: string;
  estimated_value: number;
  created_at: string;
}

// ===== CLIENTS =====
export interface Client {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  lead_id?: string;
  created_at: string;
}

// ===== PROJECTS =====
export type ProjectStatus = 'planning' | 'in_progress' | 'review' | 'completed' | 'cancelled';

export interface Project {
  id: string;
  user_id: string;
  client_id: string;
  client_name?: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  budget: number;
  start_date: string;
  end_date?: string;
  created_at: string;
}

// ===== FILES =====
export interface FileRecord {
  id: string;
  user_id: string;
  name: string;
  size: number;
  mime_type: string;
  storage_path: string;
  linked_to?: 'personal' | 'project' | 'client';
  linked_id?: string;
  created_at: string;
}

// ===== DASHBOARD =====
export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  subscriptionsCost: number;
  activeProjects: number;
  totalClients: number;
  pendingLeads: number;
  monthlyProfit: number;
}

// ===== CATEGORIES =====
export const PERSONAL_CATEGORIES = [
  'Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação',
  'Lazer', 'Vestuário', 'Tecnologia', 'Investimentos', 'Outros'
] as const;

export const PROFESSIONAL_CATEGORIES = [
  'Serviços', 'Software', 'Hardware', 'Marketing', 'Impostos',
  'Contabilidade', 'Hospedagem', 'Domínios', 'Freelance', 'Outros'
] as const;

export const SUBSCRIPTION_CATEGORIES = [
  'Streaming', 'Software', 'Cloud', 'Produtividade', 'Educação',
  'Saúde', 'Entretenimento', 'Outros'
] as const;
