import {useState} from "react"
import {useHistory} from "react-router-dom"
import ErrorAlert from "../layout/ErrorAlert"
import {createTable} from "../utils/api"

function TablesForm() {
    const blankForm = {
        table_name: "",
        capacity: "",
    }
    
    const [table, setTable] = useState(blankForm)
    const [errors, setErrors] = useState(null)
    const history = useHistory();
    const abortController = new AbortController()

    function changeHandler(event) {
        const { name, value } = event.target;
        setTable((prevTable) => {
            const updatedTable = { ...prevTable, [name]: value };
            return updatedTable;
        });
    }
    console.log(table)

    const validateTable = (table) => {
        const errors = []
        if (table.table_name.length < 2) {
            errors.push("Table name must be longer than one character")
        }
        
        return errors
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        
        const validationErrors = validateTable(table)
        if (validationErrors.length) {
            setErrors(validationErrors)
        } else {
            try{
                table["capacity"] = Number(table.capacity)
                console.log(table)
                await createTable(table, abortController.signal)
                history.push("/dashboard")
            }catch (error) {
                setErrors(error)
            }
            
        }
        return () => abortController.abort();
    }
    
    return (
        <div>
            <h1 className="my-4 formH">Create a table</h1>
            <ErrorAlert error={errors} />
            <form onSubmit={submitHandler} >
                <div className="form-group">
                    <label className="form-label">Table Name</label>
                    <input className="form-control" id="table_name" name="table_name" value={table.table_name} onChange={changeHandler}></input>
                </div>

                <div className="form-group">
                    <label className="form-label">Capacity</label>
                    <input className="form-control" id="capacity" name="capacity" type="number" value={table.capacity} onChange={changeHandler}></input>
                </div>
                <div>
                    <button className="btn btn-danger" onClick={() => history.goBack()}>Cancel</button>
                    <button type="submit" className="btn btn-primary mx-2">Submit</button>
                </div> 
            
        </form>
    </div>
    )
}

export default TablesForm;