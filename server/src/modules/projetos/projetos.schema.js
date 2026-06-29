import { z } from 'zod';

const galleryItemSchema = z.object({
  type: z.enum(['image', 'video']).optional(),
  url: z.string(),
  description: z.string().optional()
});

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Nome do projeto é obrigatório'),
    objetivos_especificos: z.string().min(1, 'Objetivos específicos são obrigatórios'),
    pillar_id: z.string().regex(/^[0-9a-fA-F-]{36}$/, 'Pilar inválido').nullable().optional(),
    status: z.enum(['Planeamento', 'Em Curso', 'Concluido']).optional(),
    capa_url: z.string().optional().nullable(),
    gallery: z.array(galleryItemSchema).optional(),
    equipa_responsavel: z.array(z.any()).optional(),
    activities: z.array(z.string().regex(/^[0-9a-fA-F-]{36}$/, 'ID de atividade inválido')).optional()
  })
});

export const updateProjectSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido')
  }),
  body: z.object({
    name: z.string().min(1, 'Nome do projeto é obrigatório').optional(),
    objetivos_especificos: z.string().min(1, 'Objetivos específicos são obrigatórios').optional(),
    pillar_id: z.string().regex(/^[0-9a-fA-F-]{36}$/, 'Pilar inválido').nullable().optional(),
    status: z.enum(['Planeamento', 'Em Curso', 'Concluido']).optional(),
    capa_url: z.string().optional().nullable(),
    gallery: z.array(galleryItemSchema).optional(),
    equipa_responsavel: z.array(z.any()).optional(),
    activities: z.array(z.string().regex(/^[0-9a-fA-F-]{36}$/, 'ID de atividade inválido')).optional()
  })
});

export const updateProjectStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido')
  }),
  body: z.object({
    status: z.enum(['Planeamento', 'Em Curso', 'Concluido'])
  })
});
