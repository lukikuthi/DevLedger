/*
  # Criar Tabela de Projetos
  
  1. Nova Tabela
    - projects
      - id (uuid, primary key)
      - user_id (uuid, referencia auth.users)
      - client_id (uuid, referencia clients)
      - name (text)
      - description (text)
      - status (project_status)
      - budget (decimal)
      - start_date (date)
      - end_date (date)
      - created_at (timestamptz)
  
  2. Segurança
    - Habilita RLS
    - Políticas para usuários autenticados gerenciarem seus projetos
  
  3. Foreign Keys
    - Adiciona constraint de foreign key para project_id em transactions
*/

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status public.project_status DEFAULT 'planning',
  budget DECIMAL DEFAULT 0,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_select"
ON public.projects FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "projects_insert"
ON public.projects FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "projects_update"
ON public.projects FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "projects_delete"
ON public.projects FOR DELETE
TO authenticated
USING (user_id = auth.uid());

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'transactions_project_id_fkey'
    AND table_name = 'transactions'
  ) THEN
    ALTER TABLE public.transactions
    ADD CONSTRAINT transactions_project_id_fkey
    FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE SET NULL;
  END IF;
END $$;