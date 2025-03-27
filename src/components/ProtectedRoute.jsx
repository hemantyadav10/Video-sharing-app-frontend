import React from 'react'
import { useAuth } from '../context/authContext'
import { Navigate, Outlet, useOutletContext } from 'react-router-dom'

function ProtectedRoute() {
  const { isAuthenticated } = useAuth()

  return isAuthenticated ? <Outlet context={useOutletContext()} /> : <Navigate to={'/'} />

}

export default ProtectedRoute
