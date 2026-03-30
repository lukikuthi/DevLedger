/*
  # Criar Tabela de Leads
  
  1. Nova Tabela
    - leads
      - id (uuid, primary key)
      - user_id (uuid, referencia auth.users)
      - name (text)
      - email (text)
      - phone (text)
      - company (text)
      - status (lead_status)
      - notes (text)
      - estimated_value (decimal)
      - created_at (timestamptz)
  
  2. Segurança
    - Habilita RLS
    - Políticas para usuários autenticados gerenciarem seus leads
*/

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  status public.lead_status DEFAULT 'new',
  notes TEXT,
  estimated_value DECIMAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leads_select"
ON public.leads FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "leads_insert"
ON public.leads FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "leads_update"
ON public.leads FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "leads_delete"
ON public.leads FOR DELETE
TO authenticated
USING (user_id = auth.uid());