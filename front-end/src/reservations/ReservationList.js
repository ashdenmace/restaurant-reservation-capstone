import ReservationCard from "../reservations/ReservationCard";


function ReservationList({reservations, refreshReservations}) {
    return (
        <>  
            {reservations.length ? (
            reservations.map((reservation) => (
                <ReservationCard key={reservation.reservation_id} reservation={reservation} refreshReservations={refreshReservations} />
            ))
            ) : null}
        </>
    )
}

export default ReservationList;