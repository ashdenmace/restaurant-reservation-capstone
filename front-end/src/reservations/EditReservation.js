import ReservationForm from "./ReservationForm"
import {useState, useEffect} from "react"
import {useParams, useHistory} from "react-router-dom"
import {readReservation, updateReservation} from "../utils/api"
import validateReservation from "./ValidateReservation"
import ErrorAlert from "../layout/ErrorAlert"


function EditReservation () {
    const [reservation, setReservation] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 0,

    })
    const [error, setError] = useState(null)
    const {reservation_id} = useParams();
    const history = useHistory();
    

    useEffect(() => {
        const abortController = new AbortController();
        readReservation(reservation_id, abortController.signal)
            .then(setReservation)
            .catch(setError)
        return () => abortController.abort();
    }, [reservation_id])

    function changeHandler({target}){
        setReservation({...reservation, [target.name]: target.value})
    }

    function submitHandler(event) {
        event.preventDefault();
        const abortController = new AbortController();
        const validationErrors = validateReservation(reservation)
        if (validationErrors.length) {
           setError(validationErrors)
        } else {
            updateReservation(reservation_id, reservation, abortController.signal)
            .then(() => history.push(`/dashboard?date=${reservation.reservation_date}`))
            .catch(setError)
        }
        
        
        return () => abortController.abort();

    }
    

    return (
        <>  
            <h4>Edit reservation #{reservation_id}</h4>
            <ErrorAlert error= {error}/>
            <ReservationForm reservation={reservation} changeHandler={changeHandler} submitHandler={submitHandler}/>
        </>
        
    )
}

export default EditReservation;