function TablesCard({table}) {
   
    return (
        <>
            <div className="card my-2">
                <div className="card-header d-flex justify-content align-items-center">
                    <h3>{table.table_name}</h3>
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