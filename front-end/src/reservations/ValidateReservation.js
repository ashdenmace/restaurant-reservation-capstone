function validateReservation(reservation) {
    const errors = [];

    const day = new Date(reservation.reservation_date).getUTCDay();
    const today = new Date().toISOString().split("T")[0]
    
    if (!reservation.first_name) errors.push("First name is required.");
    if (!reservation.last_name) errors.push("Last name is required.");
    if (!reservation.mobile_number) errors.push("Mobile number is required.");
    if (!reservation.reservation_date) errors.push("Reservation date is required.");
    if (!reservation.reservation_time) errors.push("Reservation time is required.");
    if (reservation.people < 1) errors.push("Number of people must be at least 1.");
    //closed on tuesdays, push message
    if (day === 2) errors.push("The restaurant is closed on tuesdays.");
    //if date is in the past, push message
    if(reservation.reservation_date < today) errors.push("Reservation must be made in the future")

    return errors;
  }

  export default validateReservation