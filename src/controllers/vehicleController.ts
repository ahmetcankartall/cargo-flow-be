import type { Request, Response } from 'express'

import {
  createVehicle,
  deleteVehicle,
  getVehicleById,
  getVehicles,
  updateVehicle,
} from '../repositories/vehicleRepository.js'

import {
  createVehicleSchema,
  updateVehicleSchema,
} from '../schemas/vehicleSchema.js'

function getVehicleId(
  req: Request,
): string | null {
  const id = req.params.id

  if (typeof id !== 'string') {
    return null
  }

  return id
}

export async function getVehiclesController(
  _req: Request,
  res: Response,
) {
  try {
    const vehicles = await getVehicles()

    res.json({
      success: true,
      data: vehicles,
    })
  } catch (error) {
    console.error('Araçlar alınamadı:', error)

    res.status(500).json({
      success: false,
      message: 'Araçlar alınamadı.',
    })
  }
}

export async function getVehicleByIdController(
  req: Request,
  res: Response,
) {
  const id = getVehicleId(req)

  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Geçersiz araç ID.',
    })

    return
  }

  try {
    const vehicle = await getVehicleById(id)

    if (!vehicle) {
      res.status(404).json({
        success: false,
        message: 'Araç bulunamadı.',
      })

      return
    }

    res.json({
      success: true,
      data: vehicle,
    })
  } catch (error) {
    console.error('Araç alınamadı:', error)

    res.status(500).json({
      success: false,
      message: 'Araç alınamadı.',
    })
  }
}

export async function createVehicleController(
  req: Request,
  res: Response,
) {
  const validation =
    createVehicleSchema.safeParse(req.body)

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: 'Geçersiz araç verisi.',
      errors: validation.error.flatten(),
    })

    return
  }

  try {
    const vehicle = await createVehicle(
      validation.data,
    )

    res.status(201).json({
      success: true,
      message: 'Araç başarıyla oluşturuldu.',
      data: vehicle,
    })
  } catch (error) {
    console.error('Araç oluşturulamadı:', error)

    res.status(500).json({
      success: false,
      message: 'Araç oluşturulamadı.',
    })
  }
}

export async function updateVehicleController(
  req: Request,
  res: Response,
) {
  const id = getVehicleId(req)

  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Geçersiz araç ID.',
    })

    return
  }

  const validation =
    updateVehicleSchema.safeParse(req.body)

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: 'Geçersiz araç verisi.',
      errors: validation.error.flatten(),
    })

    return
  }

  try {
    const vehicle = await updateVehicle(
      id,
      validation.data,
    )

    if (!vehicle) {
      res.status(404).json({
        success: false,
        message: 'Araç bulunamadı.',
      })

      return
    }

    res.json({
      success: true,
      message: 'Araç başarıyla güncellendi.',
      data: vehicle,
    })
  } catch (error) {
    console.error('Araç güncellenemedi:', error)

    res.status(500).json({
      success: false,
      message: 'Araç güncellenemedi.',
    })
  }
}

export async function deleteVehicleController(
  req: Request,
  res: Response,
) {
  const id = getVehicleId(req)

  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Geçersiz araç ID.',
    })

    return
  }

  try {
    const deleted = await deleteVehicle(id)

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Araç bulunamadı.',
      })

      return
    }

    res.json({
      success: true,
      message: 'Araç başarıyla silindi.',
    })
  } catch (error) {
    console.error('Araç silinemedi:', error)

    res.status(500).json({
      success: false,
      message: 'Araç silinemedi.',
    })
  }
}