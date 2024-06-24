import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { listTables, readReservation, updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function SeatReservation() {
    // call states for tables, and the reservation id
    const reservation_id = useParams().reservation_id;
    const history = useHistory();
    const [tables, setTables] = useState([]);
    const [selectedTableId, setSelectedTableId] = useState("");
    const [reservation, setReservation] = useState({});
    const [error, setError] = useState(null);

    console.log(reservation_id)
    
    useEffect(() => {
        listTables().then(setTables).catch(setError);
    }, []);

    useEffect(() => {
        async function loadReservation() {
            try {
                const response = await readReservation(reservation_id);
                setReservation(response);
            } catch (error) {
                setError(error);
            }
        }
        loadReservation();
    }, [reservation_id]);

    function changeHandler({ target }) {
        setSelectedTableId(target.value);
    }

    async function submitHandler(event) {
        event.preventDefault();
        setError(null);

        if (!selectedTableId) {
            setError({ message: "Please select a table." });
            return;
        }

        try {
            await updateTable(selectedTableId,  reservation_id );
            history.push(`/dashboard`);
        } catch (error) {
            setError(error);
        }
    }

    return (
        <>
            <h1>Seating for reservations</h1>
            <ErrorAlert error={error} />
            <form onSubmit={submitHandler}>
                <select name="table_id" onChange={changeHandler} value={selectedTableId}>
                    <option value="">- Please choose a table -</option>
                    {tables.map((table) => (
                        <option value={table.table_id} key={table.table_id}>
                            {table.table_name} - {table.capacity}
                        </option>
                    ))}
                </select>
                <div>
                    <button type="submit">Submit</button>
                    <button type="button" onClick={() => history.push(`/dashboard`)}>
                        Cancel
                    </button>
                </div>
            </form>
        </>
    );
}

export default SeatReservation;
