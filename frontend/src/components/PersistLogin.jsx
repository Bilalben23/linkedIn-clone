import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth';
import useRefresh from '../hooks/useRefresh';
import { Outlet } from 'react-router-dom';

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
        ? <div className="flex items-center justify-center min-h-screen">
            <img
                src="/assets/loading-spinner.gif"
                alt='loading-spinner'
                className='size-12'
            />
        </div>
        : <Outlet />
}
