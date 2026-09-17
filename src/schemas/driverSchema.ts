import { z } from 'zod'

export const createDriverSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(
      2,
      'Ad en az 2 karakter olmalıdır.',
    )
    .max(
      100,
      'Ad en fazla 100 karakter olabilir.',
    ),

  lastName: z
    .string()
    .trim()
    .min(
      2,
      'Soyad en az 2 karakter olmalıdır.',
    )
    .max(
      100,
      'Soyad en fazla 100 karakter olabilir.',
    ),

  phone: z
    .string()
    .trim()
    .max(
      30,
      'Telefon numarası en fazla 30 karakter olabilir.',
    )
    .optional(),

  licenseNumber: z
    .string()
    .trim()
    .max(
      100,
      'Ehliyet numarası en fazla 100 karakter olabilir.',
    )
    .optional(),

  status: z
    .string()
    .trim()
    .max(
      30,
      'Durum en fazla 30 karakter olabilir.',
    )
    .optional(),

  notes: z
    .string()
    .trim()
    .optional(),
})

export const updateDriverSchema =
  createDriverSchema.partial()

export type CreateDriverInput = z.infer<
  typeof createDriverSchema
>

export type UpdateDriverInput = z.infer<
  typeof updateDriverSchema
>