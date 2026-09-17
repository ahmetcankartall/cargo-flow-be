import { Router } from 'express'

import {
  getSubcontractorByIdController,
  getSubcontractorsController,
} from '../controllers/subcontractorController.js'

const router = Router()

router.get('/', getSubcontractorsController)

router.get('/:id', getSubcontractorByIdController)

export default router