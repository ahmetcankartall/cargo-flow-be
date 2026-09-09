import express from 'express'
import cors from 'cors'
import operationRoutes from './routes/operationRoutes.js'
import { pool } from './db.js'

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

export default app