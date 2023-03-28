import { Router } from 'express'
import { getFlights } from '../controllers/flights.controllers.js'

const router = Router()

router.get('/flights/:id/passengers', getFlights)


export default router