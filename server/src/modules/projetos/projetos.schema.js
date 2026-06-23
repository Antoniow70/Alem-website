import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Nome do projeto é obrigatório'),
    objetivos_especificos: z.string().min(1, 'Objetivos específicos são obrigatórios'),
    activity_id: z.string().uuid('Atividade é obrigatória e deve ser um UUID válido'),
    status: z.enum(['Planeamento', 'Em Curso', 'Concluido']).optional(),
    capa_url: z.string().optional().nullable(),
    gallery: z.array(z.string()).optional(),
    equipa_responsavel: z.array(z.any()).optional()
  })
});

export const updateProjectSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido')
  }),
  body: z.object({
    name: z.string().min(1, 'Nome do projeto é obrigatório').optional(),
    objetivos_especificos: z.string().min(1, 'Objetivos específicos são obrigatórios').optional(),
    activity_id: z.string().uuid('ID de atividade inválido').optional(),
    status: z.enum(['Planeamento', 'Em Curso', 'Concluido']).optional(),
    capa_url: z.string().optional().nullable(),
    gallery: z.array(z.string()).optional(),
    equipa_responsavel: z.array(z.any()).optional()
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
