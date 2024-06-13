function ErrorsDiplay({errors}) {
    if (errors !== null) {
        if (errors.length) {
            return (
                <div className="alert alert-danger">
                    <h3>Errors: </h3>
                    {errors.map((error) => 
                    <p key={errors.indexOf(error)}>{error.message}</p>
                    )}
                </div>
            )
        }
    }
    return null;
}

export default ErrorsDiplay;