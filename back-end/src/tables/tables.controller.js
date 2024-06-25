const service = require("./tables.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


function bodyDataHas(property) {
    return function (req, res, next) {
      const {data = {}} = req.body;
      if (!data[property]) {
        return next({status: 400, message: `Must contain a ${property}`})
      }
      
      next();
    }
  }



function validateCapacity(req, res, next) {
    const capacity = req.body.data.capacity;

    if (!Number.isInteger(capacity)) {
        return next({status: 400, message: "capacity must be a number"})
    } 

    if (capacity === 0) {
        return next({status: 400, message: "capacity must be greater than zero"})
    }
    next()
}

function validateTableName(req, res, next) {
    const name = req.body.data.table_name;

    if (name.length < 2) {
        return next({status: 400, message: "table_name must be longer than one character"})
    }
    next()
}



function sufficientCapacity(req, res, next) {
    const reservation = res.locals.reservation;
    const table = res.locals.table;

    if (reservation.people > table.capacity) {
        return next({status: 400, message: "table capacity is less than party size"})
    }
    next();
}

function isTableOccupied(req, res, next) {
    const table = res.locals.table;
    if (table.reservation_id === null) {
        return next()
    }
    next({status: 400, message: `table ${table.table_name} is occupied`});
}

async function tableExists(req, res, next) {
    const tableId = req.params.table_id
    const table = await service.read(tableId);

    if (table) {
        res.locals.table = table
        return next();
    }
    next({status: 404, message: "table does not exist 99"})
}

async function reservationExists(req, res, next) {
    const {reservation_id} = req.body.data
    const reservation = await service.readReservation(reservation_id);

    if (reservation) {
        res.locals.reservation = reservation
        return next();
    }
    next({status: 404, message: "999"})
}




async function list(req, res, next) {
    const data = await service.list();
    if(data){
        res.json({data})
    } else {
        next({status: 400, message: "Could not get tables"})
    }

    
}

async function create(req, res, next) {
    const data = await service.create(req.body.data);
    res.status(201).json({ data })
}

function isNotSeated(req, res, next) {
    const {status} = res.locals.reservation
    if (status === "seated") {
        return next({status: 400, message: `table is already seated`})
    }
    next();
}

async function update(req, res, next) {
    const updatedTable = {
        ...req.body.data,
        table_id: res.locals.table.table_id
    }
    const updatedReservation = {
        ...res.locals.reservation,
        status: "seated",
    }
    const data = await service.update(updatedTable, updatedReservation);
    res.status(200).json({data})
}

function mustBeOccupied (req, res, next) {
    const table = res.locals.table;
    if (table.reservation_id){
        return next()
    }
    next({status: 400, message: "table is not occupied"})
}

async function finish(req, res, next) {
   const table = res.locals.table
   await service.finishReservation(req.params.table_id, table.reservation_id);
   res.sendStatus(200);
   
}

module.exports = {
    list,
    create: [bodyDataHas("table_name"), bodyDataHas("capacity"), validateCapacity, validateTableName, asyncErrorBoundary(create)],
    update: [bodyDataHas("reservation_id"), asyncErrorBoundary(reservationExists), asyncErrorBoundary(tableExists), isNotSeated, isTableOccupied, sufficientCapacity, update ],
    finish: [asyncErrorBoundary(tableExists), mustBeOccupied, asyncErrorBoundary(finish) ]
}