import { Router } from 'express'

import {
  createOperation,
  deleteOperation,
  getOperationById,
  getOperations,
  updateOperation,
  type CreateOperationInput,
  type UpdateOperationInput,
} from '../repositories/operationRepository.js'

const router = Router()

// =========================================================
// TÜM OPERASYONLAR
// =========================================================

router.get('/', async (_req, res) => {
  try {
    const operations =
      await getOperations()

    res.json({
      success: true,
      data: operations,
    })
  } catch (error) {
    console.error(
      'Operasyonlar alınamadı:',
      error,
    )

    res.status(500).json({
      success: false,
      message:
        'Operasyonlar alınamadı.',
    })
  }
})

// =========================================================
// TEK OPERASYON
// =========================================================

router.get('/:id', async (req, res) => {
  const id = req.params.id

  if (typeof id !== 'string') {
    res.status(400).json({
      success: false,
      message:
        'Geçerli bir operasyon ID gönderilmelidir.',
    })

    return
  }

  try {
    const operation =
      await getOperationById(id)

    if (!operation) {
      res.status(404).json({
        success: false,
        message:
          'Operasyon bulunamadı.',
      })

      return
    }

    res.json({
      success: true,
      data: operation,
    })
  } catch (error) {
    console.error(
      'Operasyon detayı alınamadı:',
      error,
    )

    res.status(500).json({
      success: false,
      message:
        'Operasyon detayı alınamadı.',
    })
  }
})

// =========================================================
// OPERASYON OLUŞTUR
// =========================================================

router.post('/', async (req, res) => {
  try {
    const data =
      req.body as CreateOperationInput

    console.log(
      'POST /api/operations body:',
    )

    console.log(
      JSON.stringify(
        data,
        null,
        2,
      ),
    )

    const operation =
      await createOperation(data)

    res.status(201).json({
      success: true,
      message:
        'Operasyon başarıyla oluşturuldu.',
      data: operation,
    })
  } catch (error) {
    console.error('=================================')
    console.error(
      'OPERASYON OLUŞTURMA HATASI',
    )
    console.error('=================================')
    console.error(error)

    res.status(500).json({
      success: false,
      message:
        'Operasyon oluşturulamadı.',
    })
  }
})

// =========================================================
// OPERASYON GÜNCELLE
// =========================================================

router.put('/:id', async (req, res) => {
  const id = req.params.id

  if (typeof id !== 'string') {
    res.status(400).json({
      success: false,
      message:
        'Geçerli bir operasyon ID gönderilmelidir.',
    })

    return
  }

  try {
    const data =
      req.body as UpdateOperationInput

    console.log(
      `PUT /api/operations/${id} body:`,
    )

    console.log(
      JSON.stringify(
        data,
        null,
        2,
      ),
    )

    const operation =
      await updateOperation(id, data)

    res.json({
      success: true,
      message:
        'Operasyon başarıyla güncellendi.',
      data: operation,
    })
  } catch (error) {
    console.error('=================================')
    console.error(
      'OPERASYON GÜNCELLEME HATASI',
    )
    console.error('=================================')
    console.error(error)

    res.status(500).json({
      success: false,
      message:
        'Operasyon güncellenemedi.',
    })
  }
})

// =========================================================
// OPERASYON SİL
// =========================================================

router.delete('/:id', async (req, res) => {
  const id = req.params.id

  if (typeof id !== 'string') {
    res.status(400).json({
      success: false,
      message:
        'Geçerli bir operasyon ID gönderilmelidir.',
    })

    return
  }

  try {
    await deleteOperation(id)

    res.json({
      success: true,
      message:
        'Operasyon başarıyla silindi.',
    })
  } catch (error) {
    console.error('=================================')
    console.error(
      'OPERASYON SİLME HATASI',
    )
    console.error('=================================')
    console.error(error)

    res.status(500).json({
      success: false,
      message:
        'Operasyon silinemedi.',
    })
  }
})

export default router