import 'dotenv/config'
import { Pool } from 'pg'

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

pool.on('error', (error) => {
  console.error('PostgreSQL pool hatası:', error)
})
pool.connect()
  .then(async (client) => {
    const result = await client.query(`
      SELECT
        current_database() AS database,
        current_user AS user,
        inet_server_addr() AS host,
        inet_server_port() AS port
    `)

    console.log('BACKEND POSTGRES CONNECTION:')
    console.log(result.rows[0])

    const constraintResult = await client.query(`
      SELECT
        conname,
        pg_get_constraintdef(oid) AS definition
      FROM pg_constraint
      WHERE conname = 'operations_payment_type_check'
    `)

    console.log('BACKEND PAYMENT CONSTRAINT:')
    console.log(constraintResult.rows[0])

    client.release()
  })
  .catch((error) => {
    console.error(
      'PostgreSQL bağlantı testi başarısız:',
      error,
    )
  })