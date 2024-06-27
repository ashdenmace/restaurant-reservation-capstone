import React from "react";

/**
 * Defines the alert message to render if the specified error is truthy.
 * @param error
 *  an instance of an object with `.message` property as a string, typically an Error instance.
 * @returns {JSX.Element}
 *  a bootstrap danger alert that contains the message string.
 */

function ErrorAlert({ error }) {
  if (!error) return null;

  const errors = Array.isArray(error) ? error : [error.message];

  let key = 1

  return (
    <div className="alert alert-danger m-2">
      {errors.map((err) => (
        <div key={key++}>Error: {err}</div>
      ))}
    </div>
  );
}

export default ErrorAlert;
