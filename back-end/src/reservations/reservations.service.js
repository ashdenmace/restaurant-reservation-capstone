const knex = require("../db/connection");

function list() {
    return knex("reservations").select("*");
}

function listByDate(date) {
    return knex("reservations").select("*").where({"reservation_date": date}).andWhereNot({"status": "finished"}).orderBy("reservation_time")
}

function create(reservation) {
    return knex("reservations").insert(reservation).returning("*").then(createdReservation => createdReservation[0]);
}

function read(reservationId) {
    return knex("reservations").select("*").where({"reservation_id": reservationId}).first();
}

function updateStatus(status, reservation_id) {
    return knex("reservations").select("*").where({"reservation_id": reservation_id}).returning("*").update({status: status}, "*").then(updatedRecords => updatedRecords[0])
}

module.exports = {
    list, 
    listByDate,
    create,
    read,
    updateStatus,
}