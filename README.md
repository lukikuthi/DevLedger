# DevLedger

**Controle financeiro inteligente para desenvolvedores**

DevLedger é uma aplicação completa de gestão financeira com dois modos distintos: **Pessoal** e **Profissional**. Ideal para desenvolvedores freelancers que precisam gerenciar suas finanças pessoais e do negócio em um só lugar.

![DevLedger](public/apple-touch-icon.png)

## Funcionalidades

### Modo Pessoal
- Dashboard com visão geral mensal
- Transações (receitas e despesas) categorizadas
- Assinaturas recorrentes com cálculo proporcional automático
- Upload e organização de arquivos
- Controle de saldo em tempo real

### Modo Profissional
- Dashboard com métricas de negócio
- Funil de leads (new → contacted → proposal → negotiation → won/lost)
- Gestão de clientes (conversão de leads)
- Projetos vinculados a clientes
- Transações vinculadas a projetos
- Cálculo automático de lucro por projeto
- Upload de arquivos por projeto/cliente

## Stack Tecnológica

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Segurança**: Row Level Security (RLS)
- **Routing**: React Router v6

## Instalação Rápida

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/devledger.git
cd devledger

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do Supabase

# Executar em desenvolvimento
npm run dev
```

Acesse http://localhost:8080

## Documentação

- **[SETUP.md](SETUP.md)** - Guia completo de configuração
- **[DATABASE.md](DATABASE.md)** - Documentação completa do banco de dados
- **[DEVLEDGER_BACKEND.md](DEVLEDGER_BACKEND.md)** - Documentação original do backend

## Configuração do Banco de Dados

O projeto usa Supabase como backend. Execute as migrações em ordem:

1. Enums e Tipos
2. Profiles (com trigger automático)
3. Transactions
4. Subscriptions
5. Leads
6. Clients
7. Projects
8. Files

Todas as migrações e políticas RLS estão documentadas no arquivo `DATABASE.md`.

## Estrutura do Projeto

```
devledger/
├── src/
│   ├── components/     # Componentes React
│   │   ├── ui/        # Componentes shadcn/ui
│   │   ├── AppLayout.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── StatCard.tsx
│   ├── hooks/         # Hooks customizados
│   │   └── use-app-state.tsx
│   ├── pages/         # Páginas da aplicação
│   │   ├── Login.tsx
│   │   ├── ModeSelector.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Transactions.tsx
│   │   ├── Subscriptions.tsx
│   │   ├── Leads.tsx
│   │   ├── Clients.tsx
│   │   ├── Projects.tsx
│   │   └── Files.tsx
│   ├── services/      # Camada de serviços (API)
│   │   └── api.ts
│   ├── types/         # TypeScript types
│   │   └── index.ts
│   └── lib/           # Utilitários
│       └── utils.ts
├── public/            # Arquivos estáticos
├── DATABASE.md        # Documentação do DB
├── SETUP.md           # Guia de setup
└── README.md          # Este arquivo
```

## Paleta de Cores

O projeto usa uma paleta minimalista em preto e branco:

- **Branco**: Background, cards, texto secundário
- **Preto**: Sidebar, texto primário, botões principais
- **Cinza**: Bordas, estados inativos, texto terciário
- **Cores de status**: Verde (sucesso), Vermelho (erro), Amarelo (aviso)

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Testes
npm run test

# Lint
npm run lint
```

## Segurança

- Todas as tabelas protegidas por RLS (Row Level Security)
- Autenticação via Supabase Auth
- Storage privado com políticas granulares
- Validação de dados no frontend e backend
- CORS configurado corretamente

## Roadmap

- [x] Setup inicial e estrutura
- [x] Modo Pessoal completo
- [x] Modo Profissional completo
- [x] Autenticação e RLS
- [x] Storage de arquivos
- [ ] Integração real com Supabase (atualmente usa mock)
- [ ] Gráficos e visualizações
- [ ] Exportação de relatórios (PDF/CSV)
- [ ] Dark mode completo
- [ ] Notificações push
- [ ] Sincronização offline

## Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## Autor

Desenvolvido por **kikuthi.dev**

---

**DevLedger** - Controle financeiro simples e poderoso para desenvolvedores.
