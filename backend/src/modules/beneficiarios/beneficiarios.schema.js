import { z } from 'zod';

export const createStorySchema = z.object({
  body: z.object({
    full_name: z.string().min(1, 'Nome é obrigatório'),
    story: z.string().min(1, 'História é obrigatória'),
    project_id: z.string().uuid().nullable().optional(),
    image_url: z.string().optional().nullable()
  })
});

export const updateStorySchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido')
  }),
  body: z.object({
    full_name: z.string().min(1, 'Nome é obrigatório').optional(),
    story: z.string().min(1, 'História é obrigatória').optional(),
    project_id: z.string().uuid().nullable().optional(),
    image_url: z.string().optional().nullable()
  })
});
