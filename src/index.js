import express from 'express'
import flightsRoutes from './routes/flights.routes.js'

const app = express()

app.use(express.json())

app.use(flightsRoutes)


app.listen(3000)