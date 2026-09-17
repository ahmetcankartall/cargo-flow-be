import type { Request, Response } from 'express'

import {
  createDriver,
  deleteDriver,
  getDriverById,
  getDrivers,
  updateDriver,
} from '../repositories/driverRepository.js'

import {
  createDriverSchema,
  updateDriverSchema,
} from '../schemas/driverSchema.js'

function getDriverId(
  req: Request,
): string | null {
  const id = req.params.id

  if (typeof id !== 'string') {
    return null
  }

  return id
}

export async function listDrivers(
  _req: Request,
  res: Response,
) {
  try {
    const drivers = await getDrivers()

    res.json({
      success: true,
      data: drivers,
    })
  } catch (error) {
    console.error(
      'Sürücüler alınamadı:',
      error,
    )

    res.status(500).json({
      success: false,
      message: 'Sürücüler alınamadı.',
    })
  }
}

export async function showDriver(
  req: Request,
  res: Response,
) {
  const id = getDriverId(req)

  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Geçerli bir sürücü ID gönderilmelidir.',
    })

    return
  }

  try {
    const driver = await getDriverById(id)

    if (!driver) {
      res.status(404).json({
        success: false,
        message: 'Sürücü bulunamadı.',
      })

      return
    }

    res.json({
      success: true,
      data: driver,
    })
  } catch (error) {
    console.error(
      'Sürücü alınamadı:',
      error,
    )

    res.status(500).json({
      success: false,
      message: 'Sürücü alınamadı.',
    })
  }
}

export async function storeDriver(
  req: Request,
  res: Response,
) {
  try {
    const parsed =
      createDriverSchema.safeParse(req.body)

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Geçersiz sürücü verisi.',
        errors: parsed.error.flatten(),
      })

      return
    }

    const driver = await createDriver(
      parsed.data,
    )

    res.status(201).json({
      success: true,
      message: 'Sürücü başarıyla oluşturuldu.',
      data: driver,
    })
  } catch (error) {
    console.error(
      'Sürücü oluşturulamadı:',
      error,
    )

    res.status(500).json({
      success: false,
      message: 'Sürücü oluşturulamadı.',
    })
  }
}

export async function editDriver(
  req: Request,
  res: Response,
) {
  const id = getDriverId(req)

  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Geçerli bir sürücü ID gönderilmelidir.',
    })

    return
  }

  try {
    const parsed =
      updateDriverSchema.safeParse(req.body)

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Geçersiz sürücü verisi.',
        errors: parsed.error.flatten(),
      })

      return
    }

    const driver = await updateDriver(
      id,
      parsed.data,
    )

    if (!driver) {
      res.status(404).json({
        success: false,
        message: 'Sürücü bulunamadı.',
      })

      return
    }

    res.json({
      success: true,
      message: 'Sürücü başarıyla güncellendi.',
      data: driver,
    })
  } catch (error) {
    console.error(
      'Sürücü güncellenemedi:',
      error,
    )

    res.status(500).json({
      success: false,
      message: 'Sürücü güncellenemedi.',
    })
  }
}

export async function removeDriver(
  req: Request,
  res: Response,
) {
  const id = getDriverId(req)

  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Geçerli bir sürücü ID gönderilmelidir.',
    })

    return
  }

  try {
    const deleted = await deleteDriver(id)

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Sürücü bulunamadı.',
      })

      return
    }

    res.json({
      success: true,
      message: 'Sürücü başarıyla silindi.',
    })
  } catch (error) {
    console.error(
      'Sürücü silinemedi:',
      error,
    )

    res.status(500).json({
      success: false,
      message: 'Sürücü silinemedi.',
    })
  }
}