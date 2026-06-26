import { z } from 'zod';

export const createDocumentSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Título do documento é obrigatório'),
    description: z.string().optional().nullable(),
    file_url: z.string().optional().nullable(),
    file_data: z.string().optional().nullable()
  })
});

export const updateDocumentSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido')
  }),
  body: z.object({
    title: z.string().min(1, 'Título do documento é obrigatório').optional(),
    description: z.string().optional().nullable(),
    file_url: z.string().optional().nullable(),
    file_data: z.string().optional().nullable()
  })
});
