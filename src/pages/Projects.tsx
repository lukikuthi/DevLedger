import { useEffect, useState } from 'react';
import { projectsService, clientsService } from '@/services/api';
import type { Project, Client, ProjectStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EmptyState from '@/components/EmptyState';
import { Plus, Trash2, X, FolderKanban } from 'lucide-react';

const formatCurrency = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const STATUS_LABELS: Record<ProjectStatus, string> = {
  planning: 'Planejamento', in_progress: 'Em andamento',
  review: 'Revisão', completed: 'Concluído', cancelled: 'Cancelado',
};

const STATUS_COLORS: Record<ProjectStatus, string> = {
  planning: 'bg-info/10 text-info', in_progress: 'bg-primary/10 text-primary',
  review: 'bg-warning/10 text-warning', completed: 'bg-success/10 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
};

const STATUSES: ProjectStatus[] = ['planning', 'in_progress', 'review', 'completed', 'cancelled'];

const Projects = () => {
  const [items, setItems] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([projectsService.list(), clientsService.list()]).then(([p, c]) => {
      setItems(p);
      setClients(c);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !clientId || !budget) return;
    await projectsService.create({
      name, client_id: clientId,
      budget: parseFloat(budget), description,
      status: 'planning', start_date: new Date().toISOString().slice(0, 10),
    });
    setShowForm(false);
    setName(''); setClientId(''); setBudget(''); setDescription('');
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Projetos</h1>
          <p className="text-sm text-muted-foreground">{items.length} projeto(s)</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="sm" className="gradient-primary text-primary-foreground">
          {showForm ? <X className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
          {showForm ? 'Cancelar' : 'Novo'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-4 shadow-card space-y-3 animate-scale-in">
          <Input placeholder="Nome do projeto" value={name} onChange={e => setName(e.target.value)} required />
          <select value={clientId} onChange={e => setClientId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground" required>
            <option value="">Selecione o cliente</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <Input type="number" step="0.01" placeholder="Budget / Orçamento" value={budget} onChange={e => setBudget(e.target.value)} required />
          <Input placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} />
          <Button type="submit" className="w-full gradient-primary text-primary-foreground">Salvar</Button>
        </form>
      )}

      {loading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState title="Nenhum projeto" description="Crie um projeto vinculado a um cliente para acompanhar receitas e custos." />
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="bg-card rounded-xl border border-border p-4 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FolderKanban className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[item.status]}`}>
                        {STATUS_LABELS[item.status]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {item.client_name} · Budget: {formatCurrency(item.budget)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <select
                    value={item.status}
                    onChange={async e => { await projectsService.updateStatus(item.id, e.target.value as ProjectStatus); load(); }}
                    className="text-xs px-2 py-1 rounded border border-input bg-background text-foreground"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                  <button onClick={async () => { await projectsService.delete(item.id); load(); }}
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

export default Projects;
