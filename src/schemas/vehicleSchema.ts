import { z } from 'zod'

export const createVehicleSchema = z.object({
  plate: z
    .string()
    .trim()
    .min(2, 'Plaka en az 2 karakter olmalıdır.')
    .max(20, 'Plaka en fazla 20 karakter olabilir.'),

  vehicleType: z
    .string()
    .trim()
    .min(1, 'Araç türü zorunludur.')
    .max(
      50,
      'Araç türü en fazla 50 karakter olabilir.',
    ),

  brand: z
    .string()
    .trim()
    .max(
      100,
      'Marka en fazla 100 karakter olabilir.',
    )
    .optional(),

  model: z
    .string()
    .trim()
    .max(
      100,
      'Model en fazla 100 karakter olabilir.',
    )
    .optional(),

  capacity: z
    .number()
    .int()
    .positive()
    .optional(),

  productionYear: z
    .number()
    .int()
    .min(1950)
    .max(2100)
    .optional(),

  status: z
    .string()
    .trim()
    .max(30)
    .optional(),

  notes: z
    .string()
    .trim()
    .optional(),
})

export const updateVehicleSchema =
  createVehicleSchema.partial()

export type CreateVehicleInput = z.infer<
  typeof createVehicleSchema
>

export type UpdateVehicleInput = z.infer<
  typeof updateVehicleSchema
>