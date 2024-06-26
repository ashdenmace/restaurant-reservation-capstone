import {useState} from "react"
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
                <h1 className="my-4 search search-title formH">Search by Mobile Number</h1>
                <ErrorAlert error={errors}/>
            </div>
            <div className="my-4">
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
                    <button type="submit" className="btn find-btn">Find</button>
                </form>
            </div>
        
            {clicked && (reservations.length ? <ReservationList reservations={reservations} /> : <h4 className="formH my-4">No reservations found</h4>)}
            
            

        </>
    )
}

export default Search;