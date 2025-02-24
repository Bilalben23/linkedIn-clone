import React from 'react'
import useAuth from '../hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
    const { authState } = useAuth();

    return authState.isAuthenticated
        ? <Outlet />
        : <Navigate to="/signin" replace />
}
