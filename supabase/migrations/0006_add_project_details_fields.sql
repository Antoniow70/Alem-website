-- ============================================================
-- MIGRACAO: 0006 - Adicionar objetivo_geral e principais_atividades a tabela de projetos
-- DATA: 2026-06-30
-- DESCRICAO: Adiciona as colunas objetivo_geral e principais_atividades na tabela de projetos (projects).
-- ============================================================

ALTER TABLE projects ADD COLUMN IF NOT EXISTS objetivo_geral TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS principais_atividades TEXT;
