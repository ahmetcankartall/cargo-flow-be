import type { Request, Response } from 'express'

import {
  createCustomer,
  deleteCustomer,
  getCustomerById,
  getCustomers,
  updateCustomer,
} from '../repositories/customerRepository.js'

import {
  createCustomerSchema,
  updateCustomerSchema,
} from '../schemas/customerSchema.js'

function getCustomerId(req: Request): string | null {
  const id = req.params.id

  if (typeof id !== 'string') {
    return null
  }

  return id
}

export async function getCustomersController(
  _req: Request,
  res: Response,
) {
  try {
    const customers = await getCustomers()

    res.json({
      success: true,
      data: customers,
    })
  } catch (error) {
    console.error('Müşteriler alınamadı:', error)

    res.status(500).json({
      success: false,
      message: 'Müşteriler alınamadı.',
    })
  }
}

export async function getCustomerByIdController(
  req: Request,
  res: Response,
) {
  const id = getCustomerId(req)

  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Geçersiz müşteri ID.',
    })

    return
  }

  try {
    const customer = await getCustomerById(id)

    if (!customer) {
      res.status(404).json({
        success: false,
        message: 'Müşteri bulunamadı.',
      })

      return
    }

    res.json({
      success: true,
      data: customer,
    })
  } catch (error) {
    console.error('Müşteri alınamadı:', error)

    res.status(500).json({
      success: false,
      message: 'Müşteri alınamadı.',
    })
  }
}

export async function createCustomerController(
  req: Request,
  res: Response,
) {
  const validation = createCustomerSchema.safeParse(
    req.body,
  )

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: 'Geçersiz müşteri verisi.',
      errors: validation.error.flatten(),
    })

    return
  }

  try {
    const customer = await createCustomer(
      validation.data,
    )

    res.status(201).json({
      success: true,
      message: 'Müşteri başarıyla oluşturuldu.',
      data: customer,
    })
  } catch (error) {
    console.error(
      'Müşteri oluşturulamadı:',
      error,
    )

    res.status(500).json({
      success: false,
      message: 'Müşteri oluşturulamadı.',
    })
  }
}

export async function updateCustomerController(
  req: Request,
  res: Response,
) {
  const id = getCustomerId(req)

  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Geçersiz müşteri ID.',
    })

    return
  }

  const validation = updateCustomerSchema.safeParse(
    req.body,
  )

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: 'Geçersiz müşteri verisi.',
      errors: validation.error.flatten(),
    })

    return
  }

  try {
    const customer = await updateCustomer(
      id,
      validation.data,
    )

    if (!customer) {
      res.status(404).json({
        success: false,
        message: 'Müşteri bulunamadı.',
      })

      return
    }

    res.json({
      success: true,
      message: 'Müşteri başarıyla güncellendi.',
      data: customer,
    })
  } catch (error) {
    console.error(
      'Müşteri güncellenemedi:',
      error,
    )

    res.status(500).json({
      success: false,
      message: 'Müşteri güncellenemedi.',
    })
  }
}

export async function deleteCustomerController(
  req: Request,
  res: Response,
) {
  const id = getCustomerId(req)

  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Geçersiz müşteri ID.',
    })

    return
  }

  try {
    const deleted = await deleteCustomer(id)

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Müşteri bulunamadı.',
      })

      return
    }

    res.json({
      success: true,
      message: 'Müşteri başarıyla silindi.',
    })
  } catch (error) {
    console.error(
      'Müşteri silinemedi:',
      error,
    )

    res.status(500).json({
      success: false,
      message: 'Müşteri silinemedi.',
    })
  }
}