import useAuth from '../hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom';

export default function PublicRoute() {
    const { authState } = useAuth();

    return authState.isAuthenticated ? <Navigate to="/" replace /> : <Outlet />

}
