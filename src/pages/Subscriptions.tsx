import { useEffect, useState } from 'react';
import { subscriptionsService } from '@/services/api';
import type { Subscription, BillingCycle } from '@/types';
import { SUBSCRIPTION_CATEGORIES } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EmptyState from '@/components/EmptyState';
import { Plus, Trash2, X, CreditCard, ToggleLeft, ToggleRight } from 'lucide-react';

const formatCurrency = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const Subscriptions = () => {
  const [items, setItems] = useState<Subscription[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [category, setCategory] = useState('');

  const load = () => {
    setLoading(true);
    subscriptionsService.list().then(d => { setItems(d); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !category) return;
    await subscriptionsService.create({
      name, amount: parseFloat(amount), billing_cycle: cycle,
      category, active: true,
    });
    setShowForm(false);
    setName(''); setAmount(''); setCategory('');
    load();
  };

  const totalMonthly = items.filter(s => s.active).reduce((s, i) => s + i.monthly_cost, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Assinaturas</h1>
          <p className="text-sm text-muted-foreground">
            Custo mensal total: <span className="font-semibold text-foreground">{formatCurrency(totalMonthly)}</span>
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="sm" className="gradient-primary text-primary-foreground">
          {showForm ? <X className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
          {showForm ? 'Cancelar' : 'Nova'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-4 shadow-card space-y-3 animate-scale-in">
          <Input placeholder="Nome (ex: Netflix)" value={name} onChange={e => setName(e.target.value)} required />
          <Input type="number" step="0.01" placeholder="Valor" value={amount} onChange={e => setAmount(e.target.value)} required />
          <select value={cycle} onChange={e => setCycle(e.target.value as BillingCycle)}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground">
            <option value="monthly">Mensal</option>
            <option value="quarterly">Trimestral</option>
            <option value="annual">Anual</option>
          </select>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground" required>
            <option value="">Categoria</option>
            {SUBSCRIPTION_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <Button type="submit" className="w-full gradient-primary text-primary-foreground">Salvar</Button>
        </form>
      )}

      {loading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState title="Nenhuma assinatura" description="Cadastre suas assinaturas para calcular o custo mensal proporcional automaticamente." />
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className={`bg-card rounded-xl border border-border p-4 shadow-card flex items-center justify-between gap-3 ${!item.active ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4 text-warning" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.category} · {formatCurrency(item.monthly_cost)}/mês
                    {item.billing_cycle !== 'monthly' && ` (${formatCurrency(item.amount)}/${item.billing_cycle === 'annual' ? 'ano' : 'trim.'})`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={async () => { await subscriptionsService.toggle(item.id); load(); }}
                  className="text-muted-foreground hover:text-primary transition-colors p-1">
                  {item.active ? <ToggleRight className="w-5 h-5 text-primary" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
                <button onClick={async () => { await subscriptionsService.delete(item.id); load(); }}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
