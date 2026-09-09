import { Router } from 'express'

import {
  createOperation,
  getOperations,
  type CreateOperationInput,
} from '../repositories/operationRepository.js'

const router = Router()

// GET /api/operations
router.get('/', async (_req, res) => {
  try {
    const operations = await getOperations()

    res.json({
      success: true,
      data: operations,
    })
  } catch (error) {
    console.error('Operasyonlar alınamadı:', error)

    res.status(500).json({
      success: false,
      message: 'Operasyonlar alınamadı.',
    })
  }
})

// POST /api/operations
router.post('/', async (req, res) => {
  try {
    const data = req.body as CreateOperationInput

    console.log('POST /api/operations body:')
    console.log(JSON.stringify(data, null, 2))

    const operation = await createOperation(data)

    res.status(201).json({
      success: true,
      message: 'Operasyon başarıyla oluşturuldu.',
      data: operation,
    })
  } catch (error) {
    console.error('=================================')
    console.error('OPERASYON OLUŞTURMA HATASI')
    console.error('=================================')
    console.error(error)

    res.status(500).json({
      success: false,
      message: 'Operasyon oluşturulamadı.',
    })
  }
})

export default router