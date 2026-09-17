import type { Request, Response } from 'express'

import {
  createLocation,
  deleteLocation,
  getLocationById,
  getLocations,
  updateLocation,
} from '../repositories/locationRepository.js'

import {
  createLocationSchema,
  updateLocationSchema,
} from '../schemas/locationSchema.js'

function getLocationId(
  req: Request,
): string | null {
  const id = req.params.id

  if (typeof id !== 'string') {
    return null
  }

  return id
}

export async function listLocations(
  _req: Request,
  res: Response,
) {
  try {
    const locations = await getLocations()

    res.json({
      success: true,
      data: locations,
    })
  } catch (error) {
    console.error(
      'Lokasyonlar alınamadı:',
      error,
    )

    res.status(500).json({
      success: false,
      message: 'Lokasyonlar alınamadı.',
    })
  }
}

export async function showLocation(
  req: Request,
  res: Response,
) {
  const id = getLocationId(req)

  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Geçerli bir lokasyon ID gönderilmelidir.',
    })

    return
  }

  try {
    const location = await getLocationById(id)

    if (!location) {
      res.status(404).json({
        success: false,
        message: 'Lokasyon bulunamadı.',
      })

      return
    }

    res.json({
      success: true,
      data: location,
    })
  } catch (error) {
    console.error(
      'Lokasyon alınamadı:',
      error,
    )

    res.status(500).json({
      success: false,
      message: 'Lokasyon alınamadı.',
    })
  }
}

export async function storeLocation(
  req: Request,
  res: Response,
) {
  try {
    const parsed =
      createLocationSchema.safeParse(
        req.body,
      )

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Geçersiz lokasyon verisi.',
        errors: parsed.error.flatten(),
      })

      return
    }

    const location = await createLocation(
      parsed.data,
    )

    res.status(201).json({
      success: true,
      message: 'Lokasyon başarıyla oluşturuldu.',
      data: location,
    })
  } catch (error) {
    console.error(
      'Lokasyon oluşturulamadı:',
      error,
    )

    res.status(500).json({
      success: false,
      message: 'Lokasyon oluşturulamadı.',
    })
  }
}

export async function editLocation(
  req: Request,
  res: Response,
) {
  const id = getLocationId(req)

  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Geçerli bir lokasyon ID gönderilmelidir.',
    })

    return
  }

  try {
    const parsed =
      updateLocationSchema.safeParse(
        req.body,
      )

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Geçersiz lokasyon verisi.',
        errors: parsed.error.flatten(),
      })

      return
    }

    const location = await updateLocation(
      id,
      parsed.data,
    )

    if (!location) {
      res.status(404).json({
        success: false,
        message: 'Lokasyon bulunamadı.',
      })

      return
    }

    res.json({
      success: true,
      message: 'Lokasyon başarıyla güncellendi.',
      data: location,
    })
  } catch (error) {
    console.error(
      'Lokasyon güncellenemedi:',
      error,
    )

    res.status(500).json({
      success: false,
      message: 'Lokasyon güncellenemedi.',
    })
  }
}

export async function removeLocation(
  req: Request,
  res: Response,
) {
  const id = getLocationId(req)

  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Geçerli bir lokasyon ID gönderilmelidir.',
    })

    return
  }

  try {
    const deleted =
      await deleteLocation(id)

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Lokasyon bulunamadı.',
      })

      return
    }

    res.json({
      success: true,
      message: 'Lokasyon başarıyla silindi.',
    })
  } catch (error) {
    console.error(
      'Lokasyon silinemedi:',
      error,
    )

    res.status(500).json({
      success: false,
      message: 'Lokasyon silinemedi.',
    })
  }
}