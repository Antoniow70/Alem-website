import { z } from 'zod';

export const createPartnerSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Nome do parceiro é obrigatório'),
    logo_url: z.string().optional().nullable(),
    logo_data: z.string().optional().nullable()
  })
});

export const updatePartnerSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido')
  }),
  body: z.object({
    name: z.string().min(1, 'Nome do parceiro é obrigatório').optional(),
    logo_url: z.string().optional().nullable(),
    logo_data: z.string().optional().nullable()
  })
});
