import React from "react"
import {Link} from "react-router-dom"
import { updateReservationStatus } from "../utils/api";
import { formatAsTime } from "../utils/date-time";

function ReservationCard ({reservation, refreshReservations}) {
    function cancelResHandler (event) {
        event.preventDefault();
        const confirm = window.confirm("Do you want to cancel this reservation? This cannot be undone.")

        if(confirm){
            updateReservationStatus(reservation.reservation_id, "cancelled")
            .then(() => refreshReservations())
        }

    }
    const cleanTime = formatAsTime(reservation.reservation_time)
    
    function convertTo12HourFormat(cleanTime) {
        let [hours, minutes] = cleanTime.split(':').map(Number);
      
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert hour to 12-hour format and handle 00:00 case
        return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      }
    const formattedTime = convertTo12HourFormat(cleanTime);
    

    function colorStatus() {
        if(reservation.status === "booked") {
            return "success"
        }
        if (reservation.status === "seated") {
            return "warning"
        }
        if (reservation.status === "finished") {
            return "secondary"
        }
        if (reservation.status === "cancelled") {
            return "danger"
        }
    }

    return (
        <>
            <div className="card my-2">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h3 style={{color: "white"}}>{reservation.first_name} {reservation.last_name}</h3>
                    <span className={`badge badge-${colorStatus()}`} data-reservation-id-status={reservation.reservation_id} >{reservation.status}</span>
                    </div>
                    <ul className="list-group">
                        <li className="list-group-item"> When: {formattedTime}</li>
                        <li className="list-group-item"> Mobile Number: {reservation.mobile_number} </li>
                        <li className="list-group-item">Party Size: {reservation.people}</li>
                        <li className="list-group-item">Reservation ID: {reservation.reservation_id}</li>
                        <div className="list-group-item d-flex justify-content-between align-items-center">
                            <button className="btn btn-danger mb-2" onClick={cancelResHandler} data-reservation-id-cancel={reservation.reservation_id}>Cancel</button>
                            <Link to={`/reservations/${reservation.reservation_id}/edit`} className="btn btn-secondary mb-2">Edit</Link>
                                {reservation.status === "seated" ? null :
                            <Link className="btn btn-warning mb-2" to={`/reservations/${reservation.reservation_id}/seat`}>Seat</Link>}
                        </div>
                    </ul>
            </div>
           
        </>
    )
}

export default ReservationCard;