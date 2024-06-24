const knex = require("../db/connection");

function list() {
    return knex("tables").select("*").orderBy("table_name");
}

function read(tableId) {
    return knex("tables").select("*").where({table_id: tableId}).first();
}

function create(table) {
    return knex("tables").insert(table).returning("*").then((createdRecords) => createdRecords[0]);
}

function readReservation(reservationId) {
    return knex("reservations").select("*").where({reservation_id: reservationId}).first();
}

function update(updatedTable) {
    return knex("tables").select("*").where({table_id: updatedTable.table_id}).update(updatedTable, "*").then((updatedRecords) => updatedRecords[0])
}

function finishReservation(table_id) {
    return knex("tables").where({table_id: table_id}).update("reservation_id", null)

}



module.exports = {
    list,
    create,
    read,
    readReservation,
    update,
    finishReservation,
}