-- ============================================================
-- SISTEMA: ALEM - Associacao de Luta e Esperanca de Mocambique
-- VERSAO: 2.0 (Corrigido apos auditoria tecnica)
-- DATA: 2025
-- DESCRICAO: Schema corrigido e alinhado com os requisitos
--            funcionais, regras de negocio e fluxos operacionais
--            documentados no PDF de especificacao.
-- PLATAFORMA: PostgreSQL / Supabase
-- ============================================================

-- ============================================================
-- EXTENSOES
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- RESET LIMPO (DROP NA ORDEM CORRETA PARA EVITAR CONFLITOS FK)
-- ============================================================
DROP TABLE IF EXISTS volunteer_activities    CASCADE;
DROP TABLE IF EXISTS project_activities      CASCADE;
DROP TABLE IF EXISTS volunteers              CASCADE;
DROP TABLE IF EXISTS beneficiary_stories     CASCADE;
DROP TABLE IF EXISTS donations               CASCADE;
DROP TABLE IF EXISTS messages                CASCADE;
DROP TABLE IF EXISTS documents               CASCADE;
DROP TABLE IF EXISTS projects                CASCADE;
DROP TABLE IF EXISTS activities              CASCADE;
DROP TABLE IF EXISTS pillars                 CASCADE;
DROP TABLE IF EXISTS partners                CASCADE;
DROP TABLE IF EXISTS team                    CASCADE;

-- ============================================================
-- TABELA: pillars (Pilares)
-- Origem: RF-02, RF-03 — os 3 pilares da associacao
-- Os 3 pilares sao entidades estruturais do sistema publico
-- ============================================================
CREATE TABLE pillars (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,          -- Nome do pilar
  description TEXT,                          -- Descricao do pilar
  icon_url    TEXT,                          -- Icone/imagem do pilar
  sort_order  INTEGER     NOT NULL DEFAULT 0, -- Ordem de exibicao
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  pillars             IS 'Os 3 pilares estrategicos da ALEM exibidos na pagina inicial e em O Que Fazemos (RF-02, RF-03).';
COMMENT ON COLUMN pillars.sort_order  IS 'Controla a ordem de exibicao dos pilares no site.';

-- ============================================================
-- TABELA: activities (Atividades)
-- Origem: RF-02 — cada Pilar tem Atividades associadas;
--         RF-08 — voluntario candidata-se a uma atividade especifica (obrigatorio)
-- Cardinalidade: Pilar 1:N Atividade
-- ============================================================
CREATE TABLE activities (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  pillar_id   UUID        NOT NULL REFERENCES pillars(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,          -- Nome da atividade
  description TEXT,                          -- Descricao da atividade
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  activities           IS 'Atividades associadas a cada pilar (RF-02). Base para filtros de projetos (RF-11) e candidaturas de voluntarios.';
COMMENT ON COLUMN activities.pillar_id IS 'FK obrigatoria: toda atividade pertence a um pilar.';

-- ============================================================
-- TABELA: projects (Projetos Sociais)
-- Origem: RF-08, Regras de negocio — 3 estados de ciclo de vida,
--         sem restricao de transicao; associado a uma atividade.
-- Cardinalidade: Atividade 1:N Projetos
-- ============================================================
CREATE TABLE projects (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id          UUID        REFERENCES activities(id) ON DELETE SET NULL,
  name                 TEXT        NOT NULL,
  objetivos_especificos TEXT        NOT NULL,
  -- RF-08 / Regras de negocio: 3 estados livres (sem restricao de transicao)
  status               TEXT        NOT NULL DEFAULT 'Planeamento'
                         CHECK (status IN ('Planeamento', 'Em Curso', 'Concluido')),
  capa_url             TEXT,                 -- Imagem de capa
  gallery              JSONB       NOT NULL DEFAULT '[]'::jsonb,   -- Galeria de imagens/videos
  equipa_responsavel   JSONB       NOT NULL DEFAULT '[]'::jsonb,   -- Equipa do projeto
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  projects              IS 'Projetos sociais da ALEM. Associados a uma atividade (RF-08, RF-11). Estados: Planeamento, Em Curso, Concluido (Regras de negocio).';
COMMENT ON COLUMN projects.activity_id  IS 'FK para atividade: o admin associa o projeto a uma atividade (RF-08). Nullable — SET NULL se a atividade for eliminada.';
COMMENT ON COLUMN projects.status       IS 'Ciclo de vida livre: Planeamento → Em Curso → Concluido (qualquer transicao permitida).';
COMMENT ON COLUMN projects.gallery      IS 'Array JSON de URLs de imagens/videos da galeria do projeto.';
COMMENT ON COLUMN projects.equipa_responsavel IS 'Array JSON com membros da equipa responsavel pelo projeto.';

-- ============================================================
-- TABELA: volunteers (Voluntarios / Candidaturas)
-- Origem: RF-06 — gerir voluntarios; Regras de negocio:
--   • nasce com estado Pendente
--   • admin move para Em Analise ou Aprovado
--   • Recusado → eliminacao definitiva (nao fica historico)
--   • candidatura obrigatoria a uma atividade especifica
-- ============================================================
CREATE TABLE volunteers (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name      TEXT        NOT NULL,
  email          TEXT        NOT NULL,
  phone          TEXT        NOT NULL,
  genero         TEXT,
  endereco       TEXT,
  -- area_interesse: texto livre descritivo (complementar a atividade escolhida)
  area_interesse TEXT,
  message        TEXT,
  -- activity_id: campo obrigatorio segundo as regras de negocio
  activity_id    UUID        NOT NULL REFERENCES activities(id) ON DELETE RESTRICT,
  -- Estado: Pendente → Em Analise | Aprovado; Recusado elimina o registo
  status         TEXT        NOT NULL DEFAULT 'Pendente'
                   CHECK (status IN ('Pendente', 'Em Analise', 'Aprovado')),
                   -- NOTA: 'Recusado' nao aparece como estado persistente;
                   --       a recusa elimina o registo (Regras de negocio).
  read_status    TEXT        NOT NULL DEFAULT 'Nao Lido'
                   CHECK (read_status IN ('Lido', 'Nao Lido')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  volunteers             IS 'Candidaturas de voluntarios (RF-06). Estado Recusado nao persiste — o registo e eliminado definitivamente.';
COMMENT ON COLUMN volunteers.activity_id IS 'FK OBRIGATORIA: voluntario candidata-se sempre a uma atividade especifica (Regras de negocio).';
COMMENT ON COLUMN volunteers.status      IS 'Apenas Pendente, Em Analise e Aprovado sao estados persistentes. Recusado → DELETE do registo.';

-- ============================================================
-- TABELA: messages (Pedidos de Apoio / Contactos)
-- Origem: RF-06 — gerir beneficiarios (pedidos de apoio);
--         Fluxo do visitante — separador "Solicitar pedido" em /contactos
--   • nasce com estado Pendente
--   • Recusado → eliminacao definitiva
-- ============================================================
CREATE TABLE messages (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT        NOT NULL,
  email           TEXT,
  phone           TEXT,
  genero          TEXT,
  data_nascimento DATE,
  endereco        TEXT,
  -- tipo_necessidade: campo indicado no fluxo do visitante
  tipo_necessidade TEXT,
  subject         TEXT        NOT NULL,
  message         TEXT        NOT NULL,
  -- Estado: Pendente → Em Analise | Aceito; Recusado elimina o registo
  status          TEXT        NOT NULL DEFAULT 'Pendente'
                    CHECK (status IN ('Pendente', 'Em Analise', 'Aceito')),
                    -- NOTA: 'Recusado' elimina o registo definitivamente.
  read_status     TEXT        NOT NULL DEFAULT 'Nao Lido'
                    CHECK (read_status IN ('Lido', 'Nao Lido')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  messages               IS 'Pedidos de apoio / contactos de beneficiarios (RF-06). Fluxo: Pendente → Em Analise / Aceito. Recusado elimina o registo.';
COMMENT ON COLUMN messages.tipo_necessidade IS 'Tipo de necessidade indicado pelo visitante no formulario de pedido de apoio (/contactos).';
COMMENT ON COLUMN messages.status        IS 'Apenas Pendente, Em Analise e Aceito sao estados persistentes. Recusado → DELETE do registo.';

-- ============================================================
-- TABELA: donations (Doacoes)
-- Origem: RF-07 — gerir doadores; Regras de negocio:
--   • nasce com estado Pendente
--   • admin move para Em Analise ou Recebido
--   • Nao Recebido → eliminacao definitiva
--   • pagamento NAO processado pelo sistema (instrucao de texto)
-- ============================================================
CREATE TABLE donations (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nome             TEXT        NOT NULL,
  email            TEXT        NOT NULL,
  telefone         TEXT        NOT NULL,
  -- causa: lista dinamica de projetos + opcao "Geral" (fluxo do visitante)
  causa            TEXT        NOT NULL,
  valor            NUMERIC(12,2) NOT NULL CHECK (valor > 0),
  mensagem         TEXT,
  -- metodo_pagamento: M-Pesa, transferencia bancaria, cartao (apenas instrucao de texto)
  metodo_pagamento TEXT        NOT NULL
                     CHECK (metodo_pagamento IN ('M-Pesa', 'Transferencia Bancaria', 'Cartao')),
  -- Estado: Pendente → Em Analise | Recebido; Nao Recebido elimina o registo
  status           TEXT        NOT NULL DEFAULT 'Pendente'
                     CHECK (status IN ('Pendente', 'Em Analise', 'Recebido')),
                     -- NOTA: 'Nao Recebido' elimina o registo definitivamente.
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  donations              IS 'Registo de intencoes de doacao (RF-07). Pagamento nao e processado pelo sistema. Nao Recebido → DELETE do registo.';
COMMENT ON COLUMN donations.causa        IS 'Causa escolhida pelo doador: nome do projeto ou "Geral".';
COMMENT ON COLUMN donations.metodo_pagamento IS 'Metodo de pagamento escolhido. O sistema apenas exibe instrucoes de texto; nao processa pagamentos reais.';
COMMENT ON COLUMN donations.status       IS 'Apenas Pendente, Em Analise e Recebido sao estados persistentes. Nao Recebido → DELETE do registo.';

-- ============================================================
-- TABELA: partners (Parceiros)
-- Origem: Fluxo do admin — gestao de nome e logotipo
-- ============================================================
CREATE TABLE partners (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  logo_url    TEXT,
  logo_data   TEXT,         -- base64 para modo desenvolvimento/mock
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE partners IS 'Parceiros da ALEM exibidos no site publico. Geridos pelo admin (nome e logotipo).';

-- ============================================================
-- TABELA: team (Membros da Equipa)
-- Origem: RF-01 — exibir membros na pagina inicial;
--         Fluxo do admin — gestao de nome, foto, cargo e bio
-- ============================================================
CREATE TABLE team (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  role        TEXT        NOT NULL,   -- Cargo/funcao
  bio         TEXT,
  photo_url   TEXT,
  photo_data  TEXT,         -- base64 para modo desenvolvimento/mock
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  team            IS 'Membros da equipa exibidos na pagina inicial (RF-01) e geridos pelo admin.';
COMMENT ON COLUMN team.sort_order IS 'Ordem de exibicao dos membros no site.';

-- ============================================================
-- TABELA: beneficiary_stories (Historias de Beneficiarios)
-- Origem: RF-15 — admin adiciona historias de sucesso;
--         Regras de negocio — associadas a projetos concluidos,
--         publicadas diretamente pelo admin
-- Cardinalidade: Projeto 1:N Historias
-- ============================================================
CREATE TABLE beneficiary_stories (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name   TEXT        NOT NULL,
  story       TEXT        NOT NULL,
  image_url   TEXT,
  image_data  TEXT,         -- base64 para modo desenvolvimento/mock
  -- project_id: regras de negocio indicam associacao a projeto concluido
  project_id  UUID        REFERENCES projects(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  beneficiary_stories  IS 'Historias de sucesso de beneficiarios (RF-15). Devem ser associadas a projetos concluidos. Publicadas diretamente pelo admin.';
COMMENT ON COLUMN beneficiary_stories.project_id IS 'FK para projeto. Regras de negocio: associada preferencialmente a projeto com status=Concluido.';

-- ============================================================
-- TABELA: documents (Documentos)
-- Origem: mencionado no schema original; sem RF especifico no PDF.
-- Mantido pois pode suportar RF-09 (exportacao de relatorios)
-- e transparencia institucional.
-- ============================================================
CREATE TABLE documents (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL,
  description TEXT,
  file_url    TEXT,
  file_data   TEXT,         -- base64 para modo desenvolvimento/mock
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE documents IS 'Documentos institucionais. Suporta transparencia e pode estar relacionado com RF-09 (exportacao de dados).';

-- ============================================================
-- INDICES DE DESEMPENHO
-- Origem: RNF-02 — listagens devem suportar paginacao e volumes
--         crescentes de dados; filtros por data e estado sao frequentes
-- ============================================================

-- projects
CREATE INDEX idx_projects_activity_id  ON projects (activity_id);
CREATE INDEX idx_projects_status        ON projects (status);
CREATE INDEX idx_projects_created_at    ON projects (created_at DESC);

-- activities
CREATE INDEX idx_activities_pillar_id   ON activities (pillar_id);

-- volunteers
CREATE INDEX idx_volunteers_status      ON volunteers (status);
CREATE INDEX idx_volunteers_read_status ON volunteers (read_status);
CREATE INDEX idx_volunteers_activity_id ON volunteers (activity_id);
CREATE INDEX idx_volunteers_created_at  ON volunteers (created_at DESC);

-- messages
CREATE INDEX idx_messages_status        ON messages (status);
CREATE INDEX idx_messages_read_status   ON messages (read_status);
CREATE INDEX idx_messages_created_at    ON messages (created_at DESC);

-- donations
-- RF-09: exportacao com filtro por periodo (data inicio / data fim)
CREATE INDEX idx_donations_status       ON donations (status);
CREATE INDEX idx_donations_created_at   ON donations (created_at DESC);

-- beneficiary_stories
CREATE INDEX idx_stories_project_id     ON beneficiary_stories (project_id);

-- ============================================================
-- FUNCAO: atualizar updated_at automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- ============================================================
-- RLS (SEGURANCA)
-- Origem: RNF-01 — acesso a area administrativa restrito
-- ============================================================
ALTER TABLE pillars             ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities          ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects            ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages            ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations           ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners            ENABLE ROW LEVEL SECURITY;
ALTER TABLE team                ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiary_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents           ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLITICAS RLS
-- NOTA: O sistema atual usa "acesso livre" (true) como estado
--       de desenvolvimento. Em producao, substituir pelas
--       politicas com auth.uid() do Supabase Auth (RF-05, RNF-01).
-- ============================================================

-- PILARES (leitura publica, escrita admin)
CREATE POLICY "public_read_pillars"  ON pillars FOR SELECT USING (true);
CREATE POLICY "admin_all_pillars"    ON pillars FOR ALL    USING (true);

-- ATIVIDADES (leitura publica, escrita admin)
CREATE POLICY "public_read_activities" ON activities FOR SELECT USING (true);
CREATE POLICY "admin_all_activities"   ON activities FOR ALL    USING (true);

-- PROJETOS (leitura publica, escrita admin)
CREATE POLICY "public_read_projects" ON projects FOR SELECT USING (true);
CREATE POLICY "admin_all_projects"   ON projects FOR ALL    USING (true);

-- VOLUNTARIOS (insercao publica, gestao admin)
CREATE POLICY "public_insert_volunteers" ON volunteers FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_all_volunteers"     ON volunteers FOR ALL    USING (true);

-- MENSAGENS / PEDIDOS DE APOIO (insercao publica, gestao admin)
CREATE POLICY "public_insert_messages"   ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_all_messages"       ON messages FOR ALL    USING (true);

-- DOACOES (insercao publica, gestao admin)
CREATE POLICY "public_insert_donations"  ON donations FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_all_donations"      ON donations FOR ALL    USING (true);

-- PARCEIROS (leitura publica, gestao admin)
CREATE POLICY "public_read_partners"     ON partners FOR SELECT USING (true);
CREATE POLICY "admin_all_partners"       ON partners FOR ALL    USING (true);

-- EQUIPA (leitura publica, gestao admin)
CREATE POLICY "public_read_team"         ON team FOR SELECT USING (true);
CREATE POLICY "admin_all_team"           ON team FOR ALL    USING (true);

-- HISTORIAS (leitura publica, gestao admin)
CREATE POLICY "public_read_stories"      ON beneficiary_stories FOR SELECT USING (true);
CREATE POLICY "admin_all_stories"        ON beneficiary_stories FOR ALL    USING (true);

-- DOCUMENTOS (leitura publica, gestao admin)
CREATE POLICY "public_read_documents"    ON documents FOR SELECT USING (true);
CREATE POLICY "admin_all_documents"      ON documents FOR ALL    USING (true);

-- ============================================================
-- DADOS INICIAIS: 3 PILARES (exemplo — substituir pelos reais)
-- Origem: RF-02, RF-03 — os 3 pilares sao estruturais
-- ============================================================
-- DESCOMENTE E ADAPTE COM OS NOMES REAIS DOS PILARES DA ALEM:
--
-- INSERT INTO pillars (name, description, sort_order) VALUES
--   ('Pilar 1 - [Nome Real]', 'Descricao do primeiro pilar', 1),
--   ('Pilar 2 - [Nome Real]', 'Descricao do segundo pilar', 2),
--   ('Pilar 3 - [Nome Real]', 'Descricao do terceiro pilar', 3);

-- ============================================================
-- FIM DO SCRIPT
-- Sistema: ALEM | Versao: 2.0 | Auditado e corrigido
-- ============================================================