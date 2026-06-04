export const MOCK_PROJECTS = [
  {
    id: '1',
    name: 'Educação para Todos',
    description: 'Programa de reforço escolar e fornecimento de material didático para crianças em zonas rurais.',
    media_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80',
    media_type: 'image',
    status: 'Em Curso',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Saúde Comunitária',
    description: 'Clínicas móveis para atendimento básico e vacinação em comunidades isoladas.',
    media_url: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80',
    media_type: 'image',
    status: 'Planeamento',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Água é Vida',
    description: 'Construção de furos de água e sistemas de irrigação para agricultura familiar.',
    media_url: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&q=80',
    media_type: 'image',
    status: 'Concluído',
    created_at: new Date().toISOString()
  }
];

export const MOCK_VOLUNTEERS = [
  {
    id: '1',
    full_name: 'Ana Silva',
    email: 'ana.silva@example.com',
    phone: '841234567',
    message: 'Gostaria de ajudar no programa de reforço escolar.',
    status: 'Pendente',
    project_id: '1',
    created_at: new Date().toISOString()
  }
];
