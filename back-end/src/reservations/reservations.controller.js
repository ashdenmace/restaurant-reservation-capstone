/**
 * List handler for reservation resources
 */

const service = require("./reservations.service");

const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const validProperties = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status"
]

function bodyDataHas(property) {
  return function (req, res, next) {
    const {data = {}} = req.body;
    if (data[property]) {
      return next();
    }
    next({status: 400, message: `Must contain a ${property}`})
  }
}

function hasValidProperties(req, res, next) {
  const data = req.body.data

  const invalidProperties = Object.keys(data).filter((key) => !validProperties.includes(key))

  if (invalidProperties.length){
    next({status: 400, message: `Must contain valid properties`})
  }
  next()
}

async function list(req, res) {
  if (req.query.date) {
    const data = await service.listByDate(req.query.date)
    res.json({data})

  } else if (req.query.mobile_number){
    const mobile_number = req.query.mobile_number
    console.log(mobile_number)
    const data = await service.search(mobile_number);
    res.json({data})
  }
}

async function doesReservationExist(req, res, next) {
  const reservationId = req.params.reservation_id;
  try {
    const data = await service.read(reservationId);
    if (data) {
      res.locals.reservation = data;
      return next();
    }
    return next({ status: 404, message: `reservation id ${reservationId} does not exist` });
  } catch (error) {
    return next(error);
  }
}

// read Route Handler
async function read(req, res, next) {
  const data = res.locals.reservation;
  res.json({ data });
}

async function create(req, res, next) {
  const newReservation = await service.create(req.body.data);
  res.status(201).json({ data: newReservation})
}

function validateReservationDate(req, res, next) {
  const reservationDate = Date.parse(req.body.data.reservation_date)
  if (!reservationDate) {
    next({status: 400, message: `Must have a reservation_date property`})
  } 
  next();

}

function validateReservationTime(req, res, next) {
  const reservationTime = req.body.data.reservation_time
  
  if (!reservationTime) {
    next({status: 400, message: `Must have a reservation_time property`})
  }

  const regex = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/
  const isValid = regex.test(reservationTime)

  if (!isValid) {
    next({status: 400, message: `Must have a valid reservation_time`})
  }
  next();
}

function validatePeople(req, res, next) {
  const people = req.body.data.people

  if (!people) {
    next({status: 400, message: `Must have a people property`})
  }

  const isValid = Number.isInteger(people)

  if (!isValid || people === 0) {
    next({status: 400, message: `The people property must be a whole number and above 0!`})
  }

  next();
}

function notTuesday(req, res, next) {
  const date = req.body.data.reservation_date;
  const day = new Date(date).getUTCDay();
 
  if (day === 2) {
    return next({ status: 400, message: "We are closed on Tuesdays" });
  }

  
  next();
  
}

function notInThePast(req, res, next) {
  const data = req.body.data
  const reservationDateTime = new Date(`${data.reservation_date}T${data.reservation_time}`);
  const currentDateTime = new Date();

  if (reservationDateTime < currentDateTime) {
    next({status: 400, message: `Reservation must be in the future`})
  }
  next()
}

function validTime(req, res, next) {
  const reservationTime = req.body.data.reservation_time
  const hours = Number(reservationTime.split(":")[0]);
  const minutes = Number(reservationTime.split(":")[1]);
  
  if (hours < 10 || (hours === 10 && minutes <= 30)) {
    next({status: 400, message: `Reservation must be made after 10:30AM`})
  }
  
  if (hours > 21 || (hours === 21 && minutes >= 30)) {
    next({status: 400, message: `Reservation must be made before 9:30PM`})
  }

  next();
}

function statusIsBooked(req, res, next) {
  const reservation = req.body.data
  console.log(reservation)
  if ((reservation.status) && reservation.status !== "booked") {
    return next({status: 400, message: "status cannot be finished or seated"})
  }
  next();
}


function validateStatus(req, res, next) {
  const validStatuses = ["booked", "seated", "finished", "cancelled"]
  const {status} = req.body.data;

  if (validStatuses.includes(status)) {
    return next();
  }

  next({status: 400, message: `${status} is not valid`})
   
}

function notFinishedStatus(req, res, next) {
  const {status} = res.locals.reservation;

  if (status === "finished") {
    return next({status: 400, message: "reservation cannot be finished"});
  }
  next();
}

async function updateStatus(req, res, next) {
  const {status} = req.body.data;
  const {reservation_id} = res.locals.reservation;
  const data = await service.updateStatus(status, reservation_id);
  res.json({data})
}

async function update(req, res, next) {
  const {reservation_id} = res.locals.reservation;
  const updatedReservation = {...req.body.data, reservation_id}
  console.log(updatedReservation)
  
  const data = await service.update(updatedReservation)
  res.status(200).json({data})
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(doesReservationExist), read],
  create: [
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    validateReservationDate,
    validateReservationTime,
    notTuesday,
    validTime,
    notInThePast,
    validatePeople,
    hasValidProperties,
    statusIsBooked,
    asyncErrorBoundary(create),
  ],

  updateStatus: [asyncErrorBoundary(doesReservationExist), notFinishedStatus, validateStatus, asyncErrorBoundary(updateStatus)],
  update: [asyncErrorBoundary(doesReservationExist), bodyDataHas("first_name"),
  bodyDataHas("last_name"),
  bodyDataHas("mobile_number"),
  notTuesday,
  validateReservationDate,
  validateReservationTime,
  validTime,
  notInThePast,
  validatePeople,
  asyncErrorBoundary(update)]
};
