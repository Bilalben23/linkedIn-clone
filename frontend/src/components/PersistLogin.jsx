import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth';
import useRefresh from '../hooks/useRefresh';
import { Outlet } from 'react-router-dom';
import { PropagateLoader } from "react-spinners";

export default function PersistLogin() {

    const [isLoading, setIsLoading] = useState(true);
    const { authState } = useAuth();
    const refresh = useRefresh();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (err) {
                console.error(err);

            } finally {
                setIsLoading(false);
            }
        }

        !authState.isAuthenticated ? verifyRefreshToken() : setIsLoading(false);

    }, [authState.isAuthenticated, refresh])


    return isLoading
        ? <div className="min-h-screen flex items-center justify-center">
            <PropagateLoader color="#0073b1" size={20} />
        </div>
        : <Outlet />
}
