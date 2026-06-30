-- ============================================================
-- MIGRACAO: 0005 - Adicionar colunas em falta e tabela de noticias
-- DATA: 2026-06-30
-- DESCRICAO: Adiciona as colunas em falta (sort_order, activity_id, tipo_necessidade, num_beneficiarios)
--            e cria a tabela news para o modulo de noticias.
-- ============================================================

-- 1. Adicionar sort_order na tabela team
ALTER TABLE team ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

-- 2. Adicionar activity_id na tabela volunteers
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS activity_id UUID REFERENCES activities(id) ON DELETE SET NULL;

-- 3. Adicionar tipo_necessidade na tabela messages
ALTER TABLE messages ADD COLUMN IF NOT EXISTS tipo_necessidade TEXT;

-- 4. Adicionar num_beneficiarios na tabela projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS num_beneficiarios INTEGER NOT NULL DEFAULT 0;

-- 5. Criar a tabela de noticias (news)
CREATE TABLE IF NOT EXISTS news (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL,   -- Objetivo Geral / Titulo
  description TEXT        NOT NULL,   -- Descricao da Noticia
  news_date   DATE        NOT NULL DEFAULT CURRENT_DATE, -- Data da Noticia
  capa_url    TEXT,       -- URL da Imagem de Capa
  capa_data   TEXT,       -- Base64 da Imagem de Capa (fallback de desenvolvimento)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar RLS (Seguranca de Linha) e Politicas para noticias
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_news" ON news;
CREATE POLICY "public_read_news" ON news FOR SELECT USING (true);

DROP POLICY IF EXISTS "admin_all_news" ON news;
CREATE POLICY "admin_all_news" ON news FOR ALL USING (true);
