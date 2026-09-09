import { pool } from '../db.js'

export interface OperationRow {
  id: string

  customerName: string

  operationType: string
  operationName: string
  reference: string | null
  operationCode: string | null
  operationGroup: string | null

  date: string
  time: string

  startLocation: string | null
  stop: string | null
  endLocation: string | null

  endDate: string
  endTime: string

  mode: string

  vehicleId: string | null
  vehiclePlate: string | null

  driverId: string | null
  driverName: string | null

  subcontractor: string | null

  subcontractorPrice: string | null
  subcontractorCurrency: string | null

  price: string | null
  priceCurrency: string
  paymentType: string

  description: string | null
  driverNote: string | null
  meetingPoint: string | null

  flightTime: string | null
  flightCode: string | null
  flightDirection: string | null
  flightTerminal: string | null

  greetingStaff: string | null
  guideName: string | null
  guidePhone: string | null

  commissionAccountName: string | null
  commissionPrice: string | null
  commissionCurrency: string | null

  status: string

  passengerCount: number
  mainPassenger: string
  extraServices: string

  createdAt: string
  updatedAt: string
}

export interface PassengerInput {
  firstName: string
  lastName: string
  phone?: string
  gender?: string
  nationality?: string
  identityNumber?: string
  voucherType?: string
  passengerType?: string
  description?: string
  stationNo?: string
}

export interface ExtraServiceInput {
  serviceName: string
  price?: number | null
  currency?: string
  supplier?: string
  costPrice?: number | null
  costCurrency?: string
}

export interface CreateOperationInput {
  customerId: string

  operationType: string
  operationName: string
  reference?: string
  operationCode?: string
  operationGroup?: string

  startDate: string
  startTime: string
  startLocationId?: string | null

  stop?: string | null

  endLocationId?: string | null
  endDate: string
  endTime: string

  mode: 'vehicle' | 'subcontractor'

  vehicleId?: string | null
  driverId?: string | null

  subcontractorId?: string | null
  subcontractorPrice?: number | null
  subcontractorCurrency?: string | null

  price?: number | null
  priceCurrency?: string
  paymentType?: string

  description?: string
  driverNote?: string
  meetingPoint?: string

  flightTime?: string | null
  flightCode?: string
  flightDirection?: string | null
  flightTerminal?: string

  greetingStaff?: string
  guideName?: string
  guidePhone?: string

  commissionAccountName?: string
  commissionPrice?: number | null
  commissionCurrency?: string | null

  status?: string

  passengers?: PassengerInput[]
  extraServices?: ExtraServiceInput[]
}

export async function getOperations(): Promise<OperationRow[]> {
  const result = await pool.query<OperationRow>(`
    SELECT
      o.id,

      c.name AS "customerName",

      o.operation_type AS "operationType",
      o.operation_name AS "operationName",
      o.reference,
      o.operation_code AS "operationCode",
      o.operation_group AS "operationGroup",

      o.start_date::text AS "date",
      o.start_time::text AS "time",

      start_location.name AS "startLocation",
      o.stop,

      end_location.name AS "endLocation",

      o.end_date::text AS "endDate",
      o.end_time::text AS "endTime",

      o.mode,

      o.vehicle_id AS "vehicleId",
      v.plate AS "vehiclePlate",

      o.driver_id AS "driverId",

      CASE
        WHEN d.id IS NOT NULL
        THEN CONCAT(d.first_name, ' ', d.last_name)
        ELSE NULL
      END AS "driverName",

      s.name AS "subcontractor",

      o.subcontractor_price AS "subcontractorPrice",
      o.subcontractor_currency AS "subcontractorCurrency",

      o.price,
      o.price_currency AS "priceCurrency",
      o.payment_type AS "paymentType",

      o.description,
      o.driver_note AS "driverNote",
      o.meeting_point AS "meetingPoint",

      o.flight_time::text AS "flightTime",
      o.flight_code AS "flightCode",
      o.flight_direction AS "flightDirection",
      o.flight_terminal AS "flightTerminal",

      o.greeting_staff AS "greetingStaff",
      o.guide_name AS "guideName",
      o.guide_phone AS "guidePhone",

      o.commission_account_name AS "commissionAccountName",
      o.commission_price AS "commissionPrice",
      o.commission_currency AS "commissionCurrency",

      o.status,

      (
        SELECT COUNT(*)
        FROM passengers p
        WHERE p.operation_id = o.id
      )::int AS "passengerCount",

      COALESCE(
        (
          SELECT CONCAT(
            p.first_name,
            ' ',
            p.last_name
          )
          FROM passengers p
          WHERE p.operation_id = o.id
          ORDER BY p.created_at ASC
          LIMIT 1
        ),
        ''
      ) AS "mainPassenger",

      COALESCE(
        (
          SELECT STRING_AGG(
            oes.service_name,
            ', '
          )
          FROM operation_extra_services oes
          WHERE oes.operation_id = o.id
            AND oes.service_name IS NOT NULL
            AND oes.service_name <> ''
        ),
        ''
      ) AS "extraServices",

      o.created_at::text AS "createdAt",
      o.updated_at::text AS "updatedAt"

    FROM operations o

    LEFT JOIN customers c
      ON c.id = o.customer_id

    LEFT JOIN vehicles v
      ON v.id = o.vehicle_id

    LEFT JOIN drivers d
      ON d.id = o.driver_id

    LEFT JOIN subcontractors s
      ON s.id = o.subcontractor_id

    LEFT JOIN locations start_location
      ON start_location.id = o.start_location_id

    LEFT JOIN locations end_location
      ON end_location.id = o.end_location_id

    ORDER BY
      o.start_date DESC,
      o.start_time DESC
  `)

  return result.rows
}

export async function getOperationById(
  id: string,
): Promise<OperationRow | null> {
  const result = await pool.query<OperationRow>(
    `
      SELECT
        o.id,

        c.name AS "customerName",

        o.operation_type AS "operationType",
        o.operation_name AS "operationName",
        o.reference,
        o.operation_code AS "operationCode",
        o.operation_group AS "operationGroup",

        o.start_date::text AS "date",
        o.start_time::text AS "time",

        start_location.name AS "startLocation",
        o.stop,

        end_location.name AS "endLocation",

        o.end_date::text AS "endDate",
        o.end_time::text AS "endTime",

        o.mode,

        o.vehicle_id AS "vehicleId",
        v.plate AS "vehiclePlate",

        o.driver_id AS "driverId",

        CASE
          WHEN d.id IS NOT NULL
          THEN CONCAT(d.first_name, ' ', d.last_name)
          ELSE NULL
        END AS "driverName",

        s.name AS "subcontractor",

        o.subcontractor_price AS "subcontractorPrice",
        o.subcontractor_currency AS "subcontractorCurrency",

        o.price,
        o.price_currency AS "priceCurrency",
        o.payment_type AS "paymentType",

        o.description,
        o.driver_note AS "driverNote",
        o.meeting_point AS "meetingPoint",

        o.flight_time::text AS "flightTime",
        o.flight_code AS "flightCode",
        o.flight_direction AS "flightDirection",
        o.flight_terminal AS "flightTerminal",

        o.greeting_staff AS "greetingStaff",
        o.guide_name AS "guideName",
        o.guide_phone AS "guidePhone",

        o.commission_account_name AS "commissionAccountName",
        o.commission_price AS "commissionPrice",
        o.commission_currency AS "commissionCurrency",

        o.status,

        (
          SELECT COUNT(*)
          FROM passengers p
          WHERE p.operation_id = o.id
        )::int AS "passengerCount",

        COALESCE(
          (
            SELECT CONCAT(
              p.first_name,
              ' ',
              p.last_name
            )
            FROM passengers p
            WHERE p.operation_id = o.id
            ORDER BY p.created_at ASC
            LIMIT 1
          ),
          ''
        ) AS "mainPassenger",

        COALESCE(
          (
            SELECT STRING_AGG(
              oes.service_name,
              ', '
            )
            FROM operation_extra_services oes
            WHERE oes.operation_id = o.id
              AND oes.service_name IS NOT NULL
              AND oes.service_name <> ''
          ),
          ''
        ) AS "extraServices",

        o.created_at::text AS "createdAt",
        o.updated_at::text AS "updatedAt"

      FROM operations o

      LEFT JOIN customers c
        ON c.id = o.customer_id

      LEFT JOIN vehicles v
        ON v.id = o.vehicle_id

      LEFT JOIN drivers d
        ON d.id = o.driver_id

      LEFT JOIN subcontractors s
        ON s.id = o.subcontractor_id

      LEFT JOIN locations start_location
        ON start_location.id = o.start_location_id

      LEFT JOIN locations end_location
        ON end_location.id = o.end_location_id

      WHERE o.id = $1
    `,
    [id],
  )

  return result.rows[0] ?? null
}

export async function createOperation(
  data: CreateOperationInput,
): Promise<OperationRow> {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const operationResult = await client.query<{ id: string }>(
      `
        INSERT INTO operations (
          customer_id,
          operation_type,
          operation_name,
          reference,
          operation_code,
          operation_group,

          start_date,
          start_time,
          start_location_id,

          stop,

          end_location_id,
          end_date,
          end_time,

          mode,

          vehicle_id,
          driver_id,

          subcontractor_id,
          subcontractor_price,
          subcontractor_currency,

          price,
          price_currency,
          payment_type,

          description,
          driver_note,
          meeting_point,

          flight_time,
          flight_code,
          flight_direction,
          flight_terminal,

          greeting_staff,
          guide_name,
          guide_phone,

          commission_account_name,
          commission_price,
          commission_currency,

          status
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,

          $7,
          $8,
          $9,

          $10,

          $11,
          $12,
          $13,

          $14,

          $15,
          $16,

          $17,
          $18,
          $19,

          $20,
          $21,
          $22,

          $23,
          $24,
          $25,

          $26,
          $27,
          $28,
          $29,

          $30,
          $31,
          $32,

          $33,
          $34,
          $35,

          $36
        )
        RETURNING id
      `,
      [
        data.customerId,

        data.operationType,
        data.operationName,
        data.reference ?? null,
        data.operationCode ?? null,
        data.operationGroup ?? null,

        data.startDate,
        data.startTime,
        data.startLocationId ?? null,

        data.stop ?? null,

        data.endLocationId ?? null,
        data.endDate,
        data.endTime,

        data.mode,

        data.vehicleId ?? null,
        data.driverId ?? null,

        data.subcontractorId ?? null,
        data.subcontractorPrice ?? null,
        data.subcontractorCurrency ?? null,

        data.price ?? null,
        data.priceCurrency ?? 'TRY',
        data.paymentType ?? 'Cari',

        data.description ?? null,
        data.driverNote ?? null,
        data.meetingPoint ?? null,

        data.flightTime ?? null,
        data.flightCode ?? null,
        data.flightDirection ?? null,
        data.flightTerminal ?? null,

        data.greetingStaff ?? null,
        data.guideName ?? null,
        data.guidePhone ?? null,

        data.commissionAccountName ?? null,
        data.commissionPrice ?? null,
        data.commissionCurrency ?? null,

        data.status ?? 'Planlandı',
      ],
    )

    const operation = operationResult.rows[0]

    if (!operation) {
      throw new Error(
        'Operasyon oluşturuldu ancak kayıt geri alınamadı.',
      )
    }

    // -----------------------------------------------------
    // Yolcular
    // -----------------------------------------------------

    for (const passenger of data.passengers ?? []) {
      await client.query(
        `
          INSERT INTO passengers (
            operation_id,
            first_name,
            last_name,
            phone,
            gender,
            nationality,
            identity_number,
            voucher_type,
            passenger_type,
            description,
            station_no
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10,
            $11
          )
        `,
        [
          operation.id,
          passenger.firstName,
          passenger.lastName,
          passenger.phone ?? null,
          passenger.gender ?? null,
          passenger.nationality ?? null,
          passenger.identityNumber ?? null,
          passenger.voucherType ?? null,
          passenger.passengerType ?? 'adult',
          passenger.description ?? null,
          passenger.stationNo ?? null,
        ],
      )
    }

    // -----------------------------------------------------
    // Ek Hizmetler
    // -----------------------------------------------------

    for (const service of data.extraServices ?? []) {
      await client.query(
        `
          INSERT INTO operation_extra_services (
            operation_id,
            service_name,
            price,
            currency,
            cost_price,
            cost_currency
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6
          )
        `,
        [
          operation.id,
          service.serviceName,
          service.price ?? null,
          service.currency ?? 'TRY',
          service.costPrice ?? null,
          service.costCurrency ?? 'TRY',
        ],
      )
    }

    await client.query('COMMIT')

    const createdOperation = await getOperationById(
      operation.id,
    )

    if (!createdOperation) {
      throw new Error(
        'Operasyon oluşturuldu ancak kayıt tekrar okunamadı.',
      )
    }

    return createdOperation
  } catch (error) {
    await client.query('ROLLBACK')

    throw error
  } finally {
    client.release()
  }
}