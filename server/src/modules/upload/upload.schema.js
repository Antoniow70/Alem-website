import { z } from 'zod';

export const uploadSchema = z.object({
  body: z.object({
    fileData: z.string({
      required_error: 'Os dados do ficheiro (base64) são obrigatórios.',
    }).refine((val) => val.startsWith('data:'), {
      message: 'Os dados do ficheiro devem ser uma string base64 válida iniciada com o tipo de dados.',
    }),
    fileName: z.string({
      required_error: 'O nome do ficheiro é obrigatório.',
    }).min(1, 'O nome do ficheiro não pode estar vazio.'),
    folder: z.string().optional().default('projects'),
  }),
});
