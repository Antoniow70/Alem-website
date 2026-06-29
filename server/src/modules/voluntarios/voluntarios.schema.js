import { z } from 'zod';

export const submitVolunteerSchema = z.object({
  body: z.object({
    full_name: z.string().min(1, 'Nome completo é obrigatório'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(1, 'Telefone é obrigatório'),
    genero: z.string().optional().nullable(),
    endereco: z.string().optional().nullable(),
    area_interesse: z.string().optional().nullable(),
    message: z.string().optional().nullable(),
    activity_id: z.string().regex(/^[0-9a-fA-F-]{36}$/, 'ID da atividade inválido')
  })
});

export const updateVolunteerStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido')
  }),
  body: z.object({
    status: z.enum(['Pendente', 'Em Analise', 'Aprovado', 'Recusado'])
  })
});

export const bulkUpdateVolunteerStatusSchema = z.object({
  body: z.object({
    ids: z.array(z.string().uuid('ID inválido')),
    status: z.enum(['Pendente', 'Em Analise', 'Aprovado', 'Recusado'])
  })
});
