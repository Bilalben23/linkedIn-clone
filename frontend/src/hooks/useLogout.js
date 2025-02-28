import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth'
import useAxios from './useAxios';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useLogout() {
    const { logout } = useAuth();
    const axiosInstance = useAxios();
    const navigate = useNavigate();
    const queryClient = useQueryClient();



    const mutation = useMutation({
        mutationFn: async () => {
            const { data } = await axiosInstance.get("/api/v1/auth/logout");
            return data;
        },
        onSuccess: (data) => {
            if (data.success) {
                logout();
                toast.success("Logout successfully")

                // invalidate ENTIRE query cache
                queryClient.clear();

                navigate("/signin", { replace: true });
            }
        },
        onError: (err) => {
            console.error("Logout failed", err);
            toast.error("Logout failed. Please try again.");
        }
    })

    return mutation.mutate;
}
