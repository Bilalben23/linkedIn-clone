import { useEffect } from 'react'
import useRefresh from './useRefresh'
import useAuth from './useAuth';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../utils/axiosInstance';

export default function useAxios() {
    const refresh = useRefresh();
    const { authState } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        // request interceptor (attach access token to the request)
        const requestInterceptor = axiosInstance.interceptors.request.use(
            (config) => {
                if (authState.accessToken) {
                    config.headers.set("Authorization", `Bearer ${authState.accessToken}`);
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // response interceptor (handle access token expiration)
        const responseInterceptor = axiosInstance.interceptors.response.use(
            response => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response?.status === 401) {
                    try {
                        // Attempt refresh new access token
                        const newAccessToken = await refresh();
                        if (!newAccessToken) {
                            logout();
                            navigate("/signin");
                            return Promise.reject(error);
                        }

                        // retry the original request with new access token
                        originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`)
                        return axiosInstance(originalRequest);
                    } catch (refreshError) {
                        console.error("Token refresh failed", refreshError.message);
                        logout();
                        navigate("/signin");
                    }
                }

                // if not a 401 authorization error, reject promise as usual
                return Promise.reject(error);
            }
        )

        return () => {
            axiosInstance.interceptors.request.eject(requestInterceptor);
            axiosInstance.interceptors.response.eject(responseInterceptor);
        }
    }, [refresh, authState, navigate])


    return axiosInstance;
}
