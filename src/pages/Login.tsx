import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '@/hooks/use-app-state';
import { authService } from '@/services/api';
import { BookOpen, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAppState();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Por favor, preencha email e senha.');
      return;
    }
    if (isRegister && !fullName) {
      alert('Por favor, preencha seu nome.');
      return;
    }
    setLoading(true);
    try {
      if (isRegister) {
        await authService.register(email, password, fullName);
        alert('Conta criada! Faça login agora.');
        setIsRegister(false);
        setPassword('');
        setFullName('');
      } else {
        await login(email, password);
        navigate('/mode');
      }
    } catch (error: any) {
      const message = error?.message || 'Erro desconhecido';
      if (message.includes('Invalid login credentials')) {
        alert('Email ou senha incorretos.');
      } else if (message.includes('User already registered')) {
        alert('Email já cadastrado. Faça login.');
      } else {
        alert(isRegister ? 'Erro ao criar conta.' : 'Erro ao fazer login.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img src="/DevLedger/apple-touch-ico.png" alt="DevLedger" className="w-20 h-20 rounded-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">DevLedger</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Controle financeiro inteligente para devs
          </p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-xl p-6 shadow-card border border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Nome Completo</label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Seu nome"
                  required
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
              {loading ? (isRegister ? 'Criando...' : 'Entrando...') : (isRegister ? 'Criar Conta' : 'Entrar')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isRegister ? 'Já tem uma conta? Entrar' : 'Não tem conta? Criar agora'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
