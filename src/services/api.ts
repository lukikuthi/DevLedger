import { supabase } from '@/lib/supabase';

import type {
  User, Transaction, Subscription, Lead, Client,
  Project, FileRecord, DashboardStats, AppMode,
  LeadStatus, ProjectStatus, BillingCycle
} from '@/types';

// ===== AUTH SERVICE =====
export const authService = {
  async register(email: string, password: string, fullName: string): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error('Falha ao criar usuário');

    return data.user as User;
  },

  async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Falha ao fazer login');

    return data.user as User;
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getUser(): Promise<User | null> {
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    return data.user as User;
  }
};

// ===== TRANSACTIONS =====
export const transactionsService = {
  async list(mode?: AppMode): Promise<Transaction[]> {
    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user?.id)
      .order('date', { ascending: false });

    if (mode) query = query.eq('mode', mode);

    const { data, error } = await query;
    if (error) throw error;

    return data;
  },

  async create(data: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: result, error } = await supabase
      .from('transactions')
      .insert([{ ...data, user_id: user?.id }])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// ===== SUBSCRIPTIONS =====
export const subscriptionsService = {
  async list(): Promise<Subscription[]> {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user?.id);

    if (error) throw error;
    return data;
  },

  async create(data: Omit<Subscription, 'id' | 'user_id' | 'created_at' | 'monthly_cost'>) {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: result, error } = await supabase
      .from('subscriptions')
      .insert([{ ...data, user_id: user?.id }])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async toggle(id: string) {
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('active')
      .eq('id', id)
      .maybeSingle();

    const { error } = await supabase
      .from('subscriptions')
      .update({ active: !sub?.active })
      .eq('id', id);

    if (error) throw error;
  }
};

// ===== LEADS =====
export const leadsService = {
  async list(): Promise<Lead[]> {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', user?.id);

    if (error) throw error;
    return data;
  },

  async create(data: Omit<Lead, 'id' | 'user_id' | 'created_at'>) {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: result, error } = await supabase
      .from('leads')
      .insert([{ ...data, user_id: user?.id }])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async updateStatus(id: string, status: LeadStatus) {
    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  },

  async convertToClient(id: string) {
    const { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (!lead) throw new Error('Lead not found');

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('clients')
      .insert([{
        user_id: user?.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        lead_id: lead.id
      }]);

    if (error) throw error;

    await supabase
      .from('leads')
      .update({ status: 'won' })
      .eq('id', id);
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// ===== CLIENTS =====
export const clientsService = {
  async list(): Promise<Client[]> {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user?.id);

    if (error) throw error;
    return data;
  },

  async create(data: Omit<Client, 'id' | 'user_id' | 'created_at'>) {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: result, error } = await supabase
      .from('clients')
      .insert([{ ...data, user_id: user?.id }])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// ===== PROJECTS =====
export const projectsService = {
  async list(): Promise<Project[]> {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('projects')
      .select('*, clients(name)')
      .eq('user_id', user?.id);

    if (error) throw error;

    return (data || []).map(p => ({
      ...p,
      client_name: p.clients?.name
    }));
  },

  async create(data: Omit<Project, 'id' | 'user_id' | 'created_at'>) {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: result, error } = await supabase
      .from('projects')
      .insert([{ ...data, user_id: user?.id }])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async updateStatus(id: string, status: ProjectStatus) {
    const { error } = await supabase
      .from('projects')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// ===== FILES =====
export const filesService = {
  async list(): Promise<FileRecord[]> {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('user_id', user?.id);

    if (error) throw error;
    return data || [];
  },

  async upload(file: File): Promise<FileRecord> {
    const { data: { user } } = await supabase.auth.getUser();

    const path = `${user?.id}/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('devledger-files')
      .upload(path, file);

    if (uploadError) throw uploadError;

    const { data: result, error } = await supabase
      .from('files')
      .insert([{
        user_id: user?.id,
        name: file.name,
        size: file.size,
        mime_type: file.type,
        storage_path: path,
        linked_to: 'personal'
      }])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async download(id: string) {
    const { data: file } = await supabase
      .from('files')
      .select('storage_path, name')
      .eq('id', id)
      .maybeSingle();

    if (!file?.storage_path) throw new Error('Arquivo não encontrado');

    const { data, error } = await supabase.storage
      .from('devledger-files')
      .download(file.storage_path);

    if (error) throw error;

    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  async delete(id: string) {
    const { data: file } = await supabase
      .from('files')
      .select('storage_path')
      .eq('id', id)
      .maybeSingle();

    if (file?.storage_path) {
      await supabase.storage
        .from('devledger-files')
        .remove([file.storage_path]);
    }

    const { error } = await supabase
      .from('files')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// ===== DASHBOARD =====
export const dashboardService = {
  async getStats(mode: AppMode): Promise<DashboardStats> {
    const { data: { user } } = await supabase.auth.getUser();

    const now = new Date().toISOString().slice(0, 7);

    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user?.id)
      .eq('mode', mode);

    const monthTx = transactions?.filter(t =>
      t.date.startsWith(now)
    ) || [];

    const totalIncome = monthTx
      .filter(t => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0);

    const totalExpenses = monthTx
      .filter(t => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);

    const { data: projects } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user?.id);

    const { data: clients } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user?.id);

    const { data: leads } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', user?.id);

    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user?.id)
      .eq('active', true);

    const subscriptionsCost = subscriptions?.reduce((s, i) => s + i.monthly_cost, 0) || 0;

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      subscriptionsCost,
      activeProjects: projects?.filter(p => p.status === 'in_progress').length || 0,
      totalClients: clients?.length || 0,
      pendingLeads: leads?.filter(l => !['won', 'lost'].includes(l.status)).length || 0,
      monthlyProfit: totalIncome - totalExpenses - subscriptionsCost,
    };
  }
};