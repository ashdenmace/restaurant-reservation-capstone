import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import useQuery from "../utils/useQuery";
import ReservationCard from "../reservations/ReservationCard";
import { today, previous, next } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory();
  const query = useQuery();
  const queryDate = query.get("date") || date;

  useEffect(() => {
    loadDashboard(queryDate);
  }, [queryDate]);

  function loadDashboard(date) {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function previousHandler(event) {
    event.preventDefault();
    history.push(`/dashboard?date=${previous(queryDate)}`);
  }

  function todayHandler(event) {
    event.preventDefault();
    history.push(`/dashboard?date=${today()}`);
  }

  function nextHandler(event) {
    event.preventDefault();
    history.push(`/dashboard?date=${next(queryDate)}`);
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {queryDate}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <div>
        <button onClick={previousHandler}>Previous</button>
        <button onClick={todayHandler}>Today</button>
        <button onClick={nextHandler}>Next</button>
      </div>
      {reservations.length ? (
        reservations.map((reservation) => (
          <ReservationCard key={reservation.reservation_id} reservation={reservation} />
        ))
      ) : (
        <h1>No reservations for {queryDate}</h1>
      )}
    </main>
  );
}

export default Dashboard;
