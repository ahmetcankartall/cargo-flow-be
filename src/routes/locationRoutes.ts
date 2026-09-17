import { Router } from 'express'

import {
  editLocation,
  listLocations,
  removeLocation,
  showLocation,
  storeLocation,
} from '../controllers/locationController.js'

const router = Router()

router.get('/', listLocations)

router.get('/:id', showLocation)

router.post('/', storeLocation)

router.put('/:id', editLocation)

router.delete('/:id', removeLocation)

export default router