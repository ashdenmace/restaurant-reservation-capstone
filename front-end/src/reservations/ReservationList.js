import ReservationCard from "../reservations/ReservationCard";


function ReservationList({reservations}) {
    return (
        <>  
            {reservations.length ? (
            reservations.map((reservation) => (
                <ReservationCard key={reservation.reservation_id} reservation={reservation} />
            ))
            ) : null}
        </>
    )
}

export default ReservationList;