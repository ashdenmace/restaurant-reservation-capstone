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
  } else {
    const data = await service.list();
    res.json({data})
  }
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



module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    notTuesday,
    validTime,
    notInThePast,
    validateReservationDate,
    validateReservationTime,
    validatePeople,
    hasValidProperties,
    asyncErrorBoundary(create),
  ],
};
