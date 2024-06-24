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

async function update(updatedTable, updatedReservation) {
    const trx = await knex.transaction()
    return trx("tables")
        .select("*")
        .where({table_id: updatedTable.table_id})
        .update(updatedTable, "*")
        .then((updatedRecords) => updatedRecords[0])
        .then(() => {
            return trx("reservations")
                .select("*")
                .where({reservation_id: updatedTable.reservation_id})
                .update(updatedReservation, "*" )
                .then(updatedRecords => updatedRecords[0])
        })
        .then(trx.commit)
        .catch(trx.rollback);
}



async function finishReservation(table_id, reservation_id) {
    const trx = await knex.transaction()
    return trx("tables")
        .where({table_id: table_id})
        .update("reservation_id", null)
        .then(() => {
            return trx("reservations")
                .where({reservation_id: reservation_id})
                .update({status: "finished"})
                .then(updatedRecords => updatedRecords[0])
        })
        .then(trx.commit)
        .catch(trx.rollback)
    // return knex("tables").where({table_id: table_id}).update("reservation_id", null)

}

function updateStatus(status, reservation_id) {

}



module.exports = {
    list,
    create,
    read,
    readReservation,
    update,
    finishReservation,
}