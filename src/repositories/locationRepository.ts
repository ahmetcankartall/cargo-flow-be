import { pool } from '../db.js'

import type {
  CreateLocationInput,
  UpdateLocationInput,
} from '../schemas/locationSchema.js'

export interface LocationRow {
  id: string
  name: string
  address: string | null
  city: string | null
  district: string | null
  latitude: string | null
  longitude: string | null
  type: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export async function getLocations(): Promise<LocationRow[]> {
  const result = await pool.query<LocationRow>(`
    SELECT
      id,
      name,
      address,
      city,
      district,
      latitude::text AS latitude,
      longitude::text AS longitude,
      type,
      notes,
      created_at::text AS "createdAt",
      updated_at::text AS "updatedAt"
    FROM locations
    ORDER BY name ASC
  `)

  return result.rows
}

export async function getLocationById(
  id: string,
): Promise<LocationRow | null> {
  const result = await pool.query<LocationRow>(
    `
      SELECT
        id,
        name,
        address,
        city,
        district,
        latitude::text AS latitude,
        longitude::text AS longitude,
        type,
        notes,
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
      FROM locations
      WHERE id = $1
    `,
    [id],
  )

  return result.rows[0] ?? null
}

export async function createLocation(
  data: CreateLocationInput,
): Promise<LocationRow> {
  const result = await pool.query<LocationRow>(
    `
      INSERT INTO locations (
        name,
        address,
        city,
        district,
        latitude,
        longitude,
        type,
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
        name,
        address,
        city,
        district,
        latitude::text AS latitude,
        longitude::text AS longitude,
        type,
        notes,
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
    `,
    [
      data.name,
      data.address ?? null,
      data.city ?? null,
      data.district ?? null,
      data.latitude ?? null,
      data.longitude ?? null,
      data.type ?? null,
      data.notes ?? null,
    ],
  )

  const location = result.rows[0]

  if (!location) {
    throw new Error(
      'Lokasyon oluşturuldu ancak kayıt geri alınamadı.',
    )
  }

  return location
}

export async function updateLocation(
  id: string,
  data: UpdateLocationInput,
): Promise<LocationRow | null> {
  const result = await pool.query<LocationRow>(
    `
      UPDATE locations
      SET
        name = COALESCE($1, name),
        address = COALESCE($2, address),
        city = COALESCE($3, city),
        district = COALESCE($4, district),
        latitude = COALESCE($5, latitude),
        longitude = COALESCE($6, longitude),
        type = COALESCE($7, type),
        notes = COALESCE($8, notes),
        updated_at = NOW()
      WHERE id = $9
      RETURNING
        id,
        name,
        address,
        city,
        district,
        latitude::text AS latitude,
        longitude::text AS longitude,
        type,
        notes,
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
    `,
    [
      data.name ?? null,
      data.address ?? null,
      data.city ?? null,
      data.district ?? null,
      data.latitude ?? null,
      data.longitude ?? null,
      data.type ?? null,
      data.notes ?? null,
      id,
    ],
  )

  return result.rows[0] ?? null
}

export async function deleteLocation(
  id: string,
): Promise<boolean> {
  const result = await pool.query(
    `
      DELETE FROM locations
      WHERE id = $1
    `,
    [id],
  )

  return result.rowCount === 1
}