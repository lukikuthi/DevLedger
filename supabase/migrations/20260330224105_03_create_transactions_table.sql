/*
  # Criar Tabela de Transações
  
  1. Nova Tabela
    - transactions
      - id (uuid, primary key)
      - user_id (uuid, referencia auth.users)
      - mode (app_mode)
      - type (transaction_type)
      - amount (decimal)
      - description (text)
      - category (text)
      - date (date)
      - project_id (uuid, referencia projects)
      - created_at (timestamptz)
  
  2. Segurança
    - Habilita RLS
    - Políticas para usuários autenticados gerenciarem suas transações
*/

CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mode public.app_mode NOT NULL,
  type public.transaction_type NOT NULL,
  amount DECIMAL NOT NULL CHECK (amount > 0),
  description TEXT,
  category TEXT,
  date DATE DEFAULT CURRENT_DATE,
  project_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transactions_select"
ON public.transactions FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "transactions_insert"
ON public.transactions FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "transactions_update"
ON public.transactions FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "transactions_delete"
ON public.transactions FOR DELETE
TO authenticated
USING (user_id = auth.uid());