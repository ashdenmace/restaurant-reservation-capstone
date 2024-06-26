function TablesCard({table, finishHandler}) {
   
    return (
        <>
            <div className="card my-2">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h3 style={{color: "white"}}>{table.table_name}</h3>
                    {table.reservation_id ? <button className="btn btn-warning" data-table-id-finish={table.table_id} onClick={finishHandler}>Finish</button> : null}
                </div>
                <ul className="list-group">
                    <li className="list-group-item">Capacity: {table.capacity}</li>
                    <li className="list-group-item" data-table-id-status={`${table.table_id}`}> {table.reservation_id ? "Occupied" : "Free"}</li>
                </ul>
            </div>
        </>
    )
}



export default TablesCard