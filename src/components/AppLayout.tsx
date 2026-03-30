import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppState } from '@/hooks/use-app-state';
import {
  BookOpen, LayoutDashboard, ArrowLeftRight, CreditCard,
  Users, UserCheck, FolderKanban, FileText, LogOut, ChevronLeft
} from 'lucide-react';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { mode, user, logout } = useAppState();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const personalLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/transactions', icon: ArrowLeftRight, label: 'Transações' },
    { to: '/subscriptions', icon: CreditCard, label: 'Assinaturas' },
    { to: '/files', icon: FileText, label: 'Arquivos' },
  ];

  const professionalLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/leads', icon: Users, label: 'Leads' },
    { to: '/clients', icon: UserCheck, label: 'Clientes' },
    { to: '/projects', icon: FolderKanban, label: 'Projetos' },
    { to: '/transactions', icon: ArrowLeftRight, label: 'Transações' },
    { to: '/files', icon: FileText, label: 'Arquivos' },
  ];

  const links = mode === 'personal' ? personalLinks : professionalLinks;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-60 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 hidden md:flex">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <img src="/apple-touch-icon.png" alt="DevLedger" className="w-8 h-8 rounded-lg" />
            <span className="font-bold text-sidebar-primary-foreground text-sm">DevLedger</span>
          </div>
        </div>

        <div className="p-3">
          <button
            onClick={() => navigate('/mode')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            {mode === 'personal' ? 'Pessoal' : 'Profissional'}
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {links.map(link => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-2 px-3 py-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-medium text-sidebar-accent-foreground">
              {user?.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="text-xs text-sidebar-foreground truncate">{user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/apple-touch-icon.png" alt="DevLedger" className="w-7 h-7 rounded-lg" />
          <span className="font-bold text-sm text-foreground">DevLedger</span>
        </div>
        <button onClick={handleLogout} className="text-muted-foreground">
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex justify-around py-2 px-1">
        {links.slice(0, 5).map(link => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <link.icon className="w-4 h-4" />
              <span className="text-[10px]">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Main content */}
      <main className="flex-1 overflow-auto md:p-6 p-4 pt-16 pb-20 md:pt-6 md:pb-6">
        <div className="max-w-6xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
