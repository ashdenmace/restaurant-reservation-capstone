import React from "react"

function ReservationCard ({reservation}) {
    return (
        <>
            <div className="card m-3">
                <h3 className="card-header">{reservation.first_name} {reservation.last_name}</h3>
                    <ul className="list-group">
                        <li className="list-group-item"> When: {reservation.reservation_time}</li>
                        <li className="list-group-item"> Mobile Number: {reservation.mobile_number} </li>
                        <li className="list-group-item">Party Size: {reservation.people}</li>
                        <li className="list-group-item">Reservation ID: {reservation.reservation_id}</li>
                    </ul>
                    
            </div>
        </>
    )
}

export default ReservationCard;