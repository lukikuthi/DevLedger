import { useEffect, useState } from 'react';
import { useAppState } from '@/hooks/use-app-state';
import { dashboardService } from '@/services/api';
import type { DashboardStats } from '@/types';
import StatCard from '@/components/StatCard';
import {
  TrendingUp, TrendingDown, Wallet, CreditCard,
  FolderKanban, UserCheck, Users, DollarSign
} from 'lucide-react';

const formatCurrency = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const Dashboard = () => {
  const { mode, user } = useAppState();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getStats(mode).then(s => {
      setStats(s);
      setLoading(false);
    });
  }, [mode]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  if (loading || !stats) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-28 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const personalCards = [
    { title: 'Receitas do mês', value: formatCurrency(stats.totalIncome), icon: TrendingUp, variant: 'success' as const },
    { title: 'Despesas do mês', value: formatCurrency(stats.totalExpenses), icon: TrendingDown, variant: 'destructive' as const },
    { title: 'Saldo', value: formatCurrency(stats.balance), icon: Wallet, variant: stats.balance >= 0 ? 'success' as const : 'destructive' as const },
    { title: 'Assinaturas/mês', value: formatCurrency(stats.subscriptionsCost), icon: CreditCard, variant: 'warning' as const },
  ];

  const professionalCards = [
    { title: 'Receita do mês', value: formatCurrency(stats.totalIncome), icon: TrendingUp, variant: 'success' as const },
    { title: 'Custos do mês', value: formatCurrency(stats.totalExpenses), icon: TrendingDown, variant: 'destructive' as const },
    { title: 'Projetos ativos', value: String(stats.activeProjects), icon: FolderKanban, variant: 'default' as const },
    { title: 'Clientes', value: String(stats.totalClients), icon: UserCheck, variant: 'default' as const },
    { title: 'Leads pendentes', value: String(stats.pendingLeads), icon: Users, variant: 'warning' as const },
    { title: 'Lucro do mês', value: formatCurrency(stats.monthlyProfit), icon: DollarSign, variant: stats.monthlyProfit >= 0 ? 'success' as const : 'destructive' as const },
  ];

  const cards = mode === 'personal' ? personalCards : professionalCards;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">
          {getGreeting()}, {user?.full_name || 'Dev'} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {mode === 'personal' ? 'Visão geral das suas finanças pessoais' : 'Visão geral do seu freelance'}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-card">
        <h2 className="font-semibold text-foreground mb-2">Dica rápida</h2>
        <p className="text-sm text-muted-foreground">
          {mode === 'personal'
            ? 'Adicione suas transações diárias e assinaturas para ter uma visão clara do seu fluxo de caixa mensal.'
            : 'Cadastre seus leads e acompanhe o funil até a conversão em cliente. Vincule projetos para calcular o lucro automaticamente.'}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
