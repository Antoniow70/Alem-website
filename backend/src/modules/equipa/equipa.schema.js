import { z } from 'zod';

export const createTeamMemberSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    role: z.string().min(1, 'Função é obrigatória'),
    bio: z.string().optional().nullable(),
    photo_url: z.string().optional().nullable(),
    sort_order: z.number().int().optional()
  })
});

export const updateTeamMemberSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido')
  }),
  body: z.object({
    name: z.string().min(1, 'Nome é obrigatório').optional(),
    role: z.string().min(1, 'Função é obrigatória').optional(),
    bio: z.string().optional().nullable(),
    photo_url: z.string().optional().nullable(),
    sort_order: z.number().int().optional()
  })
});
