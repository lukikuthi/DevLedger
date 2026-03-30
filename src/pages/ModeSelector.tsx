import { useAppState } from '@/hooks/use-app-state';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, ArrowRight } from 'lucide-react';
import type { AppMode } from '@/types';

const ModeSelector = () => {
  const { setMode, user } = useAppState();
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const handleSelect = (mode: AppMode) => {
    setMode(mode);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            {getGreeting()}, {user?.full_name || 'Dev'} 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Como deseja usar o DevLedger hoje?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => handleSelect('personal')}
            className="group bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-200 text-left shadow-card hover:shadow-elevated"
          >
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
              <User className="w-6 h-6 text-accent-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Modo Pessoal</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Controle suas finanças pessoais, assinaturas e despesas do dia a dia.
            </p>
            <span className="inline-flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Acessar <ArrowRight className="ml-1 w-4 h-4" />
            </span>
          </button>

          <button
            onClick={() => handleSelect('professional')}
            className="group bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-200 text-left shadow-card hover:shadow-elevated"
          >
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
              <Briefcase className="w-6 h-6 text-accent-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Modo Profissional</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Gerencie leads, clientes, projetos e finanças do seu freelance.
            </p>
            <span className="inline-flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Acessar <ArrowRight className="ml-1 w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;
