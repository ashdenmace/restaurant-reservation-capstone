import React from "react"
import {Link} from "react-router-dom"

function ReservationCard ({reservation}) {
    return (
        <>
            <div className="row">
                <div className="col">
                    <div className="card my-2">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h3 className="">{reservation.first_name} {reservation.last_name}</h3>
                            <span className="badge badge-secondary" data-reservation-id-status={reservation.reservation_id} >{reservation.status}</span>
                         </div>
                            <ul className="list-group">
                                <li className="list-group-item"> When: {reservation.reservation_time}</li>
                                <li className="list-group-item"> Mobile Number: {reservation.mobile_number} </li>
                                <li className="list-group-item">Party Size: {reservation.people}</li>
                                <li className="list-group-item">Reservation ID: {reservation.reservation_id}</li>
                                <div className="list-group-item d-flex justify-content-between align-items-center">
                                    <a href={`/reservations/${reservation.reservation_id}/edit`} className="btn btn-secondary">Edit</a>
                                        {reservation.status === "seated" ? null :
                                    <a className="btn btn-primary" href={`/reservations/${reservation.reservation_id}/seat`}>Seat</a>}
                                    
                                </div>
                            </ul>
                    </div>
                </div>
                
            </div>
           
        </>
    )
}

export default ReservationCard;