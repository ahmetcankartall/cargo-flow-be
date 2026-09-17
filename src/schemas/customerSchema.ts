import { z } from 'zod'

export const createCustomerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Müşteri adı en az 2 karakter olmalıdır.')
    .max(150, 'Müşteri adı en fazla 150 karakter olabilir.'),

  code: z
    .string()
    .trim()
    .max(50, 'Müşteri kodu en fazla 50 karakter olabilir.')
    .optional(),

  phone: z
    .string()
    .trim()
    .max(30, 'Telefon numarası en fazla 30 karakter olabilir.')
    .optional(),

  email: z
    .email('Geçerli bir e-posta adresi giriniz.')
    .optional(),

  taxNumber: z
    .string()
    .trim()
    .max(50, 'Vergi numarası en fazla 50 karakter olabilir.')
    .optional(),

  address: z
    .string()
    .trim()
    .optional(),

  notes: z
    .string()
    .trim()
    .optional(),
})

export const updateCustomerSchema =
  createCustomerSchema.partial()

export type CreateCustomerInput = z.infer<
  typeof createCustomerSchema
>

export type UpdateCustomerInput = z.infer<
  typeof updateCustomerSchema
>