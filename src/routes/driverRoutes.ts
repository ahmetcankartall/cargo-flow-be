import { Router } from 'express'

import {
  editDriver,
  listDrivers,
  removeDriver,
  showDriver,
  storeDriver,
} from '../controllers/driverController.js'

const router = Router()

router.get('/', listDrivers)

router.get('/:id', showDriver)

router.post('/', storeDriver)

router.put('/:id', editDriver)

router.delete('/:id', removeDriver)

export default router