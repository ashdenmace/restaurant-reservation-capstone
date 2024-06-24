import React from "react"

function ReservationCard ({reservation}) {
    return (
        <>
            <div className="row">
                <div className="col">
                    <div className="card my-2">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h3 className="">{reservation.first_name} {reservation.last_name}</h3>
                            <a className="btn btn-primary" href={`/reservations/${reservation.reservation_id}/seat`}>Seat</a>
                         </div>
                            <ul className="list-group">
                                <li className="list-group-item"> When: {reservation.reservation_time}</li>
                                <li className="list-group-item"> Mobile Number: {reservation.mobile_number} </li>
                                <li className="list-group-item">Party Size: {reservation.people}</li>
                                <li className="list-group-item">Reservation ID: {reservation.reservation_id}</li>
                            </ul>
                    </div>
                </div>
                
            </div>
           
        </>
    )
}

export default ReservationCard;