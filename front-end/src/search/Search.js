import {useState, useEffect} from "react"
import ErrorAlert from "../layout/ErrorAlert"
import ReservationList from "../reservations/ReservationList"
import {listReservations} from "../utils/api"



function Search() {
    const [search, setSearch] = useState("");
    const [reservations, setReservations] = useState([])
    const [errors, setErrors] = useState(null);
    const [clicked, setClicked] = useState(false)

    function changeHandler(event) {
        setSearch(event.target.value)
    }
    
    async function submitHandler(event) {
        event.preventDefault();
        const abortController = new AbortController();
        try{
            let reservations = await listReservations({mobile_number: search}, abortController.signal)
            setReservations(reservations)
            setClicked(true);

        } catch (error) {
            setErrors(error)
        }
    }
    
    return (
        <>
            <div>
                <h2 className="search search-title">Search by Mobile Number</h2>
                <ErrorAlert error={errors}/>
            </div>
            <div>
                <form onSubmit={(submitHandler)}>
                    <div className="form-group">
                        <label className="form-label">Mobile Number</label>
                        <input 
                            name="mobile_number" 
                            className="form-control" 
                            onChange={changeHandler} 
                            value={search} 
                            placeholder="Enter a customer's phone number"
                        ></input>
                    </div>
                    <button type="submit" className="btn btn-secondary">Find</button>
                </form>
            </div>
        
            {clicked && (reservations.length ? <ReservationList reservations={reservations} /> : <h4>No reservations found</h4>)}
            
            

        </>
    )
}

export default Search;