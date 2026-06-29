-- ============================================================
-- MIGRACAO: 0003 - Restruturar Relacionamento
-- DATA: 2026
-- DESCRICAO: Redefine a hierarquia para Pilar -> Projeto -> Atividade
-- ============================================================

-- 1. Remover indices antigos
DROP INDEX IF EXISTS idx_projects_activity_id;
DROP INDEX IF EXISTS idx_activities_pillar_id;

-- 2. Adicionar novas colunas de chaves estrangeiras
ALTER TABLE projects ADD COLUMN IF NOT EXISTS pillar_id UUID REFERENCES pillars(id) ON DELETE SET NULL;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE SET NULL;

-- 3. Migrar dados existentes para nao perder consistencia
UPDATE projects p
SET pillar_id = a.pillar_id
FROM activities a
WHERE p.activity_id = a.id;

UPDATE activities a
SET project_id = p.id
FROM projects p
WHERE p.activity_id = a.id;

-- 4. Remover as colunas antigas que nao sao mais necessarias
ALTER TABLE projects DROP COLUMN IF EXISTS activity_id;
ALTER TABLE activities DROP COLUMN IF EXISTS pillar_id;

-- 5. Criar novos indices de performance
CREATE INDEX IF NOT EXISTS idx_projects_pillar_id ON projects (pillar_id);
CREATE INDEX IF NOT EXISTS idx_activities_project_id ON activities (project_id);
