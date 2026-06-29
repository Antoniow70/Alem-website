-- ============================================================
-- MIGRACAO: 0004 - Atualizar Pilares Estratégicos
-- DATA: 2026
-- DESCRICAO: Atualiza os nomes e descrições dos pilares estratégicos
--            para corresponder exatamente à imagem oficial da ALEM.
-- ============================================================

-- Atualizar Pilar 1
UPDATE pillars
SET 
  name = 'Acesso e Inclusão',
  description = 'Rastreamento e inserção das Pessoas com Necessidades Especiais em diferentes subsistemas de ensino'
WHERE id = '11111111-1111-1111-1111-111111111111';

-- Atualizar Pilar 2
UPDATE pillars
SET 
  name = 'Acompanhamento e Qualidade',
  description = 'Garantir o Acompanhamento e a Qualidade de Ensino para Pessoas com Necessidades Especiais'
WHERE id = '22222222-2222-2222-2222-222222222222';

-- Atualizar Pilar 3
UPDATE pillars
SET 
  name = 'Inserção e Oportunidade',
  description = 'Promover a Inserção no Mercado de Trabalho a Pessoas com Necessidades Especiais'
WHERE id = '33333333-3333-3333-3333-333333333333';
