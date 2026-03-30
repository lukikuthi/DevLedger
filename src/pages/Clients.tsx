import { useEffect, useState } from 'react';
import { clientsService } from '@/services/api';
import type { Client } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EmptyState from '@/components/EmptyState';
import { Plus, Trash2, X, UserCheck } from 'lucide-react';

const Clients = () => {
  const [items, setItems] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');

  const load = () => {
    setLoading(true);
    clientsService.list().then(d => { setItems(d); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    await clientsService.create({ name, email, phone, company });
    setShowForm(false);
    setName(''); setEmail(''); setPhone(''); setCompany('');
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Clientes</h1>
          <p className="text-sm text-muted-foreground">{items.length} cliente(s)</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="sm" className="gradient-primary text-primary-foreground">
          {showForm ? <X className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
          {showForm ? 'Cancelar' : 'Novo'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-4 shadow-card space-y-3 animate-scale-in">
          <Input placeholder="Nome" value={name} onChange={e => setName(e.target.value)} required />
          <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input placeholder="Telefone" value={phone} onChange={e => setPhone(e.target.value)} />
          <Input placeholder="Empresa" value={company} onChange={e => setCompany(e.target.value)} />
          <Button type="submit" className="w-full gradient-primary text-primary-foreground">Salvar</Button>
        </form>
      )}

      {loading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState title="Nenhum cliente" description="Converta leads em clientes ou adicione manualmente." />
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="bg-card rounded-xl border border-border p-4 shadow-card flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.email} {item.company && `· ${item.company}`}</p>
                </div>
              </div>
              <button onClick={async () => { await clientsService.delete(item.id); load(); }}
                className="text-muted-foreground hover:text-destructive transition-colors p-1 shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Clients;
