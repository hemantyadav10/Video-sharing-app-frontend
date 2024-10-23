import React from 'react'
import { useAuth } from '../context/authContext'
import { Navigate, Outlet } from 'react-router-dom'

function PublicRoute() {
  const { isAuthenticated } = useAuth()

  return isAuthenticated ? <Navigate to={'/'} /> : <Outlet />
}

export default PublicRoute
