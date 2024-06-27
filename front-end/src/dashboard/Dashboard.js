import React, { useEffect, useState } from "react";
import { listReservations, listTables, finishTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import useQuery from "../utils/useQuery";
import { today, previous, next } from "../utils/date-time";
import TableCard from "../tables/TablesCard";
import ReservationsList from "../reservations/ReservationList"
import "./Dashboard.css"


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
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }
  
  function refreshReservations() {
    loadDashboard(queryDate); // Reload the reservations list
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

  async function finishHandler(table_id) {
    const abortController = new AbortController();
    const result = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );

    if (result) {
      await finishTable(table_id, abortController.signal);
      loadDashboard(queryDate);
    }

    return () => abortController.abort();
  }

  function formatDateString(date) {
    // Split the input date into year, month, and day
    const split = date.split("-");
    const year = split[0];
    const month = split[1];
    const day = split[2];
    
    // Return the date in MM-DD-YYYY format
    return `${month}-${day}-${year}`;
}

  const newFormat = formatDateString(queryDate)

  return (
    <main>
      <div className="dashboard-header my-4 d-flex flex-column flex-md-row justify-content-between align-items-center">
        <h1>Dashboard</h1>
        <div className="btn-group mx-4 mt-3 mt-md-0">
          <button className="btn mb-3 mb-md-0 mr-md-2" onClick={previousHandler}>Previous</button>
          <button className="btn mb-3 mb-md-0 mr-md-2" onClick={todayHandler}>Today</button>
          <button className="btn mb-3 mb-md-0" onClick={nextHandler}>Next</button>
        </div>
      </div>
     

      <div className="row">
        <div className="col reservations-col">
          <div className="d-md-flex mb-3">
            <h3 className="mb-0">Reservations for {newFormat}</h3>
          </div>
          <ErrorAlert error={reservationsError} />
          {reservations.length ? 
            <ReservationsList reservations={reservations} refreshReservations={refreshReservations} />
          : (
            <h1>No reservations for {newFormat}</h1>
            )}
          
        </div>
        <div className="col tables-col">
          <h3>Tables</h3>
          <ErrorAlert error={tablesError} />
         
            {
              tables.length ? (tables.map((table) => (
                <TableCard key={table.table_id} table={table}  finishHandler={() => finishHandler(table.table_id)}/>  
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
