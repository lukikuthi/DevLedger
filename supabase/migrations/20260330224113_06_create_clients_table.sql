/*
  # Criar Tabela de Clientes
  
  1. Nova Tabela
    - clients
      - id (uuid, primary key)
      - user_id (uuid, referencia auth.users)
      - name (text)
      - email (text)
      - phone (text)
      - company (text)
      - lead_id (uuid, referencia leads)
      - created_at (timestamptz)
  
  2. Segurança
    - Habilita RLS
    - Políticas para usuários autenticados gerenciarem seus clientes
*/

CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clients_select"
ON public.clients FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "clients_insert"
ON public.clients FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "clients_update"
ON public.clients FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "clients_delete"
ON public.clients FOR DELETE
TO authenticated
USING (user_id = auth.uid());