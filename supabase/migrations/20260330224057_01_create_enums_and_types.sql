/*
  # Criar Enums e Tipos Base
  
  1. Extensões
    - pgcrypto para geração de UUIDs
  
  2. Enums
    - app_mode: 'personal', 'professional'
    - transaction_type: 'income', 'expense'
    - billing_cycle: 'monthly', 'quarterly', 'annual'
    - lead_status: 'new', 'contacted', 'proposal', 'negotiation', 'won', 'lost'
    - project_status: 'planning', 'in_progress', 'review', 'completed', 'cancelled'
*/

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE public.app_mode AS ENUM ('personal', 'professional');
CREATE TYPE public.transaction_type AS ENUM ('income', 'expense');
CREATE TYPE public.billing_cycle AS ENUM ('monthly', 'quarterly', 'annual');
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'proposal', 'negotiation', 'won', 'lost');
CREATE TYPE public.project_status AS ENUM ('planning', 'in_progress', 'review', 'completed', 'cancelled');