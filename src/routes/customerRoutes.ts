import { Router } from 'express'

import {
  createCustomerController,
  deleteCustomerController,
  getCustomerByIdController,
  getCustomersController,
  updateCustomerController,
} from '../controllers/customerController.js'

const router = Router()

router.get('/', getCustomersController)

router.get('/:id', getCustomerByIdController)

router.post('/', createCustomerController)

router.put('/:id', updateCustomerController)

router.delete('/:id', deleteCustomerController)

export default router