/*
  # Criar Tabela de Assinaturas
  
  1. Nova Tabela
    - subscriptions
      - id (uuid, primary key)
      - user_id (uuid, referencia auth.users)
      - name (text)
      - amount (decimal)
      - billing_cycle (billing_cycle)
      - monthly_cost (decimal, calculado automaticamente)
      - category (text)
      - active (boolean)
      - created_at (timestamptz)
  
  2. Segurança
    - Habilita RLS
    - Políticas para usuários autenticados gerenciarem suas assinaturas
*/

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  billing_cycle public.billing_cycle DEFAULT 'monthly',
  monthly_cost DECIMAL GENERATED ALWAYS AS (
    CASE billing_cycle
      WHEN 'monthly' THEN amount
      WHEN 'quarterly' THEN amount / 3
      WHEN 'annual' THEN amount / 12
    END
  ) STORED,
  category TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_select"
ON public.subscriptions FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "subscriptions_insert"
ON public.subscriptions FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "subscriptions_update"
ON public.subscriptions FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "subscriptions_delete"
ON public.subscriptions FOR DELETE
TO authenticated
USING (user_id = auth.uid());