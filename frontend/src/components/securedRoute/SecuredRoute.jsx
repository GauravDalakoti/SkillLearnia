import React from 'react'
import { Navigate } from 'react-router-dom'

const SecuredRoutes = ({ children }) => {

    const instructorToken = localStorage.getItem("instructorToken")
    return instructorToken ? children : <Navigate to="/sign-in" />;
}

export default SecuredRoutes