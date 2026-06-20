import { z } from 'zod';

export const submitMessageSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido').optional().nullable(),
    phone: z.string().optional().nullable(),
    genero: z.string().optional().nullable(),
    data_nascimento: z.string().optional().nullable(),
    endereco: z.string().optional().nullable(),
    tipo_necessidade: z.string().optional().nullable(),
    subject: z.string().min(1, 'Assunto é obrigatório'),
    message: z.string().min(1, 'Mensagem é obrigatória')
  })
});

export const updateMessageStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido')
  }),
  body: z.object({
    status: z.enum(['Pendente', 'Em Analise', 'Aceito', 'Recusado'])
  })
});

export const bulkUpdateMessageStatusSchema = z.object({
  body: z.object({
    ids: z.array(z.string().uuid('ID inválido')),
    status: z.enum(['Pendente', 'Em Analise', 'Aceito', 'Recusado'])
  })
});
