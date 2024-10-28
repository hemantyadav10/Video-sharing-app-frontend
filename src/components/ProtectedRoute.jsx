import React from 'react'
import { useAuth } from '../context/authContext'
import { Navigate, Outlet } from 'react-router-dom'

function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  console.log(isAuthenticated)

  return isAuthenticated ? <Outlet /> : <Navigate to={'/'} />

}

export default ProtectedRoute