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


## Paleta de Cores

O projeto usa uma paleta minimalista em preto e branco:

- **Branco**: Background, cards, texto secundário
- **Preto**: Sidebar, texto primário, botões principais
- **Cinza**: Bordas, estados inativos, texto terciário
- **Cores de status**: Verde (sucesso), Vermelho (erro), Amarelo (aviso)

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
- [x] Integração real com Supabase (atualmente usa mock)
- [ ] Gráficos e visualizações
- [x] Exportação de relatórios (PDF/CSV)
- [ ] Dark mode completo
- [ ] Notificações push
- [ ] Sincronização offline

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## Autor

Desenvolvido por **lukikuthi.dev**

---

**DevLedger** - Controle financeiro simples e poderoso para desenvolvedores.
