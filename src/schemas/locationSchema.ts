import { z } from 'zod'

export const createLocationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      2,
      'Lokasyon adı en az 2 karakter olmalıdır.',
    )
    .max(
      200,
      'Lokasyon adı en fazla 200 karakter olabilir.',
    ),

  address: z
    .string()
    .trim()
    .optional(),

  city: z
    .string()
    .trim()
    .max(
      100,
      'Şehir en fazla 100 karakter olabilir.',
    )
    .optional(),

  district: z
    .string()
    .trim()
    .max(
      100,
      'İlçe en fazla 100 karakter olabilir.',
    )
    .optional(),

  latitude: z
    .number()
    .min(-90)
    .max(90)
    .optional(),

  longitude: z
    .number()
    .min(-180)
    .max(180)
    .optional(),

  type: z
    .string()
    .trim()
    .max(
      50,
      'Lokasyon tipi en fazla 50 karakter olabilir.',
    )
    .optional(),

  notes: z
    .string()
    .trim()
    .optional(),
})

export const updateLocationSchema =
  createLocationSchema.partial()

export type CreateLocationInput = z.infer<
  typeof createLocationSchema
>

export type UpdateLocationInput = z.infer<
  typeof updateLocationSchema
>