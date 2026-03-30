import { useEffect, useState } from 'react';
import { useAppState } from '@/hooks/use-app-state';
import { transactionsService } from '@/services/api';
import type { Transaction, TransactionType } from '@/types';
import { PERSONAL_CATEGORIES, PROFESSIONAL_CATEGORIES } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EmptyState from '@/components/EmptyState';
import { Plus, Trash2, TrendingUp, TrendingDown, X } from 'lucide-react';

const formatCurrency = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const Transactions = () => {
  const { mode } = useAppState();
  const [items, setItems] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const categories = mode === 'personal' ? PERSONAL_CATEGORIES : PROFESSIONAL_CATEGORIES;

  const load = () => {
    setLoading(true);
    transactionsService.list(mode).then(d => {
      setItems(d.sort((a, b) => b.date.localeCompare(a.date)));
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !category) return;
    await transactionsService.create({
      mode,
      type,
      amount: parseFloat(amount),
      description,
      category,
      date,
    });
    setShowForm(false);
    setAmount(''); setDescription(''); setCategory('');
    load();
  };

  const handleDelete = async (id: string) => {
    await transactionsService.delete(id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Transações</h1>
          <p className="text-sm text-muted-foreground">
            {mode === 'personal' ? 'Finanças pessoais' : 'Finanças profissionais'}
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="sm" className="gradient-primary text-primary-foreground">
          {showForm ? <X className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
          {showForm ? 'Cancelar' : 'Nova'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-4 shadow-card space-y-3 animate-scale-in">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                type === 'income' ? 'bg-success/10 text-success border border-success/30' : 'bg-muted text-muted-foreground'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-1" /> Receita
            </button>
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                type === 'expense' ? 'bg-destructive/10 text-destructive border border-destructive/30' : 'bg-muted text-muted-foreground'
              }`}
            >
              <TrendingDown className="w-4 h-4 inline mr-1" /> Despesa
            </button>
          </div>
          <Input type="number" step="0.01" placeholder="Valor" value={amount} onChange={e => setAmount(e.target.value)} required />
          <Input placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} required />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground"
            required
          >
            <option value="">Selecione a categoria</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          <Button type="submit" className="w-full gradient-primary text-primary-foreground">Salvar</Button>
        </form>
      )}

      {loading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="Nenhuma transação"
          description="Adicione sua primeira receita ou despesa para começar a controlar suas finanças."
          action={
            <Button onClick={() => setShowForm(true)} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" /> Adicionar
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="bg-card rounded-xl border border-border p-4 shadow-card flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  item.type === 'income' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                }`}>
                  {item.type === 'income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.description}</p>
                  <p className="text-xs text-muted-foreground">{item.category} · {new Date(item.date).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-sm font-semibold ${item.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                  {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                </span>
                <button onClick={() => handleDelete(item.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
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

export default Transactions;
