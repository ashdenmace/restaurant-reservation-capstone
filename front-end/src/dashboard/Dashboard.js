import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import useQuery from "../utils/useQuery";
import ReservationCard from "../reservations/ReservationCard";
import { today, previous, next } from "../utils/date-time";
import TableCard from "../tables/TablesCard";


/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
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
    listTables({ date }, abortController.signal)
      .then(setTables)
      .catch(setTablesError);
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
      
      <div>
        <button onClick={previousHandler}>Previous</button>
        <button onClick={todayHandler}>Today</button>
        <button onClick={nextHandler}>Next</button>
      </div>

      <div className="row">
        <div className="col">
          <h3>Reservations</h3>
          <ErrorAlert error={reservationsError} />
            {reservations.length ? (
          reservations.map((reservation) => (
            <ReservationCard key={reservation.reservation_id} reservation={reservation} />
          ))
        ) : (
          <h1>No reservations for {queryDate}</h1>
        )}
        </div>
        <div className="col">
          <h3>Tables</h3>
          <ErrorAlert error={tablesError} />
      
            {
              tables.length ? (tables.map((table) => (
                <TableCard key={table.table_id} table={table} />  
              ))) : (
                <h1>No Tables for {queryDate}</h1>
              )
            }
        </div>

      </div>
     
    </main>
  );
}

export default Dashboard;
