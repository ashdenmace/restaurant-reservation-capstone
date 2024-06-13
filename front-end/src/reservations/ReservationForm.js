import React from "react"
import {useHistory, useParams, useRouteMatch} from "react-router-dom"

// submitHandler, reservation, changeHandler
function ReservationForm({submitHandler, reservation, changeHandler}){
    const history = useHistory();
    
    return (
        <div>
            <form onSubmit={submitHandler} >
                <div className="form-group">
                    <label className="form-label">First name</label>
                    <input className="form-control" id="first_name" name="first_name" value={reservation.first_name} onChange={changeHandler}></input>
                </div>

                <div className="form-group">
                    <label className="form-label">Last name</label>
                    <input className="form-control" id="last_name" name="last_name" value={reservation.last_name} onChange={changeHandler}></input>
                </div>

                <div className="form-group">
                    <label className="form-label">Mobile number</label>
                    <input className="form-control" id="mobile_number" name="mobile_number" value={reservation.mobile_number} onChange={changeHandler}></input>
                </div>

                <div className="form-group">
                    <label className="form-label">Date of Reservation</label>
                    <input className="form-control" id="reservation_date" name="reservation_date" type="date" pattern="\d{4}-\d{2}-\d{2}" value={reservation.reservation_date} onChange={changeHandler} placeholder="YYYY-MM-DD"></input>
                </div>
              
                <div className="form-group">
                    <label className="form-label">Time of reservation</label>
                    <input className="form-control" id="reservation_time" name="reservation_time" type="time" pattern="[0-9]{2}:[0-9]{2}" value={reservation.reservation_time} onChange={changeHandler} placeholder="HH:MM" ></input>
                </div>
                
                <div className="form-group">
                    <label className="form-label">Party Size</label>
                    <input className="form-control" id="people" name="people" value={reservation.people} onChange={changeHandler}></input>
                </div>
                
                <button type="submit" className="btn btn-primary">Submit</button>
                <button className="btn btn-danger" onClick={() => history.goBack()}>Cancel</button>
            </form>
        </div>
        
    )
}

export default ReservationForm