import { pool } from '../db.js'
import type {
  CreateCustomerInput,
  UpdateCustomerInput,
} from '../schemas/customerSchema.js'

export interface CustomerRow {
  id: string

  name: string
  code: string | null
  phone: string | null
  email: string | null
  taxNumber: string | null
  address: string | null
  notes: string | null

  createdAt: string
  updatedAt: string
}

export async function getCustomers(): Promise<CustomerRow[]> {
  const result = await pool.query<CustomerRow>(`
    SELECT
      id,
      name,
      code,
      phone,
      email,
      tax_number AS "taxNumber",
      address,
      notes,
      created_at::text AS "createdAt",
      updated_at::text AS "updatedAt"
    FROM customers
    ORDER BY name ASC
  `)

  return result.rows
}

export async function getCustomerById(
  id: string,
): Promise<CustomerRow | null> {
  const result = await pool.query<CustomerRow>(
    `
      SELECT
        id,
        name,
        code,
        phone,
        email,
        tax_number AS "taxNumber",
        address,
        notes,
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
      FROM customers
      WHERE id = $1
    `,
    [id],
  )

  return result.rows[0] ?? null
}

export async function createCustomer(
  data: CreateCustomerInput,
): Promise<CustomerRow> {
  const result = await pool.query<CustomerRow>(
    `
      INSERT INTO customers (
        name,
        code,
        phone,
        email,
        tax_number,
        address,
        notes
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7
      )
      RETURNING
        id,
        name,
        code,
        phone,
        email,
        tax_number AS "taxNumber",
        address,
        notes,
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
    `,
    [
      data.name,
      data.code ?? null,
      data.phone ?? null,
      data.email ?? null,
      data.taxNumber ?? null,
      data.address ?? null,
      data.notes ?? null,
    ],
  )

  const customer = result.rows[0]

  if (!customer) {
    throw new Error(
      'Müşteri oluşturuldu ancak kayıt geri alınamadı.',
    )
  }

  return customer
}

export async function updateCustomer(
  id: string,
  data: UpdateCustomerInput,
): Promise<CustomerRow | null> {
  const result = await pool.query<CustomerRow>(
    `
      UPDATE customers
      SET
        name = COALESCE($1, name),
        code = COALESCE($2, code),
        phone = COALESCE($3, phone),
        email = COALESCE($4, email),
        tax_number = COALESCE($5, tax_number),
        address = COALESCE($6, address),
        notes = COALESCE($7, notes),
        updated_at = NOW()
      WHERE id = $8
      RETURNING
        id,
        name,
        code,
        phone,
        email,
        tax_number AS "taxNumber",
        address,
        notes,
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
    `,
    [
      data.name ?? null,
      data.code ?? null,
      data.phone ?? null,
      data.email ?? null,
      data.taxNumber ?? null,
      data.address ?? null,
      data.notes ?? null,
      id,
    ],
  )

  return result.rows[0] ?? null
}

export async function deleteCustomer(
  id: string,
): Promise<boolean> {
  const result = await pool.query(
    `
      DELETE FROM customers
      WHERE id = $1
    `,
    [id],
  )

  return result.rowCount === 1
}