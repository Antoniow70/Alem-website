export const MOCK_PROJECTS = [
  {
    id: '1',
    name: 'Educacao para Todos',
    objetivo_geral: 'Promover a educacao inclusiva nas zonas rurais.',
    objetivos_especificos: '- Fornecer material didatico.\n- Implementar aulas de reforco escolar.\n- Capacitar professores locais.',
    capa_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80',
    status: 'Em Curso',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Saude Comunitaria',
    objetivo_geral: 'Garantir acesso a cuidados basicos de saude em comunidades isoladas.',
    objetivos_especificos: '- Criar clinicas moveis.\n- Realizar campanhas de vacinacao.\n- Prestar atendimento preventivo.',
    capa_url: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80',
    status: 'Planeamento',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Agua e Vida',
    objetivo_geral: 'Melhorar o acesso a agua potavel e sistemas de irrigacao.',
    objetivos_especificos: '- Construir furos de agua.\n- Instalar sistemas de irrigacao para agricultura familiar.\n- Sensibilizar para o uso sustentavel da agua.',
    capa_url: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&q=80',
    status: 'Concluido',
    created_at: new Date().toISOString()
  }
];

export const MOCK_VOLUNTEERS = [
  {
    id: '1',
    full_name: 'Ana Silva',
    email: 'ana.silva@example.com',
    phone: '841234567',
    message: 'Gostaria de ajudar no programa de reforco escolar.',
    status: 'Pendente',
    project_id: '1',
    created_at: new Date().toISOString()
  }
];
