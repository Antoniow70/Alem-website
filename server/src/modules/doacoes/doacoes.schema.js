import { z } from 'zod';

export const submitDonationSchema = z.object({
  body: z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    telefone: z.string().min(1, 'Telefone é obrigatório'),
    causa: z.string().min(1, 'Causa é obrigatória'),
    valor: z.number().positive('Valor deve ser positivo'),
    mensagem: z.string().optional().nullable(),
    metodo_pagamento: z.enum(['M-Pesa', 'Transferencia Bancaria', 'Cartao'])
  })
});

export const updateDonationStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido')
  }),
  body: z.object({
    status: z.enum(['Pendente', 'Em Analise', 'Recebido', 'Nao Recebido'])
  })
});
