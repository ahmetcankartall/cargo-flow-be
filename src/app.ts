import express from 'express'
import cors from 'cors'
import operationRoutes from './routes/operationRoutes.js'
import { pool } from './db.js'
import customerRoutes from './routes/customerRoutes.js'
import vehicleRoutes from './routes/vehicleRoutes.js'
import driverRoutes from './routes/driverRoutes.js'
import locationRoutes from './routes/locationRoutes.js'
import subcontractorRoutes from './routes/subcontractorRoutes.js'
const app = express()

app.use(cors())
app.use(express.json())

// Backend sağlık kontrolü
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'CargoFlow backend çalışıyor.',
  })
})

// PostgreSQL bağlantı kontrolü
app.get('/api/db-health', async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')

    res.json({
      success: true,
      message: 'PostgreSQL bağlantısı başarılı.',
      time: result.rows[0].now,
    })
  } catch (error) {
    console.error('Database bağlantı hatası:', error)

    res.status(500).json({
      success: false,
      message: 'PostgreSQL bağlantısı başarısız.',
    })
  }
})

// Operasyon route'ları
app.use('/api/operations', operationRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/vehicles', vehicleRoutes)
app.use('/api/drivers', driverRoutes)
app.use('/api/locations', locationRoutes)
app.use('/api/subcontractors', subcontractorRoutes)


export default app