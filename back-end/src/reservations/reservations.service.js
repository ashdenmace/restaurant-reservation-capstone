const knex = require("../db/connection");

function list() {
    return knex("reservations").select("*");
}

function listByDate(date) {
    return knex("reservations").select("*").where({"reservation_date": date}).whereNotIn("status", ["finished", "cancelled"]).orderBy("reservation_time")
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

function update(updatedReservation) {
    return knex("reservations").select("*").where({"reservation_id": updatedReservation.reservation_id}).returning("*").update(updatedReservation, "*").then(updatedRecords => updatedRecords[0])
}

function search(mobile_number) {
    console.log(typeof mobile_number)
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
  }
  

module.exports = {
    list, 
    listByDate,
    create,
    read,
    updateStatus,
    search,
    update,
}