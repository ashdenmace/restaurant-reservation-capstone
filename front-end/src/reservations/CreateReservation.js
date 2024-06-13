import react, {useState, useEffect} from "react"
import {useHistory} from "react-router-dom"
import ReservationForm from "../reservations/ReservationForm"
import {createReservation} from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert"

function CreateReservation() {
    const history = useHistory();
    const blankState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1
    }

    const [reservation, setReservation] = useState(blankState);
    const [errors, setErrors] = useState(null);
    const abortController = new AbortController();

    useEffect(() => {
        return () => {
            abortController.abort();
        };
    }, []);

    function changeHandler(event) {
        const { name, value } = event.target;
        setReservation((prevReservation) => {
            const updatedValue = name === "people" ? Number(value) : value;
            const updatedReservation = { ...prevReservation, [name]: updatedValue };
            console.log(updatedReservation);
            return updatedReservation;
        });
    }
    
    

    async function submitHandler(event) {
        event.preventDefault();
        try{
            console.log(reservation)
            const response = await createReservation(reservation, abortController.signal)
            history.push(`/dashboard?date=${reservation.reservation_date}`);
            setReservation(blankState)
        } catch (error) {
            setErrors(error)
        }
        
    }


    return (
        <>
            <h1>Create a Reservation</h1>
            <ErrorAlert error={errors}/>
            <ReservationForm reservation={reservation} changeHandler={changeHandler} submitHandler={submitHandler}/>
        </>
    )
}

export default CreateReservation;