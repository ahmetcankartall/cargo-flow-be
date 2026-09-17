import { pool } from '../db.js'

import type {
  CreateDriverInput,
  UpdateDriverInput,
} from '../schemas/driverSchema.js'

export interface DriverRow {
  id: string
  firstName: string
  lastName: string
  phone: string | null
  licenseNumber: string | null
  status: string
  notes: string | null
  createdAt: string
  updatedAt: string
}

export async function getDrivers(): Promise<DriverRow[]> {
  const result = await pool.query<DriverRow>(`
    SELECT
      id,
      first_name AS "firstName",
      last_name AS "lastName",
      phone,
      license_number AS "licenseNumber",
      status,
      notes,
      created_at::text AS "createdAt",
      updated_at::text AS "updatedAt"
    FROM drivers
    ORDER BY first_name ASC, last_name ASC
  `)

  return result.rows
}

export async function getDriverById(
  id: string,
): Promise<DriverRow | null> {
  const result = await pool.query<DriverRow>(
    `
      SELECT
        id,
        first_name AS "firstName",
        last_name AS "lastName",
        phone,
        license_number AS "licenseNumber",
        status,
        notes,
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
      FROM drivers
      WHERE id = $1
    `,
    [id],
  )

  return result.rows[0] ?? null
}

export async function createDriver(
  data: CreateDriverInput,
): Promise<DriverRow> {
  const result = await pool.query<DriverRow>(
    `
      INSERT INTO drivers (
        first_name,
        last_name,
        phone,
        license_number,
        status,
        notes
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        id,
        first_name AS "firstName",
        last_name AS "lastName",
        phone,
        license_number AS "licenseNumber",
        status,
        notes,
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
    `,
    [
      data.firstName,
      data.lastName,
      data.phone ?? null,
      data.licenseNumber ?? null,
      data.status ?? 'active',
      data.notes ?? null,
    ],
  )

  const driver = result.rows[0]

  if (!driver) {
    throw new Error(
      'Sürücü oluşturuldu ancak kayıt geri alınamadı.',
    )
  }

  return driver
}

export async function updateDriver(
  id: string,
  data: UpdateDriverInput,
): Promise<DriverRow | null> {
  const result = await pool.query<DriverRow>(
    `
      UPDATE drivers
      SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        phone = COALESCE($3, phone),
        license_number = COALESCE($4, license_number),
        status = COALESCE($5, status),
        notes = COALESCE($6, notes),
        updated_at = NOW()
      WHERE id = $7
      RETURNING
        id,
        first_name AS "firstName",
        last_name AS "lastName",
        phone,
        license_number AS "licenseNumber",
        status,
        notes,
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
    `,
    [
      data.firstName ?? null,
      data.lastName ?? null,
      data.phone ?? null,
      data.licenseNumber ?? null,
      data.status ?? null,
      data.notes ?? null,
      id,
    ],
  )

  return result.rows[0] ?? null
}

export async function deleteDriver(
  id: string,
): Promise<boolean> {
  const result = await pool.query(
    `
      DELETE FROM drivers
      WHERE id = $1
    `,
    [id],
  )

  return result.rowCount === 1
}