-- ============================================================
-- MIGRACAO: 0002 - Adicionar activity_id e updated_at a projects
-- DATA: 2026
-- DESCRICAO: A tabela projects foi criada sem as colunas
--            activity_id (FK para activities) e updated_at.
--            Este script adiciona essas colunas e o trigger
--            de atualizacao automatica.
-- ============================================================

-- Adicionar coluna activity_id (nullable para nao quebrar rows existentes)
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS activity_id UUID REFERENCES activities(id) ON DELETE SET NULL;

-- Adicionar coluna updated_at (nullable inicialmente, depois preenchemos)
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Criar indice de performance
CREATE INDEX IF NOT EXISTS idx_projects_activity_id ON projects (activity_id);

-- Recriar trigger de updated_at (ja pode existir, usamos OR REPLACE)
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_projects_updated_at ON projects;
CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
