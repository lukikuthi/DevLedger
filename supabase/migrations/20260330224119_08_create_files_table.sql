/*
  # Criar Tabela de Arquivos
  
  1. Nova Tabela
    - files
      - id (uuid, primary key)
      - user_id (uuid, referencia auth.users)
      - name (text)
      - size (bigint)
      - mime_type (text)
      - storage_path (text)
      - linked_to (text, check constraint)
      - linked_id (uuid)
      - created_at (timestamptz)
  
  2. Segurança
    - Habilita RLS
    - Políticas para usuários autenticados gerenciarem seus arquivos
*/

CREATE TABLE IF NOT EXISTS public.files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  size BIGINT,
  mime_type TEXT,
  storage_path TEXT,
  linked_to TEXT CHECK (linked_to IN ('personal', 'project', 'client')),
  linked_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "files_select"
ON public.files FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "files_insert"
ON public.files FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "files_update"
ON public.files FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "files_delete"
ON public.files FOR DELETE
TO authenticated
USING (user_id = auth.uid());