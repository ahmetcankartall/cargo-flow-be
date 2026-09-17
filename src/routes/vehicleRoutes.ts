import { Router } from 'express'

import {
  createVehicleController,
  deleteVehicleController,
  getVehicleByIdController,
  getVehiclesController,
  updateVehicleController,
} from '../controllers/vehicleController.js'

const router = Router()

router.get('/', getVehiclesController)
router.get('/:id', getVehicleByIdController)

router.post('/', createVehicleController)
router.put('/:id', updateVehicleController)
router.delete('/:id', deleteVehicleController)

export default router