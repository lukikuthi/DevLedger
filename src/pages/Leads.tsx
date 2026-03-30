import { useEffect, useState } from 'react';
import { leadsService } from '@/services/api';
import type { Lead, LeadStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EmptyState from '@/components/EmptyState';
import { Plus, Trash2, X, UserPlus, ArrowRight } from 'lucide-react';

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Novo', contacted: 'Contatado', proposal: 'Proposta',
  negotiation: 'Negociação', won: 'Ganho', lost: 'Perdido',
};

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: 'bg-info/10 text-info', contacted: 'bg-warning/10 text-warning',
  proposal: 'bg-primary/10 text-primary', negotiation: 'bg-accent text-accent-foreground',
  won: 'bg-success/10 text-success', lost: 'bg-destructive/10 text-destructive',
};

const STATUSES: LeadStatus[] = ['new', 'contacted', 'proposal', 'negotiation', 'won', 'lost'];

const Leads = () => {
  const [items, setItems] = useState<Lead[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [value, setValue] = useState('');

  const load = () => {
    setLoading(true);
    leadsService.list().then(d => { setItems(d); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    await leadsService.create({
      name, email, phone, company, status: 'new',
      estimated_value: parseFloat(value) || 0, notes: '',
    });
    setShowForm(false);
    setName(''); setEmail(''); setPhone(''); setCompany(''); setValue('');
    load();
  };

  const handleConvert = async (id: string) => {
    await leadsService.convertToClient(id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Leads</h1>
          <p className="text-sm text-muted-foreground">Funil de vendas</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="sm" className="gradient-primary text-primary-foreground">
          {showForm ? <X className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
          {showForm ? 'Cancelar' : 'Novo Lead'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-4 shadow-card space-y-3 animate-scale-in">
          <Input placeholder="Nome" value={name} onChange={e => setName(e.target.value)} required />
          <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input placeholder="Telefone" value={phone} onChange={e => setPhone(e.target.value)} />
          <Input placeholder="Empresa" value={company} onChange={e => setCompany(e.target.value)} />
          <Input type="number" step="0.01" placeholder="Valor estimado" value={value} onChange={e => setValue(e.target.value)} />
          <Button type="submit" className="w-full gradient-primary text-primary-foreground">Salvar</Button>
        </form>
      )}

      {loading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState title="Nenhum lead" description="Adicione leads para acompanhar seu funil de vendas." />
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="bg-card rounded-xl border border-border p-4 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[item.status]}`}>
                      {STATUS_LABELS[item.status]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.email} {item.company && `· ${item.company}`}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {item.status !== 'won' && item.status !== 'lost' && (
                    <>
                      <select
                        value={item.status}
                        onChange={async e => { await leadsService.updateStatus(item.id, e.target.value as LeadStatus); load(); }}
                        className="text-xs px-2 py-1 rounded border border-input bg-background text-foreground"
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                      </select>
                      <button onClick={() => handleConvert(item.id)}
                        className="text-muted-foreground hover:text-success transition-colors p-1" title="Converter para cliente">
                        <UserPlus className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button onClick={async () => { await leadsService.delete(item.id); load(); }}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leads;
