function validateReservation(reservation) {
    const errors = [];

    const day = new Date(reservation.reservation_date).getUTCDay();
    const resDate = new Date(`${reservation.reservation_date}T${reservation.reservation_time}`)
    const today = new Date()
    const phoneRegex = /^[\d-]+$/;

    if (!reservation.first_name) errors.push("First name is required.");
    if (!reservation.last_name) errors.push("Last name is required.");
    if (!reservation.mobile_number) {
      errors.push("Mobile number is required.");
    } else if (!phoneRegex.test(reservation.mobile_number)) {
      errors.push("Mobile number must only include dashes and digits")
    }
    if (!reservation.reservation_date) {
      errors.push("Reservation date is required.");
      
    } else if (resDate < today) {
      errors.push("Reservation must be made in the future")
    }
  
    if (reservation.people < 1) errors.push("Number of people must be at least 1.");
    //closed on tuesdays, push message
    if (day === 2) errors.push("The restaurant is closed on tuesdays.");
    
    if (!reservation.reservation_time) {
      errors.push("Reservation time is required.") 
    } else {
        const time = reservation.reservation_time;

        const hours = Number(time.split(":")[0]);
        const minutes = Number(time.split(":")[1]);
    
        if (hours < 10 || (hours === 10 && minutes <= 30)) {
          errors.push("Reservation must be after 10:30AM")
        }
    
        if (hours > 21 || (hours === 21 && minutes >= 30)) {
          errors.push("Reservation must be before 9:30PM")
        }
      }
    
    return errors;
  }

  export default validateReservation