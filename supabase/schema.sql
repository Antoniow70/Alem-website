-- ==========================================
-- EXTENSOES (UUID correto para Supabase)
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- REMOVER TABELAS (RESET LIMPO)
-- ==========================================
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS beneficiary_stories CASCADE;
DROP TABLE IF EXISTS volunteers CASCADE;
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS partners CASCADE;
DROP TABLE IF EXISTS team CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- ==========================================
-- PROJETOS
-- ==========================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  objetivos_especificos TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Planeamento', 'Em Curso', 'Concluido')),
  capa_url TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  equipa_responsavel JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- VOLUNTARIOS
-- ==========================================
CREATE TABLE volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  genero TEXT,
  endereco TEXT,
  area_interesse TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'Pendente'
    CHECK (status IN ('Pendente', 'Em Analise', 'Aprovado', 'Recusado')),
  read_status TEXT NOT NULL DEFAULT 'Nao Lido'
    CHECK (read_status IN ('Lido', 'Nao Lido')),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- MENSAGENS
-- ==========================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  genero TEXT,
  data_nascimento DATE,
  endereco TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pendente'
    CHECK (status IN ('Pendente', 'Em Analise', 'Aprovado', 'Recusado')),
  read_status TEXT NOT NULL DEFAULT 'Nao Lido'
    CHECK (read_status IN ('Lido', 'Nao Lido')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- DOACOES
-- ==========================================
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  causa TEXT NOT NULL,
  valor NUMERIC NOT NULL,
  mensagem TEXT,
  metodo_pagamento TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pendente'
    CHECK (status IN ('Pendente', 'Confirmado', 'Recusado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- PARCEIROS
-- ==========================================
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  logo_data TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- EQUIPA
-- ==========================================
CREATE TABLE team (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  photo_data TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- HISTORIAS DE BENEFICIARIOS
-- ==========================================
CREATE TABLE beneficiary_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  story TEXT NOT NULL,
  image_url TEXT,
  image_data TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- DOCUMENTOS
-- ==========================================
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_data TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- RLS (SEGURANCA)
-- ==========================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE team ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiary_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- POLITICAS (ACESSO LIVRE - ADMIN SEM AUTH)
-- ==========================================

-- PROJETOS
CREATE POLICY "public_read_projects"
ON projects FOR SELECT USING (true);

CREATE POLICY "public_all_projects"
ON projects FOR ALL USING (true);

-- VOLUNTARIOS
CREATE POLICY "public_insert_volunteers"
ON volunteers FOR INSERT WITH CHECK (true);

CREATE POLICY "public_all_volunteers"
ON volunteers FOR ALL USING (true);

-- MENSAGENS
CREATE POLICY "public_insert_messages"
ON messages FOR INSERT WITH CHECK (true);

CREATE POLICY "public_all_messages"
ON messages FOR ALL USING (true);

-- DOACOES
CREATE POLICY "public_insert_donations"
ON donations FOR INSERT WITH CHECK (true);

CREATE POLICY "public_all_donations"
ON donations FOR ALL USING (true);

-- PARCEIROS
CREATE POLICY "public_read_partners"
ON partners FOR SELECT USING (true);

CREATE POLICY "public_all_partners"
ON partners FOR ALL USING (true);

-- EQUIPA
CREATE POLICY "public_read_team"
ON team FOR SELECT USING (true);

CREATE POLICY "public_all_team"
ON team FOR ALL USING (true);

-- HISTORIAS
CREATE POLICY "public_read_stories"
ON beneficiary_stories FOR SELECT USING (true);

CREATE POLICY "public_all_stories"
ON beneficiary_stories FOR ALL USING (true);

-- DOCUMENTOS
CREATE POLICY "public_read_documents"
ON documents FOR SELECT USING (true);

CREATE POLICY "public_all_documents"
ON documents FOR ALL USING (true);