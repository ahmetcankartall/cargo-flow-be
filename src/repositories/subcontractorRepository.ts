import { pool } from '../db.js'

export interface SubcontractorRow {
  id: string
  name: string
  phone: string | null
  email: string | null
  taxNumber: string | null
  address: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export async function getSubcontractors(): Promise<
  SubcontractorRow[]
> {
  const result =
    await pool.query<SubcontractorRow>(`
      SELECT
        id,
        name,
        phone,
        email,
        tax_number AS "taxNumber",
        address,
        notes,
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
      FROM subcontractors
      ORDER BY name ASC
    `)

  return result.rows
}

export async function getSubcontractorById(
  id: string,
): Promise<SubcontractorRow | null> {
  const result =
    await pool.query<SubcontractorRow>(
      `
        SELECT
          id,
          name,
          phone,
          email,
          tax_number AS "taxNumber",
          address,
          notes,
          created_at::text AS "createdAt",
          updated_at::text AS "updatedAt"
        FROM subcontractors
        WHERE id = $1
      `,
      [id],
    )

  return result.rows[0] ?? null
}