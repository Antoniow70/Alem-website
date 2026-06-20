import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A palavra-passe deve ter pelo menos 6 caracteres')
  })
});
