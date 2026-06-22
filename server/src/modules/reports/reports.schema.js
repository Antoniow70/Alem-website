import { z } from 'zod';

export const getReportSchema = z.object({
  query: z.object({
    startDate: z.string({
      required_error: 'A data de início é obrigatória.',
    }).refine((val) => !isNaN(Date.parse(val)), {
      message: 'A data de início deve ser uma data válida no formato YYYY-MM-DD.',
    }),
    endDate: z.string({
      required_error: 'A data de fim é obrigatória.',
    }).refine((val) => !isNaN(Date.parse(val)), {
      message: 'A data de fim deve ser uma data válida no formato YYYY-MM-DD.',
    }),
  }).refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: 'A data de início não pode ser posterior à data de fim.',
    path: ['startDate'],
  }),
});
