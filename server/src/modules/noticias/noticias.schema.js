import { z } from 'zod';

export const createNewsSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'O título da notícia deve ter pelo menos 3 caracteres'),
    description: z.string().min(5, 'A descrição deve ter pelo menos 5 caracteres'),
    news_date: z.string().min(1, 'A data da notícia é obrigatória'),
    capa_url: z.string().optional().nullable(),
    capa_data: z.string().optional().nullable()
  })
});

export const updateNewsSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido')
  }),
  body: z.object({
    title: z.string().min(3, 'O título da notícia deve ter pelo menos 3 caracteres').optional(),
    description: z.string().min(5, 'A descrição deve ter pelo menos 5 caracteres').optional(),
    news_date: z.string().min(1, 'A data da notícia é obrigatória').optional(),
    capa_url: z.string().optional().nullable(),
    capa_data: z.string().optional().nullable()
  })
});
