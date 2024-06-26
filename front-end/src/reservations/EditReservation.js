import ReservationForm from "./ReservationForm"
import {useState, useEffect} from "react"
import {useParams} from "react-router-dom"
import {readReservation} from "../utils/api"


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

    function finishHandler(event) {
        event.preventDefault();
        
    }
    console.log(reservation)
    

    return (
        <ReservationForm reservation={reservation} changeHandler={changeHandler}/>
    )
}

export default EditReservation;