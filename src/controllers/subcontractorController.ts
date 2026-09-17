import type { Request, Response } from 'express'

import {
  getSubcontractorById,
  getSubcontractors,
} from '../repositories/subcontractorRepository.js'

export async function getSubcontractorsController(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const subcontractors = await getSubcontractors()

    res.json({
      success: true,
      data: subcontractors,
    })
  } catch (error) {
    console.error('=================================')
    console.error('TAŞERONLAR GETİRİLİRKEN HATA')
    console.error('=================================')
    console.error(error)

    res.status(500).json({
      success: false,
      message: 'Taşeronlar getirilemedi.',
    })
  }
}

export async function getSubcontractorByIdController(
  req: Request,
  res: Response,
): Promise<void> {
  const { id } = req.params

  if (typeof id !== 'string') {
    res.status(400).json({
      success: false,
      message: 'Geçerli bir taşeron ID gönderilmelidir.',
    })
    return
  }

  try {
    const subcontractor =
      await getSubcontractorById(id)

    if (!subcontractor) {
      res.status(404).json({
        success: false,
        message: 'Taşeron bulunamadı.',
      })
      return
    }

    res.json({
      success: true,
      data: subcontractor,
    })
  } catch (error) {
    console.error('=================================')
    console.error('TAŞERON GETİRİLİRKEN HATA')
    console.error('=================================')
    console.error(error)

    res.status(500).json({
      success: false,
      message: 'Taşeron getirilemedi.',
    })
  }
}