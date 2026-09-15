import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { currentUser } from '../data.js'

// Gate for staff-only routes. Unauthenticated visitors are sent to the
// login page, remembering where they were headed so they land there after.
export default function RequireAuth({ children }) {
  const loc = useLocation()
  const user = currentUser()
  if (!user) {
    return <Navigate to="/login" replace state={{ from: loc.pathname + loc.search }} />
  }
  return children
}
