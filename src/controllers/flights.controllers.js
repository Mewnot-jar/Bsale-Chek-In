import { pool } from '../db.js'

let passengersWithoutSeat
let groupedPassengers = {};
export const getFlights = async (req, res) => {
  try {
    const [results] = await pool.query(`
                      SELECT flight.*, passenger.*, boarding_pass.*
                      FROM flight
                      JOIN boarding_pass ON flight.flight_id = boarding_pass.flight_id
                      JOIN passenger ON boarding_pass.passenger_id = passenger.passenger_id
                      WHERE flight.flight_id = ?;
                    `, [req.params.id])
    if (results.length <= 0) return res.status(404).json({
      code: 404,
      data: {}
    })
    const flights = {
      flightId: results[0].flight_id,
      takeoffDateTime: results[0].takeoff_datetime,
      takeoffAirport: results[0].takeoff_airport,
      landingDateTime: results[0].landing_datetime,
      landingAirport: results[0].landing_airport,
      airplaneId: results[0].airplane_id,
      passengers: []
    };

    results.forEach((row) => {
      const passenger = {
        passengerId: row.passenger_id,
        dni: row.dni,
        name: row.name,
        age: row.age,
        country: row.country,
        boardingPassId: row.boarding_pass_id,
        purchaseId: row.purchase_id,
        seatTypeId: row.seat_type_id,
        seatId: row.seat_id
      };

      flights.passengers.push(passenger);

      passengersWithoutSeat = flights.passengers.filter(p => !p.seatId);

      passengersWithoutSeat.forEach(p => {
        const groupKey = `${p.purchaseId}-${p.seatType}`;
        if (!groupedPassengers[groupKey]) {
          groupedPassengers[groupKey] = [];
        }
        groupedPassengers[groupKey].push(p);
      });
      
    });
    const jsonSend = {
      code: 200,
      data: flights
    }
    res.send(jsonSend)

  } catch (error) {
    res.status(400).json({ code: 400, errors: "Could not connect to db" });
  }
}
