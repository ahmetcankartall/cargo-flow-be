import { pool } from '../db.js'

import type {
  CreateVehicleInput,
  UpdateVehicleInput,
} from '../schemas/vehicleSchema.js'

export interface VehicleRow {
  id: string
  plate: string
  vehicleType: string
  brand: string | null
  model: string | null
  capacity: number | null
  productionYear: number | null
  status: string
  notes: string | null
  createdAt: string
  updatedAt: string
}

export async function getVehicles(): Promise<VehicleRow[]> {
  const result = await pool.query<VehicleRow>(`
    SELECT
      id,
      plate,
      vehicle_type AS "vehicleType",
      brand,
      model,
      capacity,
      production_year AS "productionYear",
      status,
      notes,
      created_at::text AS "createdAt",
      updated_at::text AS "updatedAt"
    FROM vehicles
    ORDER BY plate ASC
  `)

  return result.rows
}

export async function getVehicleById(
  id: string,
): Promise<VehicleRow | null> {
  const result = await pool.query<VehicleRow>(
    `
      SELECT
        id,
        plate,
        vehicle_type AS "vehicleType",
        brand,
        model,
        capacity,
        production_year AS "productionYear",
        status,
        notes,
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
      FROM vehicles
      WHERE id = $1
    `,
    [id],
  )

  return result.rows[0] ?? null
}

export async function createVehicle(
  data: CreateVehicleInput,
): Promise<VehicleRow> {
  const result = await pool.query<VehicleRow>(
    `
      INSERT INTO vehicles (
        plate,
        vehicle_type,
        brand,
        model,
        capacity,
        production_year,
        status,
        notes
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8
      )
      RETURNING
        id,
        plate,
        vehicle_type AS "vehicleType",
        brand,
        model,
        capacity,
        production_year AS "productionYear",
        status,
        notes,
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
    `,
    [
      data.plate,
      data.vehicleType,
      data.brand ?? null,
      data.model ?? null,
      data.capacity ?? null,
      data.productionYear ?? null,
      data.status ?? 'active',
      data.notes ?? null,
    ],
  )

  const vehicle = result.rows[0]

  if (!vehicle) {
    throw new Error(
      'Araç oluşturuldu ancak kayıt geri alınamadı.',
    )
  }

  return vehicle
}

export async function updateVehicle(
  id: string,
  data: UpdateVehicleInput,
): Promise<VehicleRow | null> {
  const result = await pool.query<VehicleRow>(
    `
      UPDATE vehicles
      SET
        plate = COALESCE($1, plate),
        vehicle_type = COALESCE($2, vehicle_type),
        brand = COALESCE($3, brand),
        model = COALESCE($4, model),
        capacity = COALESCE($5, capacity),
        production_year = COALESCE($6, production_year),
        status = COALESCE($7, status),
        notes = COALESCE($8, notes),
        updated_at = NOW()
      WHERE id = $9
      RETURNING
        id,
        plate,
        vehicle_type AS "vehicleType",
        brand,
        model,
        capacity,
        production_year AS "productionYear",
        status,
        notes,
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
    `,
    [
      data.plate ?? null,
      data.vehicleType ?? null,
      data.brand ?? null,
      data.model ?? null,
      data.capacity ?? null,
      data.productionYear ?? null,
      data.status ?? null,
      data.notes ?? null,
      id,
    ],
  )

  return result.rows[0] ?? null
}

export async function deleteVehicle(
  id: string,
): Promise<boolean> {
  const result = await pool.query(
    `
      DELETE FROM vehicles
      WHERE id = $1
    `,
    [id],
  )

  return result.rowCount === 1
}